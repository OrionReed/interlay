import { htmlToShape } from '@/hooks/useInterlay'
import { HTMLShape, HTMLBaseShape } from '@/shapes/HTMLShapeUtil'
import { generate, useGenerateText } from '@/systems/hooks/useGenerateText'
import { TLArrowShape, TLShape, TLUnknownShape, VecLike } from '@tldraw/tldraw'
import { StateNode } from 'tldraw'

export class LLMTool extends StateNode {
  static override id = 'llm'

  override onEnter = () => {
    const selectedShapes = this.editor.getSelectedShapes()
    // if (selectedShapes.length === 0) return
    const arrowShapes = selectedShapes.filter(shape => shape.type === 'arrow') as TLArrowShape[]
    console.log('onEnter')
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
    console.log('process')
    for (const arrow of arrows) {
      let startShape: TLShape | undefined;
      let endShape: TLShape | undefined;
      let startPos: VecLike | undefined;
      let endPos: VecLike | undefined;
      const text = arrow.props.text
      if (arrow.props.start.type === 'binding') {
        startShape = this.editor.getShape(arrow.props.start.boundShapeId)
        console.log('startShape', startShape)
      } else if (arrow.props.start.type === 'point') {
        startPos = { x: arrow.props.start.x, y: arrow.props.start.y }
      }
      if (arrow.props.end.type === 'binding') {
        endShape = this.editor.getShape(arrow.props.end.boundShapeId)
      } else if (arrow.props.end.type === 'point') {
        endPos = { x: arrow.props.end.x, y: arrow.props.end.y }
      }
      if (startShape && endShape) {
        console.log('startShape and endShape')
        const input = startShape.props.html || startShape.props.text
        console.log('input', input)
        const result = generate(`Instruction: ${text}\n\nInput: ${input}`)
        result.then(res => {
          console.log('result', res)
          this.editor.updateShape({ id: endShape.id, type: endShape.type, props: { text: res } })
        })
        // console.log('result', result)
        // this.editor.updateShape({ id: endShape.id, type: endShape.type, props: { text: result } })
      }
    }
    console.log('arrows', arrows);
  }
}

