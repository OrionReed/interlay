import { htmlToShape } from '@/hooks/useInterlay'
import { HTMLShape, HTMLBaseShape } from '@/shapes/HTMLShapeUtil'
import { TLShape, TLUnknownShape } from '@tldraw/tldraw'
import { StateNode } from 'tldraw'

export class DecomposeTool extends StateNode {
  static override id = 'decompose'

  override onEnter = () => {
    const selectedShapes = this.editor.getSelectedShapes()
    if (selectedShapes.length === 0) return
    this.decompose(selectedShapes)
    this.editor.setCurrentTool('select')
  }

  override onPointerDown = () => {
    const { currentPagePoint } = this.editor.inputs
    const shape = this.editor.getShapeAtPoint(currentPagePoint)
    if (shape) {
      this.decompose([shape])
    }
  }


  decompose = (shapes: TLShape[]) => {
    const htmlShapes: HTMLShape[] = []
    for (const shape of shapes) {
      if (shape.type !== 'html') continue;

      // ?: there should always be one child with 0-n children, but this is brittle to future changes
      const containerRoot = document.getElementById(shape.id).children[0];
      if (!containerRoot) return

      const children = containerRoot.children

      // If there are no inner children, then we cannot decompose further
      if (children.length <= 1) return

      // TODO: make this work when zoom != 1
      const view = this.editor.getViewportPageBounds()
      for (const child of children) {
        this.editor.createShapes([htmlToShape(child as HTMLElement, { x: view.minX, y: view.minY })])
      }

      // const htmlShape = shape as HTMLBaseShape;
      // const html = htmlShape.props.html;

      // this.editor.createShapes([htmlShape]); // Assuming you meant to add the individual shape
      this.editor.deleteShape(shape.id);
    }
  }
}

