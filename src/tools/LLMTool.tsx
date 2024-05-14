import {
	TLArrowShape,
	TLGeoShape,
	TLShape,
	TLShapeId,
	TLShapePartial,
	TLUnknownShape,
	VecLike,
	createShapeId,
} from "@tldraw/tldraw";
import { StateNode } from "tldraw";
import { generateText } from "@/utils/generateText";
import { HTMLBaseShape } from "@/shapes/HTMLShapeUtil";

export class LLMTool extends StateNode {
	static override id = "llm";

	override onEnter = () => {
		const selectedShapes = this.editor.getSelectedShapes();
		if (selectedShapes.length === 0) return;
		const arrowShapes = selectedShapes.filter(
			(shape) => shape.type === "arrow",
		) as TLArrowShape[];
		this.process(arrowShapes);
		this.editor.setCurrentTool("select");
	};

	override onPointerDown = () => {
		const { currentPagePoint } = this.editor.inputs;
		const shape = this.editor.getShapeAtPoint(currentPagePoint);
		if (shape) {
			// If it's an arrow, do LLM stuff
		}
	};

	process = (arrows: TLArrowShape[]) => {
		for (const arrow of arrows) {
			let startShape: TLShapePartial<TLShape> | undefined;
			const indirectStartShapeContent: TLShapePartial<TLShape>[] = [];
			let endShape: TLShapePartial<TLShape> | undefined;
			const arrowText = arrow.props.text;
			if (arrow.props.start.type === "binding") {
				startShape = this.editor.getShape(arrow.props.start.boundShapeId);
				//@ts-ignore
				if (startShape.type === "geo" && startShape.props.text === "") {
					const indirectArrows = this.editor.getArrowsBoundTo(startShape.id);
					for (const indirectArrow of indirectArrows) {
						if (indirectArrow.handleId === "end") {
							const arrowId = this.editor.getShape(indirectArrow.arrowId);
							const arrowShape = this.editor.getShape(arrowId) as TLArrowShape;
							if (arrowShape.props.start.type === "binding") {
								const boundShape = this.editor.getShape(
									arrowShape.props.start.boundShapeId,
								);
								//@ts-ignore
								indirectStartShapeContent.push(boundShape.props.text);
							}
						}
					}
				}
			}
			if (arrow.props.end.type === "binding") {
				endShape = this.editor.getShape(arrow.props.end.boundShapeId);
			} else if (arrow.props.end.type === "point") {
				const pageSpacePoint = {
					x: arrow.x + arrow.props.end.x,
					y: arrow.y + arrow.props.end.y,
				};
				const newShape = createGeoShapeAtPoint(pageSpacePoint);
				this.editor.createShape(newShape);
				endShape = newShape;
				const arrowUpdate = bindAndGetArrow(arrow.id, newShape.id);
				this.editor.updateShape(arrowUpdate);
			}
			//@ts-ignore
			let input = "";
			if (indirectStartShapeContent.length > 0) {
				input = indirectStartShapeContent.join(" ");
			} else if (startShape) {
				//@ts-ignore
				input = startShape.props.text;
			}
			const geoShapePartial = getGeoShapePartial(endShape);
			const htmlShapePartial = getHtmlShapePartial(endShape);
			this.editor.updateShape(geoShapePartial);
			const updateGeoShape = (newText: string) => {
				this.editor.updateShape({
					...geoShapePartial,
					props: {
						...geoShapePartial.props,
						align: "start",
						verticalAlign: "start",
						text: newText,
					},
				});
			};
			const updateHtmlShape = (newText: string, done: boolean) => {
				this.editor.updateShape({
					...htmlShapePartial,
					props: {
						...htmlShapePartial.props,
						text: newText,
						isProcessing: !done,
					},
				});
			};
			//@ts-ignore
			const isTargetHTML = arrowText.toLowerCase().includes("html");
			const isTargetUI = arrowText.toLowerCase().includes("ui");
			if ((isTargetHTML || isTargetUI) && endShape.type !== "html") {
				const replacementShape: TLShapePartial<HTMLBaseShape> = {
					id: createShapeId(),
					x: endShape.x,
					y: endShape.y,
					type: "html",
					props: {
						//@ts-ignore
						w: endShape.props.w || 100,
						//@ts-ignore
						h: endShape.props.h || 100,
						text: "<div>⏳</div>",
					},
				};
				htmlShapePartial.id = replacementShape.id;
				this.editor.createShape(replacementShape);
				this.editor.deleteShape(endShape.id);
				const arrowUpdate = bindAndGetArrow(arrow.id, replacementShape.id);
				this.editor.updateShape(arrowUpdate);
			}
			let systempPrompt = getSystemPrompt("text");
			if (isTargetHTML) {
				systempPrompt = getSystemPrompt("html");
			}
			if (isTargetUI) {
				console.log("ui");
				systempPrompt = getSystemPrompt("ui");
			}
			const updateFunc = (text: string, done: boolean) => {
				if (isTargetHTML || isTargetUI) {
					updateHtmlShape(text, done);
				} else {
					updateGeoShape(text);
				}
			};
			generateText(
				systempPrompt,
				`Intent:\n ${arrowText}\n\nTarget ID: ${startShape.id}\n\nTarget:\n\`\n${input}\n\``,
				updateFunc,
			);
		}
	};
}

function getSystemPrompt(type: "html" | "text" | "ui") {
	const textPrompt = "Your answer should be in plaintext.";
	const htmlPrompt =
		"Your answer should be in HTML with inline styles. Do not wrap the html in ``` or other markings. It should be formatted correctly for direct insertion as inner HTML.";
	const uiPrompt = `
  Task:
  Make a UI based on the users Intent which targets the "Container ID" element or its children.

  Information:
  - Your response will be used as-is and inserted into the page after it is loaded.
  - The "Target" element already exists and is not included in your response.
  `;
	const basePrompt =
		"You are a helpful assistant. You will be given an instruction and an input which may be HTML or plaintext.";

	if (type === "html") return basePrompt + htmlPrompt;
	if (type === "text") return basePrompt + textPrompt;
	if (type === "ui") return uiPrompt;
}

function createGeoShapeAtPoint(
	point: VecLike,
	w = 350,
	h = 200,
): TLShapePartial<TLGeoShape> {
	return {
		id: createShapeId(),
		type: "geo",
		x: point.x - w / 2,
		y: point.y - h / 2,
		props: {
			w: w,
			h: h,
			text: "⏳",
			size: "s",
		},
	};
}

function getGeoShapePartial(
	endShape: TLShapePartial<TLShape>,
): TLShapePartial<TLGeoShape> {
	return {
		id: endShape.id,
		type: "geo",
		props: {
			text: "⏳",
			size: "s",
			font: "sans",
		},
	};
}

function getHtmlShapePartial(
	endShape: TLShapePartial<TLShape>,
): TLShapePartial<HTMLBaseShape> {
	return {
		id: endShape.id,
		type: "html",
		props: {
			text: "⏳",
		},
	};
}

function bindAndGetArrow(
	id: TLShapeId,
	bindTo: TLShapeId,
): TLShapePartial<TLArrowShape> {
	return {
		id,
		type: "arrow",
		props: {
			end: {
				type: "binding",
				boundShapeId: bindTo,
				normalizedAnchor: {
					x: 0.5,
					y: 0.5,
				},
				isExact: false,
				isPrecise: true,
			},
		},
	};
}
