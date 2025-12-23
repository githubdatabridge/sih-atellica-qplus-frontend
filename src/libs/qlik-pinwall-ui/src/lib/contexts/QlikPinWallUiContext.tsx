import { useContext, createContext, ReactNode } from 'react'

export type QlikPinWallUiContextType = {
    pinwallImportExportNode?: ReactNode | null
    pinwallFilterNode?: ReactNode | null
    pinwallCommentNode?: ReactNode | null
    pinwallShareNode?: ReactNode | null
    pinwallCloneNode?: ReactNode | null
    pinwallEraseNode?: ReactNode | null
    pinwallRemoveNode?: ReactNode | null
    pinwallCancelNode?: ReactNode | null
    pinwallEditNode?: ReactNode | null
    pinwallAddNode?: ReactNode | null
    pinwallSaveNode?: ReactNode | null
    pinwallTitleInfoNode?: ReactNode | null
    pinwallListNode?: ReactNode | null
    pinwallImportNode?: ReactNode | null
    pinwallExportNode?: ReactNode | null
    pinwallFavouriteNode?: ReactNode | null
    pinwallWizardNode?: ReactNode | null
    cssPinwallControlButtonIcon?: any
    cssPinwallHeader?: any
    setPinwallFilterNode: (node: ReactNode) => void
    setPinwallCommentNode: (node: ReactNode) => void
    setPinwallListNode: (node: ReactNode) => void
    setPinwallImportExportNode: (node: ReactNode) => void
    setPinwallShareNode: (node: ReactNode) => void
    setPinwallCloneNode: (node: ReactNode) => void
    setPinwallEraseNode: (node: ReactNode) => void
    setPinwallRemoveNode: (node: ReactNode) => void
    setPinwallCancelNode: (node: ReactNode) => void
    setPinwallEditNode: (node: ReactNode) => void
    setPinwallAddNode: (node: ReactNode) => void
    setPinwallSaveNode: (node: ReactNode) => void
    setPinwallTitleInfoNode: (node: ReactNode) => void
    setPinwallImportNode: (node: ReactNode) => void
    setPinwallExportNode: (node: ReactNode) => void
    setPinwallFavouriteNode: (node: ReactNode) => void
    setPinwallWizardNode: (node: ReactNode) => void
    setCssPinwallControlButtonIcon: (css: any) => void
    setCssPinwallHeader: (css: any) => void
}

export const QlikPinWallUiContext = createContext<QlikPinWallUiContextType>({
    pinwallFilterNode: null,
    pinwallCommentNode: null,
    pinwallImportExportNode: null,
    pinwallShareNode: null,
    pinwallCloneNode: null,
    pinwallEraseNode: null,
    pinwallRemoveNode: null,
    pinwallCancelNode: null,
    pinwallEditNode: null,
    pinwallAddNode: null,
    pinwallSaveNode: null,
    pinwallListNode: null,
    pinwallImportNode: null,
    pinwallExportNode: null,
    pinwallTitleInfoNode: null,
    pinwallFavouriteNode: null,
    pinwallWizardNode: null,
    cssPinwallControlButtonIcon: undefined,
    cssPinwallHeader: undefined,
    setPinwallTitleInfoNode: (_infoNode: unknown) => {
        throw new Error('setPinwallTitleInfoNode() must be used within a BaseUiProvider')
    },
    setPinwallFilterNode: (_filterNode: unknown) => {
        throw new Error('setFilterNode() must be used within a BaseUiProvider')
    },
    setPinwallCommentNode: (_node: unknown) => {
        throw new Error('setPinwallCommentNode() must be used within a BaseUiProvider')
    },
    setPinwallListNode: (_node: unknown) => {
        throw new Error('setPinwallListNode() must be used within a BaseUiProvider')
    },
    setPinwallImportExportNode: (_node: unknown) => {
        throw new Error('setPinwallImportExportNode() must be used within a BaseUiProvider')
    },
    setPinwallShareNode: (_node: unknown) => {
        throw new Error('setPinwallShareNode() must be used within a BaseUiProvider')
    },
    setPinwallCloneNode: (_node: unknown) => {
        throw new Error('setPinwallCloneNode() must be used within a BaseUiProvider')
    },
    setPinwallEraseNode: (_node: unknown) => {
        throw new Error('setPinwallEraseNode() must be used within a BaseUiProvider')
    },
    setPinwallRemoveNode: (_node: unknown) => {
        throw new Error('setPinwallRemoveNode() must be used within a BaseUiProvider')
    },
    setPinwallCancelNode: (_node: unknown) => {
        throw new Error('setPinwallCancelNode() must be used within a BaseUiProvider')
    },
    setPinwallEditNode: (_node: unknown) => {
        throw new Error('setPinwallEditNode() must be used within a BaseUiProvider')
    },
    setPinwallAddNode: (_node: unknown) => {
        throw new Error('setPinwallAddNode() must be used within a BaseUiProvider')
    },
    setPinwallSaveNode: (_node: unknown) => {
        throw new Error('setPinwallSaveNode() must be used within a BaseUiProvider')
    },
    setPinwallExportNode: (_node: unknown) => {
        throw new Error('setPinwallExportNode() must be used within a BaseUiProvider')
    },
    setPinwallImportNode: (_node: unknown) => {
        throw new Error('setPinwallImportNode() must be used within a BaseUiProvider')
    },
    setPinwallFavouriteNode: (_node: unknown) => {
        throw new Error('setPinwallFavouriteNode() must be used within a BaseUiProvider')
    },
    setPinwallWizardNode: (_node: unknown) => {
        throw new Error('setPinwallWizardNode() must be used within a BaseUiProvider')
    },
    setCssPinwallControlButtonIcon: (_css: any) => {
        throw new Error('setCssPinwallControlButtonIcon() must be used within a BaseUiProvider')
    },
    setCssPinwallHeader: (_css: any) => {
        throw new Error('setCssPinwallHeader() must be used within a BaseUiProvider')
    }
})

export const useQlikPinWallUiContext = () => useContext(QlikPinWallUiContext)
