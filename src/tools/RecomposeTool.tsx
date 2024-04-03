import { HTMLBaseShape } from '@/shapes/HTMLShapeUtil'
import { TLShape, TLShapePartial, createShapeId } from '@tldraw/tldraw'
import { StateNode } from 'tldraw'

export class RecomposeTool extends StateNode {
  static override id = 'recompose'

  override onEnter = () => {
    const selectedShapes = this.editor.getSelectedShapes()
    if (selectedShapes.length <= 0) return
    this.recompose(selectedShapes)
    this.editor.setCurrentTool('select')
  }

  recompose = (shapes: TLShape[]) => {
    if (shapes.length <= 1) return

    const bounds = this.editor.getSelectionPageBounds();
    const elements: HTMLElement[] = [];

    for (const shape of shapes) {
      if (shape.type !== 'html') continue;
      const element = document.getElementById(shape.id);
      if (element && element.children.length > 0) {
        elements.push(element.children[0] as HTMLElement);
      }
      this.editor.deleteShape(shape.id);
    }
    const recomposedElement = containElements(elements);

    const recomposedShape: TLShapePartial<HTMLBaseShape> = {
      type: "html",
      id: createShapeId(),
      x: bounds.minX,
      y: bounds.minY,
      props: {
        w: bounds.width,
        h: bounds.height,
        html: recomposedElement.innerHTML,
      }
    }
    this.editor.createShapes([recomposedShape]);
  }
}

function containElements(elements: HTMLElement[]): HTMLElement {
  // Define the mapping of elements to their containers
  const containmentMap: Record<string, string> = {
    LI: 'UL',
    SUMMARY: 'DETAILS'
  };

  // Create a root container for all elements
  const rootContainer = document.createElement('div');

  // Object to hold groups of elements that need specific containers
  const groups: Record<string, HTMLElement[]> = {};

  // Separate elements into groups based on containmentMap
  for (const element of elements) {
    const containerType = containmentMap[element.tagName];
    if (containerType) {
      if (!groups[containerType]) {
        groups[containerType] = [];
      }
      groups[containerType].push(element);
    } else {
      // If the element does not need a specific container, append it directly to the root container
      rootContainer.appendChild(element);
    }
  }

  // For each group, create the specified container and append the elements to it
  for (const [containerType, groupedElements] of Object.entries(groups)) {
    const container = document.createElement(containerType);
    for (const element of groupedElements) {
      container.appendChild(element);
    }
    // Append the container to the root container
    rootContainer.appendChild(container);
  }

  return rootContainer;
}

