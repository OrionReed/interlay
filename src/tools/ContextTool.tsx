import { HTMLShape } from '@/shapes/HTMLShapeUtil'
import { TLArrowShape, TLGeoShape, TLShape, TLShapeId, TLShapePartial, VecLike, createShapeId } from '@tldraw/tldraw'
import { StateNode } from 'tldraw'
import { CollectionsService } from '@/collections'
import { QueryResult, queryVectorstore } from '@/utils/queryVectorstore'
import { ContextShape } from '@/shapes/ContextShapeUtil'

export class ContextTool extends StateNode {
  static override id = 'context'

  override onEnter = () => {
    console.log('onEnter context')
    const selectedShapes = this.editor.getSelectedShapes()
    this.createContextGraph(selectedShapes)
    this.editor.setCurrentTool('select')
  }

  createArrowPartial(from: TLShapeId, to: TLShapeId): TLShapePartial<TLArrowShape> {
    return {
      id: createShapeId(),
      type: 'arrow',
      props: {
        start: {
          type: 'binding',
          boundShapeId: from,
          normalizedAnchor: { x: 0.5, y: 0.5 },
          isExact: false,
          isPrecise: true,
        },
        end: {
          type: 'binding',
          boundShapeId: to,
          normalizedAnchor: { x: 0.5, y: 0.5 },
          isExact: false,
          isPrecise: true,
        }
      }
    }
  }

  createNodePartial(centerPos: VecLike, text: string, source: string, title: string): TLShapePartial<ContextShape> {
    const w = 400
    const h = 200
    return {
      id: createShapeId(),
      type: 'context',
      x: centerPos.x - w / 2,
      y: centerPos.y - h / 2,
      props: {
        w,
        h,
        text,
        source,
        title
      }
    }
  }

  createGraph = (root: HTMLShape, shapes: TLShapePartial[]) => {
    const graphCollection = CollectionsService.getCollection('graph')
    graphCollection.add([root as TLShape])
    const shapesToAdd = []
    for (const shape of shapes) {
      this.editor.createShape(shape)
      shapesToAdd.push(this.editor.getShape(shape.id))
    }
    graphCollection.add(shapesToAdd)
  }

  createContextGraph = async (shapes: TLShape[]) => {
    for (const s of shapes) {
      if (s.type !== 'html') return;
      const shape = s as HTMLShape
      const text = shape.props.text

      const nodes: TLShapePartial<ContextShape>[] = []
      const arrows: TLShapePartial<TLArrowShape>[] = []

      await queryVectorstore(text, (results: QueryResult[]) => {
        for (const result of results) {
          const node = this.createNodePartial(
            { x: shape.x + shape.props.w / 2, y: shape.y + shape.props.h / 2 },
            result.page_content,
            result.metadata.url,
            result.metadata.title)
          const arrow = this.createArrowPartial(shape.id, node.id)
          nodes.push(node)
          arrows.push(arrow)
        }
        this.createGraph(shape, [...nodes, ...arrows])
      }, 5)
    }
  }
}

