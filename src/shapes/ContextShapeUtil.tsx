import { HTMLContainer, Rectangle2d, TLBaseShape } from '@tldraw/tldraw';
import { ShapeUtil } from 'tldraw'

export type ContextShape = TLBaseShape<'context', {
  w: number;
  h: number,
  text: string,
  source: string,
  title: string
}>

export class ContextShapeUtil extends ShapeUtil<ContextShape> {
  static override type = 'context' as const
  override canBind = () => true
  override canEdit = () => false
  override canResize = () => true
  override canSnap = () => true
  override isAspectRatioLocked = () => false

  getDefaultProps(): ContextShape['props'] {
    return {
      w: 400,
      h: 200,
      text: "⌛️",
      source: "",
      title: ""
    }
  }

  getGeometry(shape: ContextShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: ContextShape) {
    return <HTMLContainer style={{
      backgroundColor: "#f9f9f9",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
      borderRadius: "5px",
      padding: "10px",
      pointerEvents: "all",
      overflow: "hidden"
    }}>
      <a style={{ textDecoration: "none" }} target="_blank" rel="noopener noreferrer" href={shape.props.source}>from "{shape.props.title}"</a>
      {shape.props.text.split(/\n\n+/).map((paragraph) => (
        <p>{paragraph}</p>
      ))}
    </HTMLContainer>
  }

  indicator(shape: ContextShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={5} />
  }
}

