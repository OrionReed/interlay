import { htmlToShape } from '@/utils/html'
import { HTMLShape, HTMLBaseShape } from '@/shapes/HTMLShapeUtil'
import { generateText } from '@/systems/hooks/useGenerateText'
import { TLArrowShape, TLGeoShape, TLShape, TLShapePartial, TLUnknownShape, VecLike } from '@tldraw/tldraw'
import { StateNode } from 'tldraw'

export class LLMTool extends StateNode {
  static override id = 'llm'

  override onEnter = () => {
    const selectedShapes = this.editor.getSelectedShapes()
    if (selectedShapes.length === 0) return
    const arrowShapes = selectedShapes.filter(shape => shape.type === 'arrow') as TLArrowShape[]
    this.process(arrowShapes)
    this.editor.setCurrentTool('select')
  }

  override onPointerDown = () => {
    const { currentPagePoint } = this.editor.inputs
    const shape = this.editor.getShapeAtPoint(currentPagePoint)
    if (shape) {
      // If it's an arrow, do LLM stuff
    }
  }


  process = (arrows: TLArrowShape[]) => {
    for (const arrow of arrows) {
      console.log(arrow)
      let startShape: TLShape | undefined;
      let endShape: TLShape | undefined;
      let startPos: VecLike | undefined;
      let endPos: VecLike | undefined;
      const text = arrow.props.text
      if (arrow.props.start.type === 'binding') {
        startShape = this.editor.getShape(arrow.props.start.boundShapeId)
      } else if (arrow.props.start.type === 'point') {
        startPos = { x: arrow.props.start.x, y: arrow.props.start.y }
      }
      if (arrow.props.end.type === 'binding') {
        endShape = this.editor.getShape(arrow.props.end.boundShapeId)
      } else if (arrow.props.end.type === 'point') {
        endPos = { x: arrow.props.end.x, y: arrow.props.end.y }
      }
      if (startShape && endShape) {
        // @ts-ignore
        const input = startShape.props.html || startShape.props.text
        const boxShape: TLShapePartial<TLGeoShape> = {
          id: endShape.id,
          type: 'geo',
          props: {
            text: '⏳',
            size: "s",
            font: 'sans'
          }
        }
        const updateShapeText = (text: string) => {
          this.editor.updateShape({
            ...boxShape, props: {
              ...boxShape.props, align: 'start',
              verticalAlign: 'start', text
            }
          })
        }
        this.editor.updateShape(boxShape)
        generateText(`Instruction: ${text}\n\nInput: ${input}`, updateShapeText)
      }
    }
  }
}

