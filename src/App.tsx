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
// import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls'
// const assets = getAssetUrlsByMetaUrl()

const tools = [CodeTool, DecomposeTool, RecomposeTool, LLMTool]
const shapeUtils = [HTMLShapeUtil, CodeShapeUtil]
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
					tools={tools}
					// assetUrls={assets}
					overrides={overrides}
					components={components}
					shapeUtils={shapeUtils}
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