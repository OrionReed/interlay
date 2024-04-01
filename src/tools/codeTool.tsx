import { StateNode } from 'tldraw'

const OFFSET = 12
export class CodeTool extends StateNode {
  static override id = 'code'

  override onEnter = () => {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }

  override onPointerDown = () => {
    const { currentPagePoint } = this.editor.inputs
    this.editor.createShape({
      type: 'text',
      x: currentPagePoint.x - OFFSET,
      y: currentPagePoint.y - OFFSET,
      props: { text: '❤️' },
    })
  }
}