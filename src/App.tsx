// import { inject } from '@vercel/analytics';
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

console.log("DOING STUFF!!");


ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

function App() {
	const [isCanvasMounted, setIsCanvasMounted] = useState(false);
	const { isCanvasEnabled, elementsInfo } = useCanvas();
	const shapes = createShapes(elementsInfo)

	const mountCanvas = () => {
		if (!isCanvasMounted) {
			setIsCanvasMounted(true);
		}
	};

	return (
		<React.StrictMode>
			<button type="button" onClick={mountCanvas}>Mount Canvas</button>
			{isCanvasMounted && <Canvas />}
		</React.StrictMode>
	);
}

function Canvas() {
	console.log("CANVAS GO BRRRRR");

	return (
		<>
			<Toggle />
			<div className="tldraw__editor">
				<Tldraw
					components={components}
					shapeUtils={[HTMLShapeUtil]}
					onMount={() => {
						window.dispatchEvent(new CustomEvent('editorDidMountEvent'));
					}}
				>
				</Tldraw>
			</div>
		</>
	);
}

function Toggle() {
	return (
		<button type="button" id="toggle-canvas" onClick={() => window.dispatchEvent(new CustomEvent('toggleCanvasEvent'))}>
			<img src="/canvas-button.svg" alt="Toggle Canvas" />
		</button>
	)
}

import { createShapeId } from "@tldraw/tldraw";

function createShapes(elementsInfo: any) {
	const shapes = elementsInfo.map((element: any) => ({
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

	const extend = 150;

	shapes.push({
		id: createShapeId(),
		type: 'geo',
		x: -extend,
		y: window.innerHeight,
		props: {
			w: window.innerWidth + (extend * 2),
			h: 50,
			color: 'grey',
			fill: 'solid'
		},
		meta: {
			fixed: true
		}
	});

	return shapes;
}