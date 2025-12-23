import React, { ReactNode, useEffect, useState } from 'react'

import { QGlobalResult } from '@libs/qlik-models'
import { qlikService } from '@libs/qlik-services'

import { useQlikContext } from '../Qlik/QlikContext'
import { useQlikBootstrapContext } from '../QlikBootstrap/QlikBootstrapContext'
import { useQlikGlobalContext } from '../QlikGlobal/QlikGlobalContext'
import { useQlikLoaderContext } from '../QlikLoader/QlikLoaderContext'
import { QlikDocContext, QlikDocContextType, QlikDocMap, QDocResult } from './QlikDocContext'

export interface IQlikDocProviderProps {
    children: ReactNode
    value?: QlikDocContextType
}

const QlikDocProvider = ({ value, children }: IQlikDocProviderProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const [qDocMap, setQlikDocMap] = useState<QlikDocMap>(new Map())
    const { setQlikLoaderMessage, setIsQlikAppLoading } = useQlikLoaderContext()
    const {
        settings: { qDocs: docs }
    } = useQlikContext()

    const { config } = useQlikBootstrapContext()
    const { isQlikGlobalLoading } = useQlikLoaderContext()
    const { setQlikGlobalMap } = useQlikGlobalContext()

    const initializeQlikDocs = async () => {
        try {
            setIsLoading(true)
            const qDocMap = new Map<string, QDocResult>()
            const qActionResults: any[] = []
            const qGlobalMap: Map<string, QGlobalResult> = new Map()

            for (const qDoc of docs) {
                const session = await qlikService.setQixEnigmaService({
                    config: { ...config, appId: qDoc.qDocId },
                    onQlikEngineSessionErrorCallback: qDoc?.onQlikEngineSessionErrorCallback
                })
                qGlobalMap.set(qDoc.qDocId, {
                    qGlobalApi: session.$apiGlobal,
                    qAuthenticatedUser: session.$apiGlobal?.dAuthenticatedUser,
                    qEngineVersion: session.$apiGlobal?.dEngineVersion,
                    qProductVersion: session.$apiGlobal?.dProductVersion,
                    qQTProduct: session.$apiGlobal?.dQTProduct
                })
                const doc = await session.$apiGlobal.openDoc(qDoc.qDocId)
                const layout = await doc.getAppLayout()
                qDocMap.set(qDoc.qDocId, {
                    qDocId: qDoc.qDocId,
                    qActionResults: qActionResults,
                    qReloadDate: layout.qLastReloadTime,
                    qDoc: doc,
                    qTitle: layout.qTitle,
                    qDescription: '',
                    qMeta: qDoc?.qMeta || {},
                    qHiddenFields: qDoc?.qHiddenFields || [],
                    qHidePrefix: qDoc?.qHidePrefix || ''
                })
            }

            setQlikGlobalMap(qGlobalMap)
            setQlikDocMap(qDocMap)
            setIsLoading(false)
            setQlikLoaderMessage('Qlik docs registered')
        } catch (error) {
            console.log(error)
            throw new Error(`Error while initializing qlik apps: ${error}`)
        }
    }

    useEffect(() => {
        if (isQlikGlobalLoading) return

        void (async () => {
            try {
                await initializeQlikDocs()
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsQlikAppLoading(false)
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isQlikGlobalLoading])

    const providerValues: QlikDocContextType = {
        qDocMap
    }

    if (isLoading) return null

    return (
        <QlikDocContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikDocContext.Provider>
    )
}

export default QlikDocProvider
