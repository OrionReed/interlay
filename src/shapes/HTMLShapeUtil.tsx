import { Rectangle2d, resizeBox, TLBaseShape, TLOnBeforeUpdateHandler, TLOnResizeHandler } from '@tldraw/tldraw';
import { ShapeUtil } from 'tldraw'
import root from 'react-shadow';
import { useBodyStyles } from '@/hooks/useBodyStyles';
import { getComputedStyles } from '@/utils/style';

export type HTMLBaseShape = TLBaseShape<'html', { w: number; h: number, text: string, parentStyle: Record<string, string>, interlayId: string | null }>
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
      w: 300,
      h: 200,
      text: "",
      interlayId: null,
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
    const element = document.querySelector(`[data-interlay-id="${shape.props.interlayId}"]`);
    const subtreeStyles = getComputedStyles(element as HTMLElement);
    // const containerStyles = getComputedStyles(element.parentElement);
    const style = `
    <style>
      .html-shape-inner > * {
        margin: 0;
        padding: 0;
        ${subtreeStyles}
      }
    </style>
  `;
    return <root.div mode="open">
      <div
        id={shape.id}
        // style={subtreeStyles}
        dangerouslySetInnerHTML={{ __html: style + shape.props.text }}
        className="html-shape-inner"
      />
    </root.div>
  }

  indicator(shape: HTMLShape) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}