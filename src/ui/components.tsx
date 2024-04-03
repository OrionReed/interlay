import {
	TLComponents,
	DefaultToolbar,
	TldrawUiMenuItem,
	DefaultToolbarContent,
	useTools,
	useIsToolSelected,
} from "@tldraw/tldraw";

export const components: TLComponents = {
	DebugMenu: null,
	HelpMenu: null,
	PageMenu: null,
	NavigationPanel: null,
	// ContextMenu: null,
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
}