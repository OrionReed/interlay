import {
	// TLUiMenuGroup,
	TLUiOverrides,
	TLUiTranslationKey,
	// menuItem,
	TLComponents,
	// toolbarItem,
	DefaultToolbar,
	TldrawUiMenuItem,
	DefaultToolbarContent,
	useTools,
	useIsToolSelected,
	DefaultKeyboardShortcutsDialog,
	DefaultKeyboardShortcutsDialogContent,
} from "@tldraw/tldraw";

export const uiOverrides: TLUiOverrides = {
	tools(editor, tools) {
		// debugger;
		// Create a tool item in the ui's context.
		tools.code = {
			id: 'code',
			icon: 'code',
			label: 'Code',
			kbd: 'c',
			onSelect: () => {
				editor.setCurrentTool('code')
			},
		}
		return tools
	},
};

export const components: TLComponents = {
	Toolbar: (props) => {
		const tools = useTools()
		const isCodeSelected = useIsToolSelected(tools.code)
		return (
			<DefaultToolbar {...props}>
				<TldrawUiMenuItem {...tools.code} isSelected={isCodeSelected} />
				<DefaultToolbarContent />
			</DefaultToolbar>
		)
	},
	KeyboardShortcutsDialog: (props) => {
		const tools = useTools()
		return (
			<DefaultKeyboardShortcutsDialog {...props}>
				<DefaultKeyboardShortcutsDialogContent />
				{/* Ideally, we'd interleave this into the tools group */}
				<TldrawUiMenuItem {...tools.code} />
			</DefaultKeyboardShortcutsDialog>
		)
	},
}