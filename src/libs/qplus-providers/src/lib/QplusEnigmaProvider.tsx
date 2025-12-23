import { ReactNode, useEffect, useState } from 'react'

import { ThemeProvider as MuiThemeProvider, useTheme } from '@mui/material'

import { BaseUiProvider } from '@libs/common-providers'
import { AlertProvider, CustomStyleHandler } from '@libs/common-ui'
import { QSettings } from '@libs/qlik-models'
import {
    QlikBootstrapProvider,
    QlikDocProvider,
    QlikEventPreventionProvider,
    QlikGlobalEventProvider,
    QlikGlobalProvider,
    QlikLoaderProvider,
    QlikProvider,
    useQlikLoaderContext
} from '@libs/qlik-providers'

import { QplusEnigmaContext, QplusEnigmaContextType } from './QplusEnigmaContext'

export interface QplusEnigmaProviderProps {
    qlikSettings: QSettings
    children: ReactNode
    value?: QplusEnigmaContextType
}

const QplusEnigmaProvider = ({ qlikSettings, value, children }: QplusEnigmaProviderProps) => {
    const providerValues: QplusEnigmaContextType = {
        qlikSettings,
        ...value
    }

    return (
        <QplusEnigmaContext.Provider value={providerValues}>
            <AlertProvider>
                <OptionsProvider>
                    <BaseUiProvider>
                        <CustomStyleHandler>
                            <QlikLoaderProvider>
                                <QlikWrapper qlikSettings={qlikSettings}>{children}</QlikWrapper>
                            </QlikLoaderProvider>
                        </CustomStyleHandler>
                    </BaseUiProvider>
                </OptionsProvider>
            </AlertProvider>
        </QplusEnigmaContext.Provider>
    )
}

const OptionsProvider: React.FC<any> = ({ children }) => {
    const existingTheme = useTheme()
    return <MuiThemeProvider theme={existingTheme}>{children}</MuiThemeProvider>
}

interface QplusProps {
    qlikSettings: QSettings
    children: ReactNode
}

const QlikWrapper: React.FC<QplusProps> = ({ children, qlikSettings }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { isQlikLoading } = useQlikLoaderContext()
    const { LoadingComponent } = qlikSettings

    useEffect(() => {
        setIsLoading(isQlikLoading)
    }, [isQlikLoading])

    const Loader = LoadingComponent as React.ElementType

    return (
        <>
            {isLoading && <Loader />}
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                <QlikProviderWrapper qlikSettings={qlikSettings}>
                    <QlikBoostrapProviderWrapper qlikSettings={qlikSettings}>
                        {children}
                    </QlikBoostrapProviderWrapper>
                </QlikProviderWrapper>
            </div>
        </>
    )
}

interface QlikProviderWrapperProps {
    qlikSettings: QSettings
    children: ReactNode
}

const QlikProviderWrapper: React.FC<QlikProviderWrapperProps> = ({ qlikSettings, children }) => {
    return <QlikProvider settings={qlikSettings}>{children}</QlikProvider>
}

const QlikBoostrapProviderWrapper: React.FC<QlikProviderWrapperProps> = ({ children }) => {
    return (
        <QlikEventPreventionProvider>
            <QlikGlobalEventProvider>
                <QlikBootstrapProvider>
                    <QlikGlobalProvider>
                        <QlikDocProvider>{children}</QlikDocProvider>
                    </QlikGlobalProvider>
                </QlikBootstrapProvider>
            </QlikGlobalEventProvider>
        </QlikEventPreventionProvider>
    )
}

export default QplusEnigmaProvider
