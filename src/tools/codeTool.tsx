import { BaseBoxShapeTool } from '@tldraw/tldraw'
import { StateNode } from 'tldraw'

export class CodeTool extends BaseBoxShapeTool {
  static override id = 'code'
  static override initial = 'idle'
  override shapeType = 'code'
}