import { Rectangle2d, resizeBox, TLBaseShape, TLOnBeforeUpdateHandler, TLOnResizeHandler } from '@tldraw/tldraw';
import { ShapeUtil } from 'tldraw'

export type HTMLBaseShape = TLBaseShape<'html', { w: number; h: number, html: string, parentStyle: Record<string, string> }>
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
      html: "",
      parentStyle: {}
    }
  }

  override onTranslate: TLOnBeforeUpdateHandler<HTMLBaseShape> = (prev, next) => {
    if (prev.x !== next.x || prev.y !== next.y) {
      this.editor.bringToFront([next.id]);
    }
  }

  override onResize: TLOnResizeHandler<HTMLBaseShape> = (shape: HTMLBaseShape, info) => {
    const element = document.getElementById(shape.id);
    if (!element || !element.parentElement) return resizeBox(shape, info);
    const { width, height } = element.parentElement.getBoundingClientRect();
    if (element) {
      const isOverflowing = element.scrollWidth > width || element.scrollHeight > height;
      if (isOverflowing) {
        element.parentElement?.classList.add('overflowing');
      } else {
        element.parentElement?.classList.remove('overflowing');
      }
    }
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
    return <div id={shape.id} dangerouslySetInnerHTML={{ __html: html }} style={parentStyle} className="html-shape-container" />;
  }

  indicator(shape: HTMLShape) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}