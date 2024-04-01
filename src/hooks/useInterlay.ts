import { HTMLShape } from '@/shapes/HTMLShapeUtil';
import { Vec, VecLike, createShapeId } from '@tldraw/tldraw';
import { useState, useEffect } from 'react';

const patterns = [
  {
    regex: /orionreed.com/,
    selectors: ['main > *'],
  },
  {
    regex: /.*/,
    selectors: ['article', 'section', 'nav', 'table', 'ul', 'p', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  },
  // Add more patterns as needed
];

export function htmlToShape(element: HTMLElement, relativeTo: VecLike = { x: 0, y: 0 }): HTMLShape {
  const rect = element.getBoundingClientRect();
  let parentStyle: Record<string, string> = {};
  if (element.parentElement) {
    parentStyle = getStyle(element.parentElement);
  }

  return {
    id: createShapeId(),
    type: 'html',
    x: rect.left + relativeTo.x,
    y: rect.top + relativeTo.y,
    props: {
      w: rect.width,
      h: rect.height,
      html: element.outerHTML,
      previousParentHtml: getOuterHtmlWithoutChildren(element.parentElement),
      parentStyle: parentStyle
    }
  };
}

function getOuterHtmlWithoutChildren(element: HTMLElement): string {
  // Clone the original element
  const clone = element.cloneNode(false) as HTMLElement;
  // The clone now has the same attributes as the original element but no children
  return clone.outerHTML;
}

export function useInterlay() {
  const [isCanvasEnabled, setIsCanvasEnabled] = useState(false);
  const [shapes, setShapes] = useState<HTMLShape[]>([]);

  useEffect(() => {
    //@ts-ignore
    const handleMessage = (event) => {
      if (event.data.action && event.data.action === 'enableInterlay') {
        setIsCanvasEnabled(true);
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
      shapes.push(htmlToShape(element))
    };
  }

  return shapes;
}

export function getStyle(element: HTMLElement): Record<string, string> {
  const style: Record<string, string> = {}
  const computedStyle = window.getComputedStyle(element);
  style.fontSize = computedStyle.fontSize;
  return style;
}

