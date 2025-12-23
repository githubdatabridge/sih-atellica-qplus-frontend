import React, { ReactNode, useState, useCallback } from 'react'

import { BaseUiContext, BaseUiContextType } from './BaseUiContext'

interface Props {
    value?: BaseUiContextType
    children: ReactNode
}
const BaseUiProvider = ({ value, children }: Props) => {
    const [vizChangeNode, setVizChangeIconNode] = useState<ReactNode>(null)
    const [exportNode, setExportIconNode] = useState<ReactNode>(null)
    const [exportXlsxNode, setExportXlsxIconNode] = useState<ReactNode>(null)
    const [exportPngNode, setExportPngIconNode] = useState<ReactNode>(null)
    const [exportPdfNode, setExportPdfIconNode] = useState<ReactNode>(null)
    const [fullscreenNode, setFullscreenIconNode] = useState<ReactNode>(null)
    const [infoNode, setInfoIconNode] = useState<ReactNode>(null)
    const [filterNode, setFilterIconNode] = useState<ReactNode>(null)
    const [dockedNode, setDockedIconNode] = useState<ReactNode>(null)
    const [lockedNode, setLockedIconNode] = useState<ReactNode>(null)
    const [clearNode, setClearIconNode] = useState<ReactNode>(null)
    const [undoNode, setUndoIconNode] = useState<ReactNode>(null)
    const [redoNode, setRedoIconNode] = useState<ReactNode>(null)
    const [eraseNode, setEraseIconNode] = useState<ReactNode>(null)

    const [cssQlikToolbar, setCssToolbarBox] = useState<any>(null)
    const [cssQlikPanelOptions, setCssPanelBox] = useState<any>(null)
    const [cssQlikPanelPaper, setCssRootPanelBox] = useState<any>(null)

    const [cssQlikPanelTypographyTitle, setCssPanelTitle] = useState<any>(null)
    const [cssQlikPanelTypographySubTitle, setCssPanelSubTitle] = useState<any>(null)

    const [cssQlikToolbarExportMenuItem, setCssExportMenuItem] = useState<any>(null)
    const [cssQlikToolbarExportTypography, setCssExportTypography] = useState<any>(null)

    const [cssDialogRoot, setDialogRoot] = useState<any>(null)
    const [cssDialogPaper, setDialogPaper] = useState<any>(null)
    const [cssDialogAppBar, setDialogAppBar] = useState<any>(null)
    const [cssDialogIcon, setDialogIcon] = useState<any>(null)
    const [cssDialogTitle, setDialogTitle] = useState<any>(null)
    const [cssDialogActionButton, setActionButton] = useState<any>(null)
    const [cssDialogCancelButton, setCancelButton] = useState<any>(null)
    const [loadDraftJsEmojiPluginCss, setLoadDraftJsEmojiPluginCss] = useState<boolean>(false)

    const [cssFullscreenDialog, setFullscreenDialog] = useState<any>(null)
    const [cssFullscreenDialogPaper, setFullscreenDialogPaper] = useState<any>(null)
    const [cssFullscreenDialogAppBar, setFullscreenDialogAppBar] = useState<any>(null)
    const [cssFullscreenDialogToolbar, setFullscreenDialogToolbar] = useState<any>(null)
    const [cssFullscreenDialogIcon, setFullscreenDialogIcon] = useState<any>(null)
    const [cssFullscreenDialogButtonIcon, setFullscreenDialogButtonIcon] = useState<any>(null)
    const [cssFullscreenDialogTitle, setFullscreenDialogTitle] = useState<any>(null)
    const [cssFullscreenDialogSubTitle, setFullscreenDialogSubTitle] = useState<any>(null)
    const [cssFullscreenDialogActionBar, setFullscreenDialogActionBar] = useState<any>(null)

    const [qlikSelectionBarWidth, setWidth] = useState<string | null>('100%')

    const setVizChangeNode = useCallback((node: ReactNode) => {
        setVizChangeIconNode(node)
    }, [])

    const setEraseNode = useCallback((eraseNode: ReactNode) => {
        setEraseIconNode(eraseNode)
    }, [])

    const setExportNode = useCallback((exportNode: ReactNode) => {
        setExportIconNode(exportNode)
    }, [])

    const setExportXlsxNode = useCallback((exportXlsxNode: ReactNode) => {
        setExportXlsxIconNode(exportXlsxNode)
    }, [])

    const setExportPdfNode = useCallback((exportPdfNode: ReactNode) => {
        setExportPdfIconNode(exportPdfNode)
    }, [])

    const setExportPngNode = useCallback((exportPngNode: ReactNode) => {
        setExportPngIconNode(exportPngNode)
    }, [])

    const setFullscreenNode = useCallback((fullscreenNode: ReactNode) => {
        setFullscreenIconNode(fullscreenNode)
    }, [])

    const setLockedNode = useCallback((lockedNode: ReactNode) => {
        setLockedIconNode(lockedNode)
    }, [])

    const setClearNode = useCallback((clearNode: ReactNode) => {
        setClearIconNode(clearNode)
    }, [])

    const setRedoNode = useCallback((redoNode: ReactNode) => {
        setRedoIconNode(redoNode)
    }, [])

    const setUndoNode = useCallback((undoNode: ReactNode) => {
        setUndoIconNode(undoNode)
    }, [])

    const setFilterNode = useCallback((filterNode: ReactNode) => {
        setFilterIconNode(filterNode)
    }, [])

    const setDockedNode = useCallback((dockedNode: ReactNode) => {
        setDockedIconNode(dockedNode)
    }, [])

    const setInfoNode = useCallback((infoNode: ReactNode) => {
        setInfoIconNode(infoNode)
    }, [])

    const setCssQlikToolbar = useCallback((css: any) => {
        setCssToolbarBox(css)
    }, [])

    const setCssQlikPanelPaper = useCallback((css: any) => {
        setCssRootPanelBox(css)
    }, [])

    const setCssQlikPanelOptions = useCallback((css: any) => {
        setCssPanelBox(css)
    }, [])

    const setCssQlikPanelTypographyTitle = useCallback((css: any) => {
        setCssPanelTitle(css)
    }, [])

    const setCssQlikPanelTypographySubTitle = useCallback((css: any) => {
        setCssPanelSubTitle(css)
    }, [])

    const setCssQlikToolbarExportMenuItem = useCallback((css: any) => {
        setCssExportMenuItem(css)
    }, [])

    const setCssQlikToolbarExportTypography = useCallback((css: any) => {
        setCssExportTypography(css)
    }, [])

    const setCssDialogAppBar = useCallback((css: any) => {
        setDialogAppBar(css)
    }, [])

    const setCssDialogIcon = useCallback((css: any) => {
        setDialogIcon(css)
    }, [])

    const setCssActionButton = useCallback((css: any) => {
        setActionButton(css)
    }, [])

    const setCssCancelButton = useCallback((css: any) => {
        setCancelButton(css)
    }, [])

    const setCssDialogRoot = useCallback((css: any) => {
        setDialogRoot(css)
    }, [])

    const setCssDialogPaper = useCallback((css: any) => {
        setDialogPaper(css)
    }, [])

    const setCssDialogTitle = useCallback((css: any) => {
        setDialogTitle(css)
    }, [])

    const setQlikSelectionBarWidth = useCallback((width: string) => {
        setWidth(width)
    }, [])

    const setCssFullscreenDialog = useCallback((css: any) => {
        setFullscreenDialog(css)
    }, [])

    const setCssFullscreenDialogAppBar = useCallback((css: any) => {
        setFullscreenDialogAppBar(css)
    }, [])

    const setCssFullscreenDialogToolbar = useCallback((css: any) => {
        setFullscreenDialogToolbar(css)
    }, [])

    const setCssFullscreenDialogIcon = useCallback((css: any) => {
        setFullscreenDialogIcon(css)
    }, [])

    const setCssFullscreenDialogButtonIcon = useCallback((css: any) => {
        setFullscreenDialogButtonIcon(css)
    }, [])

    const setCssFullscreenDialogPaper = useCallback((css: any) => {
        setFullscreenDialogPaper(css)
    }, [])

    const setCssFullscreenDialogTitle = useCallback((css: any) => {
        setFullscreenDialogTitle(css)
    }, [])

    const setCssFullscreenDialogSubTitle = useCallback((css: any) => {
        setFullscreenDialogSubTitle(css)
    }, [])

    const setCssFullscreenDialogActionBar = useCallback((css: any) => {
        setFullscreenDialogActionBar(css)
    }, [])

    const providerValue: BaseUiContextType = {
        vizChangeNode,
        eraseNode,
        exportNode,
        exportXlsxNode,
        exportPdfNode,
        exportPngNode,
        fullscreenNode,
        infoNode,
        filterNode,
        lockedNode,
        dockedNode,
        clearNode,
        undoNode,
        redoNode,
        cssQlikToolbar,
        cssQlikPanelPaper,
        cssQlikPanelOptions,
        cssQlikPanelTypographyTitle,
        cssQlikPanelTypographySubTitle,
        cssQlikToolbarExportMenuItem,
        cssQlikToolbarExportTypography,
        cssDialogRoot,
        cssDialogPaper,
        cssDialogAppBar,
        cssDialogIcon,
        cssDialogActionButton,
        cssDialogCancelButton,
        cssDialogTitle,
        cssFullscreenDialog,
        cssFullscreenDialogAppBar,
        cssFullscreenDialogToolbar,
        cssFullscreenDialogIcon,
        cssFullscreenDialogButtonIcon,
        cssFullscreenDialogPaper,
        cssFullscreenDialogTitle,
        cssFullscreenDialogSubTitle,
        cssFullscreenDialogActionBar,
        loadDraftJsEmojiPluginCss,
        qlikSelectionBarWidth,
        setVizChangeNode,
        setEraseNode,
        setExportNode,
        setExportXlsxNode,
        setExportPdfNode,
        setExportPngNode,
        setFullscreenNode,
        setInfoNode,
        setFilterNode,
        setLockedNode,
        setDockedNode,
        setClearNode,
        setUndoNode,
        setRedoNode,
        setCssQlikToolbar,
        setCssQlikPanelPaper,
        setCssQlikPanelOptions,
        setCssQlikPanelTypographyTitle,
        setCssQlikPanelTypographySubTitle,
        setCssQlikToolbarExportMenuItem,
        setCssQlikToolbarExportTypography,
        setCssDialogRoot,
        setCssDialogPaper,
        setCssDialogAppBar,
        setCssActionButton,
        setCssDialogIcon,
        setCssCancelButton,
        setCssDialogTitle,
        setCssFullscreenDialogButtonIcon,
        setCssFullscreenDialogIcon,
        setCssFullscreenDialogPaper,
        setCssFullscreenDialogTitle,
        setCssFullscreenDialogSubTitle,
        setCssFullscreenDialogAppBar,
        setCssFullscreenDialogToolbar,
        setCssFullscreenDialog,
        setCssFullscreenDialogActionBar,
        setLoadDraftJsEmojiPluginCss,
        setQlikSelectionBarWidth
    }
    return (
        <BaseUiContext.Provider value={{ ...providerValue, ...value }}>
            {children}
        </BaseUiContext.Provider>
    )
}

export default BaseUiProvider
