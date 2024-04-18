import {
	Editor,
	TLUserPreferences,
	setUserPreferences,
} from '@tldraw/tldraw'
import "@tldraw/tldraw/tldraw.css";
import "@/style.css"
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useInterlay } from "@/hooks/useInterlay"
import { Tldraw } from "@tldraw/tldraw";
import { HTMLShapeUtil } from "@/shapes/HTMLShapeUtil";
import { CodeShapeUtil } from "@/shapes/CodeShapeUtil";
import { overrides } from "@/ui/overrides";
import { components } from "@/ui/components";
import { CodeTool } from '@/tools/CodeTool';
import { colorIsDark } from '@/utils/colorIsDark';
import { DecomposeTool } from '@/tools/DecomposeTool';
import { RecomposeTool } from '@/tools/RecomposeTool';
import { LLMTool } from '@/tools/LLMTool';
import { CollectionProvider } from '@/collections';
import { GraphLayoutCollection } from '@/collections/GraphLayoutCollection';
import { ContextTool } from '@/tools/ContextTool';

const collections = [GraphLayoutCollection]
const tools = [CodeTool, DecomposeTool, RecomposeTool, LLMTool, ContextTool]
const shapeUtils = [HTMLShapeUtil, CodeShapeUtil]
const root = createRoot();
root.render(<App />);

function createRoot() {
	let container = document.getElementById('interlayCanvasRoot');
	if (!container) {
		container = document.createElement('div');
		container.id = 'interlayCanvasRoot';
		document.body.appendChild(container);
	}
	return ReactDOM.createRoot(container);
}

function App() {
	const { isCanvasEnabled, shapes } = useInterlay();
	const [editor, setEditor] = useState<Editor | null>(null);

	useEffect(() => {
		if (isCanvasEnabled && editor) {
			setUserPreferences(getDefaultUserPreferences());
			editor.createShapes(shapes);
		}
	}, [isCanvasEnabled, editor, shapes]);

	useEffect(() => {
		return () => {
			if (editor) {
				editor.dispose();
				setEditor(null);
			}
		};
	}, [editor]);

	if (!isCanvasEnabled) {
		return null;
	}

	return (
		<React.StrictMode>
			<div className="tldraw__editor">
				<CollectionProvider editor={editor} collections={collections}>
					<Tldraw
						tools={tools}
						overrides={overrides}
						components={components}
						shapeUtils={shapeUtils}
						onMount={setEditor}
					>
					</Tldraw>
				</CollectionProvider>
			</div>
		</React.StrictMode>
	)
}

function getDefaultUserPreferences(): TLUserPreferences {
	const bodyColor = window.getComputedStyle(document.body).backgroundColor;
	const isTransparent = bodyColor === 'transparent' || bodyColor.includes('rgba') && bodyColor.endsWith(', 0)');
	const BgColor = isTransparent ? 'white' : bodyColor;
	const root = document.getElementById('interlayCanvasRoot');
	if (root) {
		root.style.backgroundColor = BgColor
	}
	return { id: 'interlay', isDarkMode: !colorIsDark(BgColor) }
}