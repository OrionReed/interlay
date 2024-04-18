import {
	TLUiOverrides,
	TLUiToolItem
} from "@tldraw/tldraw";

export const overrides: TLUiOverrides = {
	tools(editor, tools) {
		// tools.code = {
		// 	id: 'code',
		// 	icon: 'code',
		// 	label: 'Code',
		// 	kbd: 'c',
		// 	onSelect: () => {
		// 		editor.setCurrentTool('code')
		// 	},
		// }
		tools.decompose = {
			id: 'decompose',
			icon: 'color',
			label: 'Decompose',
			kbd: 'x',
			onSelect: () => {
				editor.setCurrentTool('decompose')
			},
		}
		tools.recompose = {
			id: 'recompose',
			icon: 'color',
			label: 'Recompose',
			kbd: 'z',
			onSelect: () => {
				editor.setCurrentTool('recompose')
			},
		}
		tools.llm = {
			id: 'llm',
			icon: 'text',
			label: 'LLM',
			kbd: 's',
			onSelect: () => {
				editor.setCurrentTool('llm')
			},
		}
		tools.context = {
			id: 'context',
			icon: 'text',
			label: 'Context',
			kbd: 'c',
			onSelect: () => {
				editor.setCurrentTool('context')
			},
		}
		return tools
	},
};