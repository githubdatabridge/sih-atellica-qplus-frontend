import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { useMount, useUnmount } from 'react-use'

import { QApiEnum } from '@libs/qlik-models'
import {
    QixCapabilityApi,
    QixEnigmaApi,
    qlikConfigService,
    qlikLoaderService,
    qlikService
} from '@libs/qlik-services'

import { QLIK_CHAT_PATH, QLIK_JAVASCRIPT_PATH, QLIK_STYLES_PATH } from '../../constants'
import { useQlikContext } from '../Qlik/QlikContext'
import { useQlikLanguageContext } from '../QlikLanguage/QlikLanguageContext'
import { useQlikLoaderContext } from '../QlikLoader/QlikLoaderContext'
import { QlikBootstrapContext, QlikBootstrapContextType } from './QlikBootstrapContext'

export interface QlikBootstrapProviderProps {
    value?: QlikBootstrapContextType
    children: ReactNode
}

const QlikBootstrapProvider = ({ value, children }: QlikBootstrapProviderProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [q, setQlikJavascript] = useState<any>(null)
    const [qlikCapabilityApi, setQlikCapabilityApi] = useState<QixCapabilityApi | null>(null)
    const [qlikEnigmaApi, setQlikEnigmaApi] = useState<QixEnigmaApi | null>(null)
    const { setQlikLanguage } = useQlikLanguageContext()
    const {
        settings: {
            qAuthMode,
            qDeviceType,
            qApi,
            qAssetPaths,
            qConfig,
            qLang,
            onQlikErrorCallback,
            onQlikWarningCallback,
            onQlikClosedCallback
        },
        csrfToken
    } = useQlikContext()
    const { setQlikLoaderMessage, setIsQlikLoading } = useQlikLoaderContext()

    const urlParams = useMemo(() => {
        return { csrfToken: csrfToken || null }
    }, [csrfToken])

    const config = useMemo(
        () =>
            qlikConfigService.setConfig({
                port: 443,
                protocol: 'https',
                isSecure: true,
                urlParams,
                ...qConfig
            }),
        [qConfig, urlParams]
    )

    const initializeQlikCapabilityApi = useCallback(async () => {
        try {
            let capabilityApi = null
            let internalEnigmaApi = null
            if (!q) return

            if (qApi === QApiEnum.CAPABILITY_API) {
                capabilityApi = await qlikService.setQixCapabilityService({
                    qAuthMode,
                    qlik: q,
                    config
                })
                internalEnigmaApi = await qlikService.setQixInternalEnigmaService(qAuthMode)
            }

            setQlikEnigmaApi(internalEnigmaApi)
            setQlikCapabilityApi(capabilityApi)
        } catch (error) {
            console.log('Qplus error', error)
        } finally {
            setIsQlikLoading(false)
        }
    }, [q, qApi, qAuthMode, config, setIsQlikLoading])

    useMount(async () => {
        try {
            setIsLoading(true)
            setIsQlikLoading(true)
            if (qApi === QApiEnum.CAPABILITY_API) {
                const qlikJs = await qlikLoaderService.loadQlikAssets({
                    host: qConfig.host,
                    javascriptUrl: qAssetPaths?.requireJs || QLIK_JAVASCRIPT_PATH,
                    stylesUrl: qAssetPaths?.qStyles || QLIK_STYLES_PATH,
                    insightAdvisorChatUrl: qAssetPaths?.hubChartUiJs || QLIK_CHAT_PATH,
                    virtualProxy: qConfig.prefix,
                    webIntegrationId: config?.webIntegrationId || '',
                    clientId: config?.clientId || '',
                    token: config?.token || ''
                })

                if (qlikJs) {
                    qlikJs.on('error', err => {
                        if (onQlikErrorCallback) onQlikErrorCallback(err)
                        console.error('Qplus Error', err)
                    })
                    qlikJs.on('warning', warn => {
                        if (onQlikWarningCallback) onQlikWarningCallback(warn)
                        console.warn('Qplus Error', warn)
                    })
                    qlikJs.on('closed', close => {
                        if (onQlikClosedCallback) onQlikClosedCallback(close)
                        console.warn('Qplus Error', close)
                    })
                }

                setQlikLanguage(qLang)
                setQlikJavascript(qlikJs)
                setQlikLoaderMessage('Loaded Qlik Assets')
            }
        } catch (error) {
            console.log('Qplus Error', error)
        } finally {
            setIsLoading(false)
        }
    })

    useUnmount(() => {
        if (q) {
            q?.off('error')
            q?.off('warning')
            q?.off('closed')
        }
    })

    useEffect(() => {
        if (isLoading) return
        if (qApi === QApiEnum.CAPABILITY_API) {
            if (!q) return
            initializeQlikCapabilityApi()
            if (qLang) q.setLanguage(qLang)
            if (qDeviceType) q.setDeviceType(qDeviceType)
            setQlikLoaderMessage('Initialized Qlik Capability')
        }
        if (qApi === QApiEnum.ENIGMA_API) {
            setQlikLoaderMessage('Initialized Qlik Enigma')
            setIsQlikLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    const providerValues: QlikBootstrapContextType = {
        config,
        q,
        qlikCapabilityApi,
        qlikEnigmaApi
    }

    return (
        <QlikBootstrapContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikBootstrapContext.Provider>
    )
}

export default React.memo(QlikBootstrapProvider)
