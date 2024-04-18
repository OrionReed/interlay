import { htmlToShape } from '@/utils/html'
import { HTMLShape, HTMLBaseShape } from '@/shapes/HTMLShapeUtil'
import { TLShape, TLUnknownShape } from '@tldraw/tldraw'
import { StateNode } from 'tldraw'
import { CollectionsService } from '@/collections'

export class ContextTool extends StateNode {
  static override id = 'context'

  override onEnter = () => {
    console.log('onEnter context')
    const selectedShapes = this.editor.getSelectedShapes()
    const graphCollection = CollectionsService.getCollection('graph')
    graphCollection.add(selectedShapes)
    if (selectedShapes.length === 0) return
    this.getContext(selectedShapes)
    this.editor.setCurrentTool('select')
  }

  getContext = (shapes: TLShape[]) => {
    for (const shape of shapes) {
      if (shape.type !== 'html') continue;

      // ?: there should always be one child with 0-n children, but this is brittle to future changes
      const containerRoot = document.getElementById(shape.id).children[0];
      if (!containerRoot) return
      // GET CONTEXT AND MAKE GRAPH
    }
  }
}

