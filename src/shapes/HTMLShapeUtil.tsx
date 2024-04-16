import { Rectangle2d, resizeBox, TLBaseShape, TLOnBeforeUpdateHandler, TLOnResizeHandler } from '@tldraw/tldraw';
import { useEffect, useRef } from 'react';
import { ShapeUtil } from 'tldraw'

export type HTMLBaseShape = TLBaseShape<'html', { w: number; h: number, text: string, parentStyle: Record<string, string>, isProcessing: boolean }>
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
      parentStyle: {},
      isProcessing: false
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
        this.addParentClass(shape, 'overflowing');
      } else {
        this.removeParentClass(shape, 'overflowing');
      }
    }
    return resizeBox(shape, info)
  }

  addParentClass(shape: HTMLShape, className: string) {
    const element = document.getElementById(shape.id);
    if (!element || !element.parentElement) return;
    element.parentElement.classList.add(className);
  }

  removeParentClass(shape: HTMLShape, className: string) {
    const element = document.getElementById(shape.id);
    if (!element || !element.parentElement) return;
    element.parentElement.classList.remove(className);
  }

  getGeometry(shape: HTMLShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: HTMLShape) {
    const DynamicHTMLContent = ({ isProcessing, html, parentStyle }) => {
      const containerRef = useRef<HTMLDivElement | null>(null);
      if (shape.props.isProcessing) {
        this.addParentClass(shape, 'is-processing');
      }
      else {
        this.removeParentClass(shape, 'is-processing');
      }
      useEffect(() => {
        if (isProcessing) return
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
      }, [html, isProcessing]); // Re-run this effect if html changes

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

    return <DynamicHTMLContent isProcessing={shape.props.isProcessing} html={shape.props.text} parentStyle={shape.props.parentStyle} />;
  }

  indicator(shape: HTMLShape) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}