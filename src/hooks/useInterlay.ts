import { HTMLShape } from '@/shapes/HTMLShapeUtil';
import { createShapeId } from '@tldraw/tldraw';
import { useState, useEffect } from 'react';

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
  const patterns = [
    {
      regex: /.*\.org.*/,
      selectors: ['body > *'],
    },
    {
      regex: /.*/,
      selectors: ['article', 'section', 'nav', 'table', 'ul', 'p', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    },
    // Add more patterns as needed
  ];

  const currentUrl = window.location.href;
  let matchedSelectors: string[] = [];

  // Find the pattern that matches the current website
  for (const pattern of patterns) {
    if (pattern.regex.test(currentUrl)) {
      console.log('Matched pattern:', pattern.regex);
      matchedSelectors = pattern.selectors;
      break;
    }
  }

  const shapes: HTMLShape[] = [];

  if (matchedSelectors.length > 0) {
    const allMatchedElements: HTMLElement[] = [];

    // Collect all elements that match any of the selectors
    for (const selector of matchedSelectors) {
      for (const element of document.querySelectorAll(selector)) {
        allMatchedElements.push(element as HTMLElement);
      }
    }

    // Filter out elements that are descendants of any other matched element
    const filteredElements = allMatchedElements.filter(el =>
      !allMatchedElements.some(otherEl => otherEl !== el && otherEl.contains(el))
    );

    // Convert the filtered elements into shapes
    for (const element of filteredElements) {
      const rect = element.getBoundingClientRect();
      const parentStyle: Record<string, string> = {};
      if (element.parentElement) {
        const parentComputedStyle = window.getComputedStyle(element.parentElement);
        parentStyle.fontSize = parentComputedStyle.fontSize;
        // Add more layout-affecting styles as needed
      }

      shapes.push({
        id: createShapeId(),
        type: 'html',
        x: rect.left,
        y: rect.top,
        props: {
          w: rect.width,
          h: rect.height,
          html: element.outerHTML,
          parentStyle: parentStyle
        }
      });
    };
  }

  return shapes;
}
