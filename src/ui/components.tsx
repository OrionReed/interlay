import {
	TLComponents,
	DefaultToolbar,
	TldrawUiMenuItem,
	DefaultToolbarContent,
	useTools,
	useIsToolSelected,
	DefaultKeyboardShortcutsDialog,
	DefaultKeyboardShortcutsDialogContent,
} from "@tldraw/tldraw";

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
		const isDecomposeSelected = useIsToolSelected(tools.decompose)
		return (
			<DefaultToolbar {...props}>
				<TldrawUiMenuItem {...tools.code} isSelected={isCodeSelected} />
				<DefaultToolbarContent />
				<TldrawUiMenuItem {...tools.decompose} isSelected={isDecomposeSelected} />
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