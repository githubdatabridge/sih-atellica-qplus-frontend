import React, { ReactNode, useState, useCallback } from 'react'

import { QlikPinWallUiContext, QlikPinWallUiContextType } from './QlikPinWallUiContext'

interface Props {
    value?: QlikPinWallUiContextType
    children: ReactNode
}
const QlikPinWallUiProvider = ({ value, children }: Props) => {
    const [pinwallFilterNode, setPinwallFilterIconNode] = useState<ReactNode>(null)
    const [pinwallImportExportNode, setPinwallImportExportIconNode] = useState<ReactNode>(null)
    const [pinwallShareNode, setPinwallShareIconNode] = useState<ReactNode>(null)
    const [pinwallCloneNode, setPinwallCloneIconNode] = useState<ReactNode>(null)
    const [pinwallEraseNode, setPinwallEraseIconNode] = useState<ReactNode>(null)
    const [pinwallRemoveNode, setPinwallRemoveIconNode] = useState<ReactNode>(null)
    const [pinwallCancelNode, setPinwallCancelIconNode] = useState<ReactNode>(null)
    const [pinwallCommentNode, setPinwallCommentIconNode] = useState<ReactNode>(null)
    const [pinwallEditNode, setPinwallEditIconNode] = useState<ReactNode>(null)
    const [pinwallAddNode, setPinwallAddIconNode] = useState<ReactNode>(null)
    const [pinwallSaveNode, setPinwallSaveIconNode] = useState<ReactNode>(null)
    const [pinwallTitleInfoNode, setPinwallTitleInfoIconNode] = useState<ReactNode>(null)
    const [pinwallListNode, setPinwallListIconNode] = useState<ReactNode>(null)
    const [pinwallImportNode, setPinwallImportIconNode] = useState<ReactNode>(null)
    const [pinwallExportNode, setPinwallExportIconNode] = useState<ReactNode>(null)
    const [pinwallFavouriteNode, setPinwallFavouriteIconNode] = useState<ReactNode>(null)
    const [pinwallWizardNode, setPinwallWizardImageNode] = useState<ReactNode>(null)

    const [cssPinwallControlButtonIcon, setCssControlButtonIcon] = useState<any>({})
    const [cssPinwallHeader, setCssHeader] = useState<any>({})

    const setPinwallAddNode = useCallback((node: ReactNode) => {
        setPinwallAddIconNode(node)
    }, [])

    const setPinwallCancelNode = useCallback((node: ReactNode) => {
        setPinwallCancelIconNode(node)
    }, [])

    const setPinwallCloneNode = useCallback((node: ReactNode) => {
        setPinwallCloneIconNode(node)
    }, [])

    const setPinwallEditNode = useCallback((node: ReactNode) => {
        setPinwallEditIconNode(node)
    }, [])

    const setPinwallEraseNode = useCallback((node: ReactNode) => {
        setPinwallEraseIconNode(node)
    }, [])

    const setPinwallFilterNode = useCallback((node: ReactNode) => {
        setPinwallFilterIconNode(node)
    }, [])

    const setPinwallImportExportNode = useCallback((node: ReactNode) => {
        setPinwallImportExportIconNode(node)
    }, [])

    const setPinwallTitleInfoNode = useCallback((node: ReactNode) => {
        setPinwallTitleInfoIconNode(node)
    }, [])

    const setPinwallRemoveNode = useCallback((node: ReactNode) => {
        setPinwallRemoveIconNode(node)
    }, [])

    const setPinwallSaveNode = useCallback((node: ReactNode) => {
        setPinwallSaveIconNode(node)
    }, [])

    const setPinwallShareNode = useCallback((node: ReactNode) => {
        setPinwallShareIconNode(node)
    }, [])

    const setPinwallCommentNode = useCallback((node: ReactNode) => {
        setPinwallCommentIconNode(node)
    }, [])

    const setPinwallListNode = useCallback((node: ReactNode) => {
        setPinwallListIconNode(node)
    }, [])

    const setPinwallImportNode = useCallback((node: ReactNode) => {
        setPinwallImportIconNode(node)
    }, [])

    const setPinwallExportNode = useCallback((node: ReactNode) => {
        setPinwallExportIconNode(node)
    }, [])

    const setPinwallFavouriteNode = useCallback((node: ReactNode) => {
        setPinwallFavouriteIconNode(node)
    }, [])

    const setPinwallWizardNode = useCallback((node: ReactNode) => {
        setPinwallWizardImageNode(node)
    }, [])

    const setCssPinwallControlButtonIcon = useCallback((css: any) => {
        setCssControlButtonIcon(css)
    }, [])

    const setCssPinwallHeader = useCallback((css: any) => {
        setCssHeader(css)
    }, [])

    const providerValue: QlikPinWallUiContextType = {
        pinwallAddNode,
        pinwallCancelNode,
        pinwallCloneNode,
        pinwallCommentNode,
        pinwallEditNode,
        pinwallEraseNode,
        pinwallFilterNode,
        pinwallImportExportNode,
        pinwallRemoveNode,
        pinwallSaveNode,
        pinwallShareNode,
        pinwallListNode,
        pinwallImportNode,
        pinwallExportNode,
        pinwallTitleInfoNode,
        pinwallFavouriteNode,
        pinwallWizardNode,
        cssPinwallControlButtonIcon,
        cssPinwallHeader,
        setPinwallAddNode,
        setPinwallCancelNode,
        setPinwallCloneNode,
        setPinwallCommentNode,
        setPinwallEditNode,
        setPinwallEraseNode,
        setPinwallFilterNode,
        setPinwallImportExportNode,
        setPinwallRemoveNode,
        setPinwallSaveNode,
        setPinwallShareNode,
        setPinwallListNode,
        setPinwallImportNode,
        setPinwallExportNode,
        setPinwallTitleInfoNode,
        setPinwallFavouriteNode,
        setPinwallWizardNode,
        setCssPinwallControlButtonIcon,
        setCssPinwallHeader
    }
    return (
        <QlikPinWallUiContext.Provider value={{ ...providerValue, ...value }}>
            {children}
        </QlikPinWallUiContext.Provider>
    )
}

export default QlikPinWallUiProvider
