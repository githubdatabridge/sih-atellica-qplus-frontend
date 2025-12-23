import React, { ReactNode, useState, useCallback } from 'react'

import { QSettings, QAuthMode } from '@libs/qlik-models'

import QlikAuthProvider from '../QlikAuth/QlikAuthProvider'
import QlikLanguageProvider from '../QlikLanguage/QlikLanguageProvider'
import QlikSaaSAuthProvider from '../QlikSaaSAuth/QlikSaaSAuthProvider'
import QlikSaaSJwtAuthProvider from '../QlikSaaSAuth/QlikSaaSJwtAuthProvider'
import { QlikContext, QlikContextType } from './QlikContext'

interface Props {
    condition: boolean
    wrapper: (children: ReactNode) => JSX.Element
    children: ReactNode
}

const ConditionalWrapper = ({ condition, wrapper, children }: Props) => (
    <>{condition ? wrapper(children) : children}</>
)

export interface QlikProviderProps {
    children: ReactNode
    settings: QSettings
    oAuthUrl?: string
    returnTo?: string
}

export const QlikProvider = ({ settings, oAuthUrl, returnTo, children }: QlikProviderProps) => {
    const [csrfToken, setToken] = useState<string>('')

    const setCsrfToken = useCallback((_csrfToken: string) => {
        setToken(_csrfToken)
    }, [])

    const providerValue: QlikContextType = { settings, csrfToken, setCsrfToken }

    return (
        <QlikContext.Provider value={providerValue}>
            <QlikLanguageProvider>
                <ConditionalWrapper
                    condition={settings.qAuthMode === QAuthMode.QSAAS}
                    wrapper={children => <QlikSaaSAuthProvider>{children}</QlikSaaSAuthProvider>}>
                    <ConditionalWrapper
                        condition={settings.qAuthMode === QAuthMode.QSAAS_JWT}
                        wrapper={children => (
                            <QlikSaaSJwtAuthProvider oAuthUrl={oAuthUrl} returnTo={returnTo}>
                                {children}
                            </QlikSaaSJwtAuthProvider>
                        )}>
                        <ConditionalWrapper
                            condition={settings.qAuthMode === QAuthMode.QES}
                            wrapper={children => (
                                <QlikAuthProvider shouldAuthenticate={false}>
                                    {children}
                                </QlikAuthProvider>
                            )}>
                            {children}
                        </ConditionalWrapper>
                    </ConditionalWrapper>
                </ConditionalWrapper>
            </QlikLanguageProvider>
        </QlikContext.Provider>
    )
}

export default QlikProvider
