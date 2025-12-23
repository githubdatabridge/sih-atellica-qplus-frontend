import { useContext, createContext } from 'react'

import { QSheet } from '@libs/qlik-models'

export type QlikSheetMap = Map<string, QSheet[]>

export interface QlikSheetContextType {
    qSheetMap: QlikSheetMap
    setQlikSheetMap: (qGlobalMap: Map<string, QSheet[]>) => void
}

export const QlikSheetContext = createContext<QlikSheetContextType>({
    qSheetMap: new Map(),
    setQlikSheetMap: undefined
})

export const useQlikSheetContext = () => {
    const context = useContext(QlikSheetContext)

    if (context === undefined) {
        throw new Error('useQlikSheetContext must be used within a QlikSheetContext')
    }

    return context
}
