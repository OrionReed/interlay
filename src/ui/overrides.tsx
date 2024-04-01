import {
	TLUiOverrides,
	TLUiTranslationKey,
	TLComponents,
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
	DebugMenu: null,
	HelpMenu: null,
	PageMenu: null,
	NavigationPanel: null,
	ContextMenu: null,
	ActionsMenu: null,
	QuickActions: null,
	MainMenu: null,
	MenuPanel: null,
	StylePanel: null,

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
				<TldrawUiMenuItem {...tools.code} />
			</DefaultKeyboardShortcutsDialog>
		)
	},
}