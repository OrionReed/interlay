import { Rectangle2d, resizeBox, TLBaseShape, TLOnBeforeUpdateHandler, TLOnResizeHandler } from '@tldraw/tldraw';
import { useEffect, useRef } from 'react';
import { ShapeUtil } from 'tldraw'

export type HTMLBaseShape = TLBaseShape<'html', { w: number; h: number, text: string, parentStyle: Record<string, string> }>
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
      text: "",
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
    const DynamicHTMLContent = ({ html, parentStyle }) => {
      const containerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        const executeScripts = () => {
          const scripts = containerRef.current.querySelectorAll('script');
          for (const script of scripts) {
            const newScript = document.createElement('script');
            // Copy all attributes from the original script to the new script
            [...script.attributes].forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.async = false; // Ensure scripts are executed in the order they are defined
            newScript.textContent = script.innerText;

            document.body.appendChild(newScript); // Append to body to ensure execution

            // Optionally, remove the script after execution if not needed
            newScript.parentNode.removeChild(newScript);
          }
        };

        if (containerRef.current) {
          // Execute any scripts after a slight delay to ensure they are processed after HTML is fully loaded
          setTimeout(executeScripts, 0);
        }
      }, [html]); // Re-run this effect if html changes

      return (
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: html }}
          style={{ ...parentStyle, pointerEvents: 'all' }}
          className="html-shape-container"
          id={shape.id}
        />
      );
    };

    return <DynamicHTMLContent html={shape.props.text} parentStyle={shape.props.parentStyle} />;
  }

  indicator(shape: HTMLShape) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}