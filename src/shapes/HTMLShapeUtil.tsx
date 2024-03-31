import { Rectangle2d, resizeBox, TLBaseBoxShape, TLBaseShape, TLOnResizeHandler } from '@tldraw/tldraw';
import { HTMLContainer, ShapeUtil } from 'tldraw'

type HTMLBaseShape = TLBaseShape<'html', { w: number; h: number, html: string, parentStyle: Record<string, string> }>
type OmittedHTMLShapeProps = 'rotation' | 'index' | 'parentId' | 'isLocked' | 'opacity' | 'typeName' | 'meta';

export type HTMLShape = Omit<HTMLBaseShape, OmittedHTMLShapeProps>;


export class HTMLShapeUtil extends ShapeUtil<HTMLBaseShape> {
  static override type = 'html' as const
  override canBind = () => true
  override canEdit = () => false
  override canResize = () => true
  override canSnap = () => true
  override isAspectRatioLocked = () => false

  getDefaultProps(): HTMLShape['props'] {
    return {
      w: 100,
      h: 100,
      html: "<div></div>",
      parentStyle: {}
    }
  }

  override onResize: TLOnResizeHandler<HTMLBaseShape> = (shape: TLBaseBoxShape, info) => {
    return resizeBox(shape, info)
  }

  getGeometry(shape: HTMLShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: HTMLShape) {
    const parentStyle = shape.props.parentStyle;
    const html = shape.props.html;
    return <HTMLContainer id={shape.id} dangerouslySetInnerHTML={{ __html: html }} style={parentStyle} className="html-shape-container" />;
  }

  indicator(shape: HTMLShape) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}