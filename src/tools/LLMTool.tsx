import { TLArrowShape, TLGeoShape, TLShape, TLShapePartial, VecLike, createShapeId } from '@tldraw/tldraw'
import { StateNode } from 'tldraw'
import { generateText } from '@/systems/generateText'
import { HTMLBaseShape } from '@/shapes/HTMLShapeUtil'

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
      console.log('arrow', arrow)
      let startShape: TLShapePartial<TLShape> | undefined;
      let endShape: TLShapePartial<TLShape> | undefined;
      const arrowText = arrow.props.text
      if (arrow.props.start.type === 'binding') {
        startShape = this.editor.getShape(arrow.props.start.boundShapeId)
      }
      if (arrow.props.end.type === 'binding') {
        endShape = this.editor.getShape(arrow.props.end.boundShapeId)
      } else if (arrow.props.end.type === 'point') {
        const w = 200
        const h = 150
        const newShape: TLShapePartial<TLGeoShape> = {
          id: createShapeId(),
          type: 'geo',
          x: arrow.props.end.x - w / 2,
          y: arrow.props.end.y - h / 2,
          props: {
            w: w,
            h: w,
            text: '⏳',
            size: "s",
          }
        }
        this.editor.createShape(newShape)
        endShape = newShape
      }
      const input = startShape.props.html || startShape.props.text || ''
      const geoShapePartial: TLShapePartial<TLGeoShape> = {
        id: endShape.id,
        type: 'geo',
        props: {
          text: '⏳',
          size: "s",
          font: 'sans'
        }
      }
      const htmlShapePartial: TLShapePartial<HTMLBaseShape> = {
        id: endShape.id,
        type: 'html',
        props: {
          html: '⏳',
        }
      }
      this.editor.updateShape(geoShapePartial)
      const updateGeoShape = (newText: string) => {
        this.editor.updateShape({
          ...geoShapePartial, props: {
            ...geoShapePartial.props, align: 'start',
            verticalAlign: 'start', text: newText
          }
        })
      }
      const updateHtmlShape = (newText: string) => {
        this.editor.updateShape({
          ...htmlShapePartial, props: {
            ...htmlShapePartial.props, html: newText
          }
        })
      }
      const isTargetHTML = endShape.props.html !== undefined || arrowText.toLowerCase().includes('html')
      if (isTargetHTML && endShape.type !== 'html') {
        const replacementShape: TLShapePartial<HTMLBaseShape> = {
          id: createShapeId(),
          x: endShape.x,
          y: endShape.y,
          type: 'html',
          props: {
            w: endShape.props.w,
            h: endShape.props.h,
            html: '⏳',
          }
        }
        htmlShapePartial.id = replacementShape.id
        this.editor.createShape(replacementShape)
        this.editor.deleteShape(endShape.id)
        const arrowUpdate: TLShapePartial<TLArrowShape> = {
          id: arrow.id,
          type: 'arrow',
          props: {
            end: {
              type: 'binding',
              boundShapeId: replacementShape.id,
              normalizedAnchor: {
                x: 0.5,
                y: 0.5
              },
              isExact: false,
              isPrecise: true
            }
          }
        }
        this.editor.updateShape(arrowUpdate)
      }
      const prompt = getSystemPrompt(isTargetHTML ? 'html' : 'text')
      const updateFunc = (text: string) => {
        if (isTargetHTML) {
          updateHtmlShape(text)
        } else {
          updateGeoShape(text)
        }
      }
      generateText(`Instruction: ${arrowText}\n\nInput: ${input}`, prompt, updateFunc)
    }
  }
}

function getSystemPrompt(type: 'html' | 'text') {
  const textPrompt = "Your answer should be in plaintext."
  const htmlPrompt = "Your answer should be in HTML with inline styles. Do not wrap the html in ``` or other marks. It should be formatted correctly for direct use."
  const basePrompt = "You are a helpful assistant. You will be given an instruction and an input which may be HTML or plaintext."

  return basePrompt + (type === 'html' ? htmlPrompt : textPrompt)

}

