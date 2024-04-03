import { Rectangle2d, resizeBox, TLBaseShape, TLOnClickHandler, TLOnResizeHandler } from '@tldraw/tldraw';
import { HTMLContainer, ShapeUtil, TLOnDoubleClickHandler } from 'tldraw'
import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import { useGenerateText } from '@/systems/hooks/useGenerateText';

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
      w: 300,
      h: 300,
      code: "function foo() {\n// Do something\n}",
    }
  }

  override onResize: TLOnResizeHandler<CodeBaseShape> = (shape: CodeBaseShape, info) => {
    return resizeBox(shape, info)
  }

  override onClick: TLOnClickHandler<CodeBaseShape> = (shape: CodeShape) => {
  }
  override onDoubleClick: TLOnDoubleClickHandler<CodeBaseShape> = (shape: CodeShape) => {

  }

  getGeometry(shape: CodeShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: CodeShape) {
    const [code, setCode] = React.useState(shape.props.code);
    const handleRun = () => {

    }
    return <HTMLContainer id={shape.id} style={{ pointerEvents: 'all' }}>
      <Editor
        value={code}
        onValueChange={code => setCode(code)}
        highlight={code => highlight(code, languages.js)}
        padding={10}
        style={{
          marginBottom: 5,
          width: '100%',
          height: '100%',
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          outline: '1px solid rgba(0,0,0,0.5)',
          borderRadius: 4,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleRun}>Run</button>
      </div>
    </HTMLContainer>;
  }

  indicator(shape: CodeShape) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}