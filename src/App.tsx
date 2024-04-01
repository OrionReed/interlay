import {
	Editor,
	TLUserPreferences,
	setUserPreferences,
} from '@tldraw/tldraw'
import "@tldraw/tldraw/tldraw.css";
import "@/style.css"
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useInterlay } from "@/hooks/useInterlay"
import { Tldraw, TLUiComponents, createShapeId } from "@tldraw/tldraw";
import { HTMLShape, HTMLShapeUtil } from "@/shapes/HTMLShapeUtil";
import { CodeShape, CodeShapeUtil } from "@/shapes/CodeShapeUtil";
import { uiOverrides, components } from "@/ui/overrides";
import { CodeTool } from './tools/codeTool';
import { colorIsDark } from './utils/colorIsDark';

const root = createRoot();
root.render(<App />);

function createRoot() {
	const container = document.createElement('div');
	container.id = 'interlayCanvasRoot';
	document.body.appendChild(container);
	return ReactDOM.createRoot(container);
}

function App() {
	const { isCanvasEnabled, shapes } = useInterlay();

	useEffect(() => {
		const interlayCanvasRoot = document.getElementById('interlayCanvasRoot');
		if (interlayCanvasRoot) {
			interlayCanvasRoot.style.display = isCanvasEnabled ? 'block' : 'none';
		}
	}, [isCanvasEnabled]);

	if (!isCanvasEnabled) {
		return null
	}

	return (
		<React.StrictMode>
			<div className="tldraw__editor">
				<Tldraw
					tools={[CodeTool]}
					overrides={uiOverrides}
					components={components}
					shapeUtils={[HTMLShapeUtil, CodeShapeUtil]}
					onMount={(editor: Editor) => {
						setUserPreferences(getDefaultUserPreferences())
						editor.createShapes(shapes)
					}}
				>
				</Tldraw>
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