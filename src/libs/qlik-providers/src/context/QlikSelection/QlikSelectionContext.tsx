import { useContext, createContext } from 'react'

import { QFieldFilter, QMultiAppFields, QSelection } from '@libs/qlik-models'

export type QlikSelectionMap = Map<string, QSelection>

export interface QlikSelectionContextType {
    qIsSelectionMapLoading: boolean
    qSelectionMap: QlikSelectionMap
    qGlobalDockedFields?: QFieldFilter[]
    qGlobalMultiAppFields?: QMultiAppFields[]
    qGlobalSelectionCount?: number
    qGlobalBackwardCount?: number
    qGlobalForwardCount?: number
    qGlobalForwardIsLoading?: boolean
    qGlobalBackwardIsLoading?: boolean
    qGlobalClearIsLoading?: boolean
    setQlikSelectionMap: (qSelectionMap: Map<string, QSelection>) => void
    setDockedFields: (dockedFields: QFieldFilter[]) => void
    setMultiAppFields: (multiAppFields: QMultiAppFields[]) => void
    detachFieldsFromContext: () => void
    clearSelectionsFromContext: () => void
    previousSelectionsFromContext: () => void
    nextSelectionsFromContext: () => void
    resetSelectionsFromContext: () => void
}

export const QlikSelectionContext = createContext<QlikSelectionContextType>({
    qIsSelectionMapLoading: true,
    qSelectionMap: new Map(),
    qGlobalDockedFields: [],
    qGlobalMultiAppFields: [],
    qGlobalSelectionCount: 0,
    qGlobalBackwardCount: 0,
    qGlobalForwardCount: 0,
    qGlobalBackwardIsLoading: false,
    qGlobalForwardIsLoading: false,
    qGlobalClearIsLoading: false,
    setQlikSelectionMap: _dockedFields => {
        throw new Error('setQlikSelectionMap() must be used within a QlikSelectionProvider')
    },
    setDockedFields: _dockedFields => {
        throw new Error('setDockedFields() must be used within a QlikSelectionProvider')
    },
    setMultiAppFields: _multiAppFields => {
        throw new Error('setMultiAppFields() must be used within a QlikSelectionProvider')
    },
    clearSelectionsFromContext: () => {
        throw new Error('clearSelectionsFromContext() must be used within a QlikSelectionProvider')
    },
    previousSelectionsFromContext: () => {
        throw new Error(
            'previousSelectionsFromContext() must be used within a QlikSelectionProvider'
        )
    },
    nextSelectionsFromContext: () => {
        throw new Error('nextSelectionsFromContext() must be used within a QlikSelectionProvider')
    },
    resetSelectionsFromContext: () => {
        throw new Error('resetSelectionsFromContext() must be used within a QlikSelectionProvider')
    },
    detachFieldsFromContext: () => {
        throw new Error('detachFieldsFromContext() must be used within a QlikSelectionProvider')
    }
})

export const useQlikSelectionContext = () => {
    const context = useContext(QlikSelectionContext)

    if (context === undefined) {
        throw new Error('useQlikSelectionContext must be used within a QlikSelectionContext')
    }

    return context
}
