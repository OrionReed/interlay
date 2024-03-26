// import { inject } from '@vercel/analytics';
import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls'
import {
	createTLUser,
	Editor,
	setDefaultEditorAssetUrls,
	setUserPreferences,
	TLDrawShape,
	// setDefaultUiAssetUrls,
} from '@tldraw/tldraw'
import "@tldraw/tldraw/tldraw.css";
import "@/style.css"
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
// import { Default } from "@/components/Default";
// import { Canvas } from "@/components/Canvas";
// import { Toggle } from "@/components/Toggle";
import { useCanvas } from "@/hooks/useCanvas"
// import { createShapes } from "@/utils";
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { Contact } from "@/components/Contact";
import { Tldraw, TLShape, TLUiComponents } from "@tldraw/tldraw";
import { HTMLShapeUtil } from "./HTMLShapeUtil";

// const assetUrls = getAssetUrlsByMetaUrl()
// setDefaultEditorAssetUrls(assetUrls)
// setDefaultUiAssetUrls(assetUrls)

// browser.storage.onChanged.addListener(changes => {
// 	if (changes.isInterlayCanvasActive) {
// 		toggleSomething(changes.isExtensionActive.newValue);
// 	}
// });

const components: TLUiComponents = {
	DebugMenu: null,
	HelpMenu: null,
	StylePanel: null,
	PageMenu: null,
	NavigationPanel: null,
	ContextMenu: null,
	ActionsMenu: null,
	QuickActions: null,
	MainMenu: null,
	MenuPanel: null,
}

// Create root and violently insert it into the DOM
const container = document.createElement('div');
container.id = 'interlayCanvasRoot';
document.body.appendChild(container);
const root = ReactDOM.createRoot(container);
root.render(<App />);

function App() {
	const { isCanvasEnabled, elements } = useCanvas();
	const shapes = createShapes(elements)

	useEffect(() => {
		const interlayCanvasRoot = document.getElementById('interlayCanvasRoot');
		if (interlayCanvasRoot) {
			interlayCanvasRoot.style.display = isCanvasEnabled ? 'block' : 'none';
		}
	}, [isCanvasEnabled]);

	return (
		<React.StrictMode>
			{isCanvasEnabled && <Canvas shapes={shapes} />}
		</React.StrictMode>
	);

}

function setBackgroundColor() {
	const bodyStyle = window.getComputedStyle(document.body);
	const bgColor = bodyStyle.backgroundColor;
	const transparent = bgColor === 'transparent' || bgColor.includes('rgba') && bgColor.endsWith(', 0)');
	const canvasBgColor = transparent ? 'white' : bgColor;
	const root = document.getElementById('interlayCanvasRoot');
	if (root) {
		root.style.backgroundColor = canvasBgColor
	}
	return canvasBgColor
}

function Canvas({ shapes }: { shapes: TLDrawShape[] }) {
	return (
		<div className="tldraw__editor">
			<Tldraw
				components={components}
				shapeUtils={[HTMLShapeUtil]}
				onMount={(editor: Editor) => {
					const col = setBackgroundColor()
					setUserPreferences({ id: 'interlay', isDarkMode: !colorIsDark(col) })
					editor.createShapes(shapes)
				}}
			>
			</Tldraw>
		</div>
	);
}

import { createShapeId } from "@tldraw/tldraw";

function createShapes(elementsInfo: any) {
	return elementsInfo.map((element: any) => ({
		id: createShapeId(),
		type: 'html',
		x: element.x,
		y: element.y,
		props: {
			w: element.w,
			h: element.h,
			html: element.html,
		}
	}));
}

//@ts-ignore
function colorIsDark(color) {

	// Variables for red, green, blue values
	let r: number;
	let g: number;
	let b: number;
	let c;

	// Check the format of the color, HEX or RGB?
	if (color.match(/^rgb/)) {

		// If RGB --> store the red, green, blue values in separate variables
		c = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

		r = color[1];
		g = color[2];
		b = color[3];
	}
	else {

		// If hex --> Convert it to RGB: http://gist.github.com/983661
		c = +(`0x${color.slice(1).replace(
			color.length < 5 && /./g, '$&$&')}`);

		r = color >> 16;
		g = color >> 8 & 255;
		b = color & 255;
	}

	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	const hsp = Math.sqrt(
		0.299 * (r * r) +
		0.587 * (g * g) +
		0.114 * (b * b)
	);

	// Using the HSP value, determine whether the color is light or dark
	return hsp < 127.5
}