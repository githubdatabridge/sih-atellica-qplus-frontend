import { useContext, createContext, ReactNode } from 'react'

export type BaseUiContextType = {
    vizChangeNode?: ReactNode | null
    eraseNode?: ReactNode | null
    exportNode?: ReactNode | null
    exportXlsxNode?: ReactNode | null
    exportPdfNode?: ReactNode | null
    exportPngNode?: ReactNode | null
    fullscreenNode?: ReactNode | null
    filterNode?: ReactNode | null
    dockedNode?: ReactNode | null
    lockedNode?: ReactNode | null
    infoNode?: ReactNode | null
    clearNode?: ReactNode | null
    undoNode?: ReactNode | null
    redoNode?: ReactNode | null
    cssQlikToolbar?: any
    cssQlikPanelPaper?: any
    cssQlikPanelOptions?: any
    cssQlikPanelTypographyTitle?: any
    cssQlikPanelTypographySubTitle?: any
    cssQlikToolbarExportMenuItem?: any
    cssQlikToolbarExportTypography?: any
    cssDialogRoot?: any
    cssDialogPaper?: any
    cssDialogAppBar?: any
    cssDialogIcon?: any
    cssDialogTitle?: any
    cssDialogActionButton?: any
    cssDialogCancelButton?: any
    cssFullscreenDialog?: any
    cssFullscreenDialogPaper?: any
    cssFullscreenDialogAppBar?: any
    cssFullscreenDialogToolbar?: any
    cssFullscreenDialogIcon?: any
    cssFullscreenDialogButtonIcon?: any
    cssFullscreenDialogTitle?: any
    cssFullscreenDialogSubTitle?: any
    cssFullscreenDialogActionBar?: any
    loadDraftJsEmojiPluginCss?: boolean
    qlikSelectionBarWidth?: string | null
    setQlikSelectionBarWidth: (width: string) => void
    setVizChangeNode: (vizChangeNode: ReactNode) => void
    setEraseNode: (eraseNode: ReactNode) => void
    setExportNode: (exportNode: ReactNode) => void
    setExportXlsxNode: (exportNode: ReactNode) => void
    setExportPdfNode: (exportNode: ReactNode) => void
    setExportPngNode: (exportNode: ReactNode) => void
    setFullscreenNode: (fullscreenNode: ReactNode) => void
    setFilterNode: (filterNode: ReactNode) => void
    setDockedNode: (dockedNode: ReactNode) => void
    setLockedNode: (lockedNode: ReactNode) => void
    setInfoNode: (infoNode: ReactNode) => void
    setClearNode: (infoNode: ReactNode) => void
    setRedoNode: (infoNode: ReactNode) => void
    setUndoNode: (infoNode: ReactNode) => void
    setCssQlikPanelPaper: (css: any) => void
    setCssQlikToolbar: (css: any) => void
    setCssQlikPanelOptions: (css: any) => void
    setCssQlikPanelTypographyTitle: (css: any) => void
    setCssQlikPanelTypographySubTitle: (css: any) => void
    setCssQlikToolbarExportMenuItem: (css: any) => void
    setCssQlikToolbarExportTypography: (css: any) => void
    setCssDialogRoot: (css: any) => void
    setCssDialogPaper: (css: any) => void
    setCssDialogAppBar: (css: any) => void
    setCssDialogTitle: (css: any) => void
    setCssDialogIcon: (css: any) => void
    setCssActionButton: (css: any) => void
    setCssCancelButton: (css: any) => void
    setCssFullscreenDialog: (css: any) => void
    setCssFullscreenDialogPaper: (css: any) => void
    setCssFullscreenDialogAppBar: (css: any) => void
    setCssFullscreenDialogToolbar: (css: any) => void
    setCssFullscreenDialogTitle: (css: any) => void
    setCssFullscreenDialogSubTitle: (css: any) => void
    setCssFullscreenDialogButtonIcon: (css: any) => void
    setCssFullscreenDialogIcon: (css: any) => void
    setCssFullscreenDialogActionBar: (css: any) => void
    setLoadDraftJsEmojiPluginCss: (shouldLoad: boolean) => void
}

export const BaseUiContext = createContext<BaseUiContextType>({
    eraseNode: undefined,
    exportNode: undefined,
    exportXlsxNode: undefined,
    exportPdfNode: undefined,
    exportPngNode: undefined,
    fullscreenNode: undefined,
    infoNode: undefined,
    filterNode: undefined,
    dockedNode: undefined,
    lockedNode: undefined,
    clearNode: undefined,
    redoNode: undefined,
    undoNode: undefined,
    vizChangeNode: undefined,
    cssQlikToolbar: undefined,
    cssQlikPanelPaper: undefined,
    cssQlikPanelOptions: undefined,
    cssQlikPanelTypographyTitle: undefined,
    cssQlikPanelTypographySubTitle: undefined,
    cssQlikToolbarExportMenuItem: undefined,
    cssQlikToolbarExportTypography: undefined,
    cssDialogRoot: undefined,
    cssDialogPaper: undefined,
    cssDialogAppBar: undefined,
    cssDialogIcon: undefined,
    cssDialogTitle: undefined,
    cssDialogActionButton: undefined,
    cssDialogCancelButton: undefined,
    cssFullscreenDialog: undefined,
    cssFullscreenDialogPaper: undefined,
    cssFullscreenDialogAppBar: undefined,
    cssFullscreenDialogToolbar: undefined,
    cssFullscreenDialogIcon: undefined,
    cssFullscreenDialogButtonIcon: undefined,
    cssFullscreenDialogTitle: undefined,
    cssFullscreenDialogSubTitle: undefined,
    cssFullscreenDialogActionBar: undefined,
    loadDraftJsEmojiPluginCss: undefined,
    qlikSelectionBarWidth: undefined,
    setVizChangeNode: (_vizChangeNode: unknown) => {
        throw new Error('setVizChangeNode() must be used within a BaseUiProvider')
    },
    setEraseNode: (_eraseNode: unknown) => {
        throw new Error('setEraseNode() must be used within a BaseUiProvider')
    },
    setExportNode: (_exportNode: unknown) => {
        throw new Error('setExportNode() must be used within a BaseUiProvider')
    },
    setExportXlsxNode: (_exportXlsxNode: unknown) => {
        throw new Error('setExportXlsxNode() must be used within a BaseUiProvider')
    },
    setExportPdfNode: (_exportPdfNode: unknown) => {
        throw new Error('setExportPdfNode() must be used within a BaseUiProvider')
    },
    setExportPngNode: (_exportPngNode: unknown) => {
        throw new Error('setExportNode() must be used within a BaseUiProvider')
    },
    setFullscreenNode: (_fullscreenNode: unknown) => {
        throw new Error('setExportPngNode() must be used within a BaseUiProvider')
    },
    setInfoNode: (_infoNode: unknown) => {
        throw new Error('setInfoNode() must be used within a BaseUiProvider')
    },
    setFilterNode: (_filterNode: unknown) => {
        throw new Error('setFilterNode() must be used within a BaseUiProvider')
    },
    setDockedNode: (_dockedNode: unknown) => {
        throw new Error('setDockedNode() must be used within a BaseUiProvider')
    },
    setLockedNode: (_lockedNode: unknown) => {
        throw new Error('setLockedNode() must be used within a BaseUiProvider')
    },
    setClearNode: (_clearNode: unknown) => {
        throw new Error('setClearNode() must be used within a BaseUiProvider')
    },
    setUndoNode: (_undoNode: unknown) => {
        throw new Error('setUndoNode() must be used within a BaseUiProvider')
    },
    setRedoNode: (_redoNode: unknown) => {
        throw new Error('setRedoNode() must be used within a BaseUiProvider')
    },
    setCssQlikToolbar: (_css: any) => {
        throw new Error('setCssQlikToolbar() must be used within a BaseUiProvider')
    },
    setCssQlikPanelPaper: (_css: any) => {
        throw new Error('setCssQlikPanelPaper() must be used within a BaseUiProvider')
    },
    setCssQlikPanelOptions: (_css: any) => {
        throw new Error('setCssQlikPanelOptions() must be used within a BaseUiProvider')
    },
    setCssQlikPanelTypographyTitle: (_css: any) => {
        throw new Error('setCssQlikPanelTypographyTitle() must be used within a BaseUiProvider')
    },
    setCssQlikPanelTypographySubTitle: (_css: any) => {
        throw new Error('setCssQlikPanelTypographySubTitle() must be used within a BaseUiProvider')
    },
    setCssQlikToolbarExportMenuItem: (_css: any) => {
        throw new Error('setCssQlikToolbarExportMenuItem() must be used within a BaseUiProvider')
    },
    setCssQlikToolbarExportTypography: (_css: any) => {
        throw new Error('setCssQlikToolbarExportTypography() must be used within a BaseUiProvider')
    },
    setCssDialogRoot: (_css: any) => {
        throw new Error('setCssDialogRoot() must be used within a BaseUiProvider')
    },
    setCssDialogPaper: (_css: any) => {
        throw new Error('setCssDialogPaper() must be used within a BaseUiProvider')
    },
    setCssDialogAppBar: (_css: any) => {
        throw new Error('setCssDialogAppBar() must be used within a BaseUiProvider')
    },
    setCssDialogIcon: (_css: any) => {
        throw new Error('setCssDialogIcon() must be used within a BaseUiProvider')
    },
    setCssDialogTitle: (_css: any) => {
        throw new Error('setCssDialogTitle() must be used within a BaseUiProvider')
    },
    setCssActionButton: (_css: any) => {
        throw new Error('setCssActionButton() must be used within a BaseUiProvider')
    },
    setCssCancelButton: (_css: any) => {
        throw new Error('setCssCancelButton() must be used within a BaseUiProvider')
    },
    setCssFullscreenDialogPaper: (_css: any) => {
        throw new Error('setCssFullscreenDialogPaper() must be used within a BaseUiProvider')
    },
    setCssFullscreenDialog: (_css: any) => {
        throw new Error('setCssFullscreenDialog() must be used within a BaseUiProvider')
    },
    setCssFullscreenDialogAppBar: (_css: any) => {
        throw new Error('setCssFullscreenDialogAppBar() must be used within a BaseUiProvider')
    },
    setCssFullscreenDialogToolbar: (_css: any) => {
        throw new Error('setCssFullscreenDialogToolbar() must be used within a BaseUiProvider')
    },
    setCssFullscreenDialogIcon: (_css: any) => {
        throw new Error('setCssFullscreenDialogIcon() must be used within a BaseUiProvider')
    },
    setCssFullscreenDialogButtonIcon: (_css: any) => {
        throw new Error('setCssFullscreenDialogButtonIcon() must be used within a BaseUiProvider')
    },
    setCssFullscreenDialogTitle: (_css: any) => {
        throw new Error('setCssFullscreenDialogTitle() must be used within a BaseUiProvider')
    },
    setCssFullscreenDialogSubTitle: (_css: any) => {
        throw new Error('setCssFullscreenDialogSubTitle() must be used within a BaseUiProvider')
    },
    setCssFullscreenDialogActionBar: (_css: any) => {
        throw new Error('setCssFullscreenDialogActionBar() must be used within a BaseUiProvider')
    },
    setLoadDraftJsEmojiPluginCss: (_shouldLoad: boolean) => {
        throw new Error('setLoadDraftJsEmojiPluginCss() must be used within a BaseUiProvider')
    },
    setQlikSelectionBarWidth: _selectionBarWidth => {
        throw new Error('setQlikSelectionBarWidth() must be used within a BaseUiProvider')
    }
})

export const useBaseUiContext = () => useContext(BaseUiContext)
