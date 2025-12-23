import React, { ReactNode, useEffect, useState } from 'react'

import { QApp, QGlobalResult } from '@libs/qlik-models'

import { useQlikContext } from '../Qlik/QlikContext'
import { useQlikBootstrapContext } from '../QlikBootstrap/QlikBootstrapContext'
import { useQlikAppEventContext } from '../QlikEvent/QlikAppEventContext'
import { useQlikGlobalEventContext } from '../QlikEvent/QlikGlobalEventContext'
import { useQlikGlobalContext } from '../QlikGlobal/QlikGlobalContext'
import { useQlikLoaderContext } from '../QlikLoader/QlikLoaderContext'
import useQlikAppAction from './hooks/useQlikAppAction'
import { QAppResult, QlikAppContext, QlikAppContextType, QlikAppMap } from './QlikAppContext'

export interface IQlikAppProviderProps {
    qApps: QApp[]
    children: ReactNode
    value?: QlikAppContextType
}

const QlikAppProvider = ({ value, children, qApps = [] }: IQlikAppProviderProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const [qAppMap, setQlikAppMap] = useState<QlikAppMap>(new Map())
    const { isQlikGlobalLoading, setQlikLoaderMessage, setIsQlikAppLoading } =
        useQlikLoaderContext()
    const {
        settings: { qGlobalEvents }
    } = useQlikContext()

    const { qlikCapabilityApi, qlikEnigmaApi, config } = useQlikBootstrapContext()
    const { setQlikGlobalMap } = useQlikGlobalContext()
    const { setQlikAction } = useQlikAppAction()
    const { globalEventHandler } = useQlikGlobalEventContext()
    const { qAppEventHandler } = useQlikAppEventContext()

    const initializeQlikApps = async (apps: QApp[]) => {
        try {
            setIsLoading(true)
            const qAppMap = new Map()
            let qReloadDate = null
            let qTitle = ''
            let qDescription = ''
            const qGlobalMap: Map<string, QGlobalResult> = new Map()
            let qGlobalApi: any
            const qActionResults: any[] = []

            for (const qApp of apps) {
                let qCapabilityApp = null

                if (qlikCapabilityApi) {
                    qGlobalApi = qlikCapabilityApi?.$apiRoot?.$apiGlobal

                    qGlobalMap.set(qApp.qAppId, {
                        qGlobalApi: qGlobalApi || null,
                        qAuthenticatedUser: qGlobalApi?.qAuthenticatedUser || '',
                        qEngineVersion: qGlobalApi?.qEngineVersion || '',
                        qProductVersion: qGlobalApi?.qProductVersion || '',
                        qQTProduct: qGlobalApi?.qQTProduct || ''
                    })

                    // eslint-disable-next-line no-loop-func
                    qGlobalEvents?.forEach((type: string) => {
                        if (qGlobalApi) {
                            qGlobalApi?.registerEvent(type, (event: unknown) => {
                                globalEventHandler(type, event)
                            })
                        }
                    })

                    if (!qApp?.qIsSessionApp) {
                        qCapabilityApp = await qlikCapabilityApi?.$apiRoot.openApp(
                            qApp.qAppId,
                            config
                        )
                    } else {
                        qCapabilityApp = await qlikCapabilityApi?.$apiRoot.createsSessionAppFromApp(
                            qApp.qAppId,
                            config
                        )

                        if (qApp?.qDoReload) {
                            if (
                                qApp?.qScriptReplaceStrings &&
                                qApp?.qScriptReplaceStrings.length > 0
                            ) {
                                let qNewStr = ''
                                const qOldStr = await qCapabilityApp?.qApp.getScript()
                                for (const strReplace of qApp.qScriptReplaceStrings) {
                                    qNewStr = qOldStr.qScript.replace(
                                        strReplace.oldString,
                                        strReplace.newString
                                    )
                                }
                                await qCapabilityApp?.qApp.setScript(qNewStr)
                            }
                            const resultReload = await qCapabilityApp?.qApp.doReload()
                            if (!resultReload) {
                                if (qApp?.onQlikReloadErrorCallback) {
                                    qApp?.onQlikReloadErrorCallback()
                                }
                            }
                        }
                    }

                    const qAppLayout = await qCapabilityApp?.qApp.getAppLayout()
                    qReloadDate = qAppLayout.layout.qLastReloadTime
                    qTitle = qAppLayout.layout.qTitle
                    qDescription = qAppLayout.layout.qDescription

                    if (qApp?.qActions?.length > 0) {
                        for (let i = 0; i <= qApp.qActions?.length - 1; i++) {
                            const qAction = qApp.qActions[i]
                            const r = await setQlikAction(qCapabilityApp, qAction)
                            qActionResults.push({ id: qAction.id, result: r })
                        }
                    }

                    await qlikCapabilityApi?.$apiRoot.registerApp(qApp.qAppId, qCapabilityApp)

                    if (qAppEventHandler) {
                        qApp?.qAppEvents?.forEach((type: string) => {
                            qCapabilityApp?.registerEvent(type, (event: any) => {
                                qAppEventHandler(
                                    qApp.qAppId,
                                    type,
                                    event,
                                    qApp?.onQlikAppClosedCallback,
                                    qApp?.onQlikAppErrorCallback,
                                    qApp?.onQlikAppWarningCallback
                                )
                            })
                        })
                    }

                    const qAppModel = await qCapabilityApp?.qApp.model.waitForOpen.promise

                    const qixApp = await qlikEnigmaApi?.$apiGlobal?.setDoc(qAppModel.enigmaModel)

                    if (qixApp) await qlikEnigmaApi?.$apiGlobal.registerApp(qApp.qAppId, qixApp)
                    setQlikLoaderMessage('Qlik apps registered')
                }
                const [qCapabilityApi, qEnigmaApi] = await Promise.all([
                    qlikCapabilityApi?.$apiRoot.$apiApps.get(qApp.qAppId),
                    qlikEnigmaApi?.$apiGlobal?.$apiDocs.get(qApp.qAppId)
                ])

                qAppMap.set(qApp.qAppId, {
                    qAppId: qApp.qAppId,
                    qIsDefault: qApp?.qIsDefault || false,
                    qActionResults: qActionResults,
                    qReloadDate: qReloadDate,
                    qApi: qCapabilityApi || null,
                    qMixinsApi: qlikCapabilityApi?.$apiMixin,
                    qVisualizationApi: qCapabilityApi?.$apiVisualization,
                    qSelectionApi: qCapabilityApi?.$apiSelection,
                    qEnigmaApi: qEnigmaApi || null,
                    qTitle: qTitle || '',
                    qDescription: qDescription || '',
                    qMeta: qApp?.qMeta || {},
                    qHiddenFields: qApp?.qHiddenFields || [],
                    qHidePrefix: qApp?.qHidePrefix || ''
                })
            }

            setQlikGlobalMap(qGlobalMap)
            setQlikAppMap(qAppMap)
            setQlikLoaderMessage('Connected to the QIX beast!')
        } catch (error) {
            console.log(error)
            throw new Error(`Error while initializing qlik apps: ${error}`)
        } finally {
            setIsLoading(false)
            setIsQlikAppLoading(false)
        }
    }

    useEffect(() => {
        if (isQlikGlobalLoading) return
        if (qApps.length === 0) return

        void (async () => {
            try {
                await initializeQlikApps(qApps)
            } catch (error) {
                console.log('Qplus Error', error)
            }
        })()
        return () => {
            for (const qApp of qApps) {
                qlikCapabilityApi?.$apiRoot.unregisterApp(qApp.qAppId, qApp.qAppEvents)
            }
            const cleaneUpMap = new Map<string, QAppResult>()
            setQlikAppMap(cleaneUpMap)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isQlikGlobalLoading])

    const providerValues: QlikAppContextType = {
        qIsAppMapLoading: isLoading,
        qAppMap
    }

    if (isQlikGlobalLoading) return null

    return (
        <QlikAppContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikAppContext.Provider>
    )
}

export default QlikAppProvider
