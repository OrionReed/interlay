import { HTMLShape } from '@/shapes/HTMLShapeUtil';
import { VecLike, createShapeId } from '@tldraw/tldraw';
import { useState, useEffect } from 'react';

const patterns = [
  {
    regex: /orionreed.com/,
    selectors: ['main > *'],
  },
  {
    regex: /.*/,
    selectors: ['article', 'section', 'nav', 'table', 'ul', 'p', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'iframe', 'blockquote', 'pre']
  },
  // Add more patterns as needed
];

export function htmlToShape(element: HTMLElement, viewOffset: VecLike = { x: 0, y: 0 }): HTMLShape {
  const outerRect = element.getBoundingClientRect();
  const innerRect = createBoundingBoxFromChildRects(element.children);
  const hasText = Array.from(element.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);

  let rect: DOMRect;
  if (hasText && innerRect) {
    // If the element has text and an inner rectangle (children), use the outer rectangle
    rect = outerRect;
  } else if (!hasText && innerRect) {
    // If the element does not have text but has an inner rectangle, use the inner rectangle
    rect = innerRect;
  } else if (hasText && !innerRect) {
    // If the element has text but no inner rectangle (no children), adjust bounds to the width of the text
    const fitElements = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    if (fitElements.includes(element.tagName)) {
      rect = new DOMRect(outerRect.left, outerRect.top, measureElementTextWidth(element), outerRect.height);
    } else {
      rect = outerRect;
    }

  } else {
    // Fallback to using the outer rectangle
    rect = outerRect;
  }

  let parentStyle: Record<string, string> = {};
  if (element.parentElement) {
    parentStyle = getContainerStyle(element.parentElement);
  }

  return {
    id: createShapeId(),
    type: 'html',
    x: outerRect.left + viewOffset.x,
    y: outerRect.top + viewOffset.y,
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

export function getContainerStyle(element: HTMLElement): Record<string, string> {
  const style: Record<string, string> = {};
  const computedStyle = window.getComputedStyle(element);
  for (let i = 0; i < computedStyle.length; i++) {
    const propName = computedStyle[i];
    if (propName === 'font-size') {
      style[propName] = computedStyle.getPropertyValue(propName);
    }
  }
  style.padding = '0px';
  style.margin = '0px';
  return style;
}

function createBoundingBoxFromChildRects(children: HTMLCollection): DOMRect | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const child of children) {
    const rect = child.getBoundingClientRect();
    minX = Math.min(minX, rect.left);
    minY = Math.min(minY, rect.top);
    maxX = Math.max(maxX, rect.right);
    maxY = Math.max(maxY, rect.bottom);
  }
  if (minX === Infinity) return null;
  return new DOMRect(minX, minY, maxX - minX, maxY - minY);
}

function measureElementTextWidth(element: HTMLElement): number {
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
  return width
}

