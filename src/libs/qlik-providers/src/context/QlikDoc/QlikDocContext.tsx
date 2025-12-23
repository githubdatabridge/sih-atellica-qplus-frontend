import { useContext, createContext } from 'react'

import { QMeta } from '@libs/qlik-models'

export interface QDocResult {
    qDocId: string
    qDoc?: any
    qIsDefault?: boolean
    qMeta?: QMeta
    qActionResults?: any[]
    qReloadDate?: string
    qTitle?: string
    qDescription?: string
    qHiddenFields?: string[]
    qHidePrefix?: string
}

export type QlikDocMap = Map<string, QDocResult>

export interface QlikDocContextType {
    qDocMap: QlikDocMap
}

export const QlikDocContext = createContext<QlikDocContextType>({
    qDocMap: new Map()
})

export const useQlikDocContext = () => {
    const context = useContext(QlikDocContext)

    if (context === undefined) {
        throw new Error('useQlikDocContext must be used within a QlikDocContext')
    }

    return context
}

export const useQlikDoc = (qDocId?: string) => {
    const { qDocMap } = useQlikDocContext()
    const [firstKey] = qDocMap.keys()
    let qDefaultDocId = ''

    for (const [, value] of qDocMap) {
        if (value?.qIsDefault) {
            qDefaultDocId = value?.qDocId
            break
        }
    }
    const qlikDoc = qDocMap?.get(qDocId || qDefaultDocId || firstKey)

    return {
        qDocId: qlikDoc?.qDocId,
        qReloadDate: qlikDoc?.qReloadDate,
        qActionResults: qlikDoc?.qActionResults,
        qDoc: qlikDoc?.qDoc,
        qTitle: qlikDoc?.qTitle,
        qDescription: qlikDoc?.qDescription,
        qMeta: qlikDoc?.qMeta,
        qHiddenFields: qlikDoc?.qHiddenFields,
        qHidePrefix: qlikDoc?.qHidePrefix
    }
}
