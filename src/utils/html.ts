import { HTMLShape } from '@/shapes/HTMLShapeUtil';
import { VecLike, createShapeId } from '@tldraw/tldraw';
import { createBoundingBoxFromChildRects, measureElementTextWidth } from '@/utils/measure';
import { getContainerStyle } from './style';


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
} export function getOuterHtmlWithoutChildren(element: HTMLElement): string {
  // Clone the original element
  const clone = element.cloneNode(false) as HTMLElement;
  // The clone now has the same attributes as the original element but no children
  return clone.outerHTML;
}

