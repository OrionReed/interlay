import {
	Editor,
	setUserPreferences,
} from '@tldraw/tldraw'
import "@tldraw/tldraw/tldraw.css";
import "@/style.css"
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useInterlay } from "@/hooks/useInterlay"
import { Tldraw, TLUiComponents, createShapeId } from "@tldraw/tldraw";
import { HTMLShape, HTMLShapeUtil } from "@/shapes/HTMLShapeUtil";


const UiComponents: TLUiComponents = {
	DebugMenu: null,
	HelpMenu: null,
	PageMenu: null,
	NavigationPanel: null,
	ContextMenu: null,
	ActionsMenu: null,
	QuickActions: null,
	MainMenu: null,
	MenuPanel: null,
}

const container = document.createElement('div');
container.id = 'interlayCanvasRoot';
document.body.appendChild(container);
const root = ReactDOM.createRoot(container);
root.render(<App />);

function App() {
	const { isCanvasEnabled, shapes } = useInterlay();

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
	const bodyColor = window.getComputedStyle(document.body).backgroundColor;
	const isTransparent = bodyColor === 'transparent' || bodyColor.includes('rgba') && bodyColor.endsWith(', 0)');
	const canvasBgColor = isTransparent ? 'white' : bodyColor;
	const root = document.getElementById('interlayCanvasRoot');
	if (root) {
		root.style.backgroundColor = canvasBgColor
	}
	return canvasBgColor
}

function Canvas({ shapes }: { shapes: HTMLShape[] }) {
	console.log(shapes);

	return (
		<div className="tldraw__editor">
			<Tldraw
				components={UiComponents}
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