import { HTMLShape } from '@/shapes/HTMLShapeUtil';
import { createShapeId } from '@tldraw/tldraw';
import { useState, useEffect, useMemo } from 'react';

export function useInterlay() {
  const [isCanvasEnabled, setIsCanvasEnabled] = useState(false);
  const [shapes, setShapes] = useState<HTMLShape[]>([]);

  useEffect(() => {
    //@ts-ignore
    const handleMessage = (event) => {
      if (event.data.action && event.data.action === 'interlayCanvasToggle') {
        setIsCanvasEnabled(event.data.detail);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (isCanvasEnabled) {
      (async () => {
        const elements = await gatherShapes();
        setShapes(elements);
      })();
    } else {
      setShapes([]);
    }
  }, [isCanvasEnabled]);

  return { isCanvasEnabled, shapes };
}

async function gatherShapes() {
  const rootElement = document.getElementsByTagName('body')[0];
  const shapes: HTMLShape[] = [];

  if (rootElement) {
    for (const child of rootElement.children) {
      if (['interlayCanvasRoot'].includes(child.id)) continue;
      const rect = child.getBoundingClientRect();

      shapes.push({
        id: createShapeId(),
        type: 'html',
        x: rect.left,
        y: rect.top,
        props: {
          w: rect.width,
          h: rect.height,
          html: child.outerHTML
        }
      });
    };
  }
  return shapes;
}

function measureElementTextWidth(element: HTMLElement) {
  // Create a temporary span element
  const tempElement = document.createElement('span');
  // Get the text content from the passed element
  tempElement.textContent = element.textContent || element.innerText;
  // Get the computed style of the passed element
  const computedStyle = window.getComputedStyle(element);
  // Apply relevant styles to the temporary element
  tempElement.style.font = computedStyle.font;
  tempElement.style.fontWeight = computedStyle.fontWeight;
  tempElement.style.fontSize = computedStyle.fontSize;
  tempElement.style.fontFamily = computedStyle.fontFamily;
  tempElement.style.letterSpacing = computedStyle.letterSpacing;
  // Ensure the temporary element is not visible in the viewport
  tempElement.style.position = 'absolute';
  tempElement.style.visibility = 'hidden';
  tempElement.style.whiteSpace = 'nowrap'; // Prevent text from wrapping
  // Append to the body to make measurements possible
  document.body.appendChild(tempElement);
  // Measure the width
  const width = tempElement.getBoundingClientRect().width;
  // Remove the temporary element from the document
  document.body.removeChild(tempElement);
  // Return the measured width
  return width === 0 ? 10 : width;
}