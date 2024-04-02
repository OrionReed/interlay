import { getStyle, htmlToShape } from '@/hooks/useInterlay'
import { HTMLShape, HTMLBaseShape } from '@/shapes/HTMLShapeUtil'
import { TLShape, TLUnknownShape, createShapeId } from '@tldraw/tldraw'
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
    if (shapes.length <= 1 || shapes[0].type !== 'html') return
    const first = shapes[0] as HTMLShape;
    const previousParentHTML: string = first.props.previousParentHtml;
    const element = elementFromHTML(previousParentHTML);
    const safeElement = element instanceof Element ? element : document.createElement('div');
    const bounds = this.editor.getSelectionPageBounds();
    for (const shape of shapes) {
      if (shape.type !== 'html') continue;
      const containerRoot = document.getElementById(shape.id).children[0];
      if (!containerRoot) return
      safeElement.appendChild(containerRoot);

      this.editor.deleteShape(shape.id);
    }
    const recomposedShape: HTMLShape = {
      id: createShapeId(),
      x: bounds.minX,
      y: bounds.minY,
      type: "html",
      props: {
        w: bounds.width,
        h: bounds.height,
        html: safeElement.outerHTML,
        parentStyle: first.props.parentStyle,
        previousParentHtml: ""
      }
    }
    this.editor.createShapes([recomposedShape]);
  }
}

/**
 * @param {String} html representing a single element.
 * @param {Boolean} trim representing whether or not to trim input whitespace, defaults to true.
 * @return {Element | HTMLCollection | null}
 */
function elementFromHTML(html: string, trim = false) {
  // Process the HTML string.
  const processed = trim ? html.trim() : html;
  if (!processed) return null;

  // Then set up a new template element.
  const template = document.createElement('template');
  template.innerHTML = processed;
  const result = template.content.children;

  // Then return either an HTMLElement or HTMLCollection,
  // based on whether the input HTML had one or more roots.
  if (result.length === 1) return result[0];
  return result;
}