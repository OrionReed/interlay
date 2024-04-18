import { htmlToShape } from '@/utils/html'
import { HTMLShape, HTMLBaseShape } from '@/shapes/HTMLShapeUtil'
import { TLArrowShape, TLShape, TLShapePartial, TLUnknownShape, createShapeId } from '@tldraw/tldraw'
import { StateNode } from 'tldraw'
import { CollectionsService } from '@/collections'

export class ContextTool extends StateNode {
  static override id = 'context'

  override onEnter = () => {
    console.log('onEnter context')
    const selectedShapes = this.editor.getSelectedShapes()
    if (selectedShapes.length === 0) return
    const graphCollection = CollectionsService.getCollection('graph')
    const tempShapes = [];
    for (let i = 0; i < selectedShapes.length * Math.floor(Math.random() * 5) + 1; i++) {
      const randomSelectedShapeIndex = Math.floor(Math.random() * selectedShapes.length)
      const tempShape = { type: 'geo', id: createShapeId(), x: selectedShapes[randomSelectedShapeIndex].x, y: selectedShapes[randomSelectedShapeIndex].y, props: { w: 250, h: 150, fill: 'solid' } }

      const arrow: TLShapePartial<TLArrowShape> = {
        id: createShapeId(),
        type: 'arrow',
        props: {
          start: {
            type: 'binding',
            boundShapeId: tempShape.id,
            normalizedAnchor: { x: 0.5, y: 0.5 },
            isExact: false,
            isPrecise: true,
          },
          end: {
            type: 'binding',
            boundShapeId: selectedShapes[randomSelectedShapeIndex].id,
            normalizedAnchor: { x: 0.5, y: 0.5 },
            isExact: false,
            isPrecise: true,
          }
        }
      }
      tempShapes.push(arrow, tempShape);
    }
    this.editor.createShapes(tempShapes)
    const createdShapes = []
    const createdArrows = []
    for (const shape of tempShapes) {
      createdShapes.push(this.editor.getShape(shape.id))
      createdArrows.push({ type: 'arrow', id: createShapeId(), props: { points: [shape.id, tempShapes[0].id] } })
    }

    graphCollection.add([...selectedShapes, ...createdShapes])
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

