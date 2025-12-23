import { useContext, createContext } from 'react'

import { QMeta } from '@libs/qlik-models'
import {
    QixDocApi,
    QlikAppApi,
    QlikAppSelectionApi,
    QlikAppVisualizationApi
} from '@libs/qlik-services'

export interface QAppResult {
    qAppId: string
    qActionResult: any[]
    qReloadDate: any
    qTitle?: string
    qDescription?: string
    qHidePrefix?: string
    qHiddenFields?: string[]
    qMeta?: QMeta
    qApi: QlikAppApi | null
    qEnigmaApi: QixDocApi | null
    qMixinsApi?: any
    qVisualizationApi?: QlikAppVisualizationApi | null
    qSelectionApi?: QlikAppSelectionApi | null
    qIsDefault?: boolean
}

export type QlikAppMap = Map<string, QAppResult>

export interface QlikAppContextType {
    qIsAppMapLoading?: boolean
    qAppMap: QlikAppMap
}

export const QlikAppContext = createContext<QlikAppContextType>({
    qIsAppMapLoading: true,
    qAppMap: new Map()
})

export const useQlikAppContext = () => {
    const context = useContext(QlikAppContext)

    if (context === undefined) {
        throw new Error('useQlikAppContext must be used within a QlikAppContext')
    }

    return context
}

export const useQlikApp = (qAppId?: string) => {
    const { qAppMap } = useQlikAppContext()
    const [firstKey] = qAppMap.keys()
    let qDefaultAppId = ''

    for (const [, value] of qAppMap) {
        if (value?.qIsDefault) {
            qDefaultAppId = value?.qAppId
            break
        }
    }
    const qlikApp = qAppMap?.get(qAppId || qDefaultAppId || firstKey)

    return {
        qApp: qlikApp,
        qAppId: qlikApp?.qAppId,
        qReloadDate: qlikApp?.qReloadDate,
        qMixinsApi: qlikApp?.qMixinsApi,
        qApi: qlikApp?.qApi,
        qVisualizationApi: qlikApp?.qVisualizationApi,
        qSelectionApi: qlikApp?.qSelectionApi,
        qEnigmaApi: qlikApp?.qEnigmaApi,
        qTitle: qlikApp?.qTitle,
        qDescription: qlikApp?.qDescription,
        qMeta: qlikApp?.qMeta,
        qHiddenFields: qlikApp?.qHiddenFields,
        qHidePrefix: qlikApp?.qHidePrefix,
        qIsDefault: qlikApp?.qIsDefault || false
    }
}
