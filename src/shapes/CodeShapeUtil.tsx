import { Rectangle2d, resizeBox, TLBaseBoxShape, TLBaseShape, TLOnResizeHandler } from '@tldraw/tldraw';
import { HTMLContainer, ShapeUtil } from 'tldraw'

type CodeBaseShape = TLBaseShape<'html', { w: number; h: number, code: string }>
type OmittedCodeShapeProps = 'rotation' | 'index' | 'parentId' | 'isLocked' | 'opacity' | 'typeName' | 'meta';

export type CodeShape = Omit<CodeBaseShape, OmittedCodeShapeProps>;


export class CodeShapeUtil extends ShapeUtil<CodeBaseShape> {
  static override type = 'code' as const
  override canBind = () => true
  override canEdit = () => false
  override canResize = () => true
  override canSnap = () => true
  override isAspectRatioLocked = () => false

  getDefaultProps(): CodeShape['props'] {
    return {
      w: 100,
      h: 100,
      code: "function foo() {}",
    }
  }

  override onResize: TLOnResizeHandler<CodeBaseShape> = (shape: CodeBaseShape, info) => {
    return resizeBox(shape, info)
  }

  getGeometry(shape: CodeShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: CodeShape) {
    return <textarea id={shape.id}>{shape.props.code}</textarea>;
  }

  indicator(shape: CodeShape) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}