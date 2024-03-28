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

      const parentStyle: Record<string, string> = {};
      if (child.parentElement) {
        const parentComputedStyle = window.getComputedStyle(child.parentElement);
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
          html: child.outerHTML,
          parentStyle: parentStyle // Assign the plain object instead
        }
      });
    };
  }
  return shapes;
}