import { useContext, createContext } from 'react'

import { QGlobalResult } from '@libs/qlik-models'

export type QlikGlobalMap = Map<string, QGlobalResult>

export interface QlikGlobalContextType {
    qGlobalMap: QlikGlobalMap
    setQlikGlobalMap: (qGlobalMap: Map<string, QGlobalResult>) => void
}

export const QlikGlobalContext = createContext<QlikGlobalContextType>({
    qGlobalMap: new Map(),
    setQlikGlobalMap: undefined
})

export const useQlikGlobalContext = () => {
    const context = useContext(QlikGlobalContext)

    if (context === undefined) {
        throw new Error('useQlikGlobalContext must be used within a QlikGlobalContext')
    }

    return context
}
