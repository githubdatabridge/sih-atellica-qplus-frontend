import { FC, ReactNode, useEffect, useState } from 'react'

import { useMount } from 'react-use'

import { ThemeProvider as MuiThemeProvider, useTheme } from '@mui/material'

import {
    NotificationProvider,
    SocialNotificationsHandler,
    SyncNotificationProvider
} from '@libs/collaboration-providers'
import { BaseUiProvider, I18nProvider } from '@libs/common-providers'
import { AlertDuration, AlertProvider, CustomStyleHandler } from '@libs/common-ui'
import { KEYS, storage } from '@libs/common-utils'
import { AuthInsightProvider, UserPreferencesProvider } from '@libs/core-providers'
import { QApiEnum, QSettings } from '@libs/qlik-models'
import { QlikPinWallProvider, QlikPinWallUiProvider } from '@libs/qlik-pinwall-ui'
import {
    QlikAppEventProvider,
    QlikAppProvider,
    QlikBookmarkProvider,
    QlikBootstrapProvider,
    QlikDocProvider,
    QlikEventPreventionProvider,
    QlikGlobalEventProvider,
    QlikGlobalProvider,
    QlikLoaderProvider,
    QlikMasterItemsProvider,
    QlikProvider,
    QlikSelectionProvider,
    QlikSheetProvider,
    QlikThemeProvider,
    useQlikLoaderContext
} from '@libs/qlik-providers'
import { QlikReportingProvider, QlikReportingUiProvider } from '@libs/qlik-reporting-ui'

import { InsightConfig, InsightContext, InsightContextType } from './InsightContext'

interface Props {
    condition: boolean
    wrapper: (children: ReactNode) => JSX.Element
    children: ReactNode
}

const ConditionalWrapper = ({ condition, wrapper, children }: Props) => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{condition ? wrapper(children) : children}</>
)

export interface InsightProviderProps {
    locale: string
    tenantId: string
    customerId: string
    mashupAppId: string
    qlikSettings: QSettings
    config: InsightConfig
    isWithNotifications?: boolean
    sessionPollingInMilliseconds?: number
    showNotificationsToastMsg?: boolean
    isDebug?: boolean
    returnTo?: string
    children: ReactNode
    value?: InsightContextType
    handleOnAuthInsightErrorCallback?: (error: any) => void
    handleOnForbiddenCallback?: (error: string, message: string, statusCode: number) => void
    handleQlikOnSessionExpiredCallback?: () => void
}

const InsightProvider = ({
    tenantId,
    customerId,
    mashupAppId,
    locale = 'EN',
    config,
    isDebug = false,
    returnTo = '',
    qlikSettings,
    isWithNotifications = true,
    showNotificationsToastMsg = true,
    sessionPollingInMilliseconds = 15000,
    value,
    handleOnAuthInsightErrorCallback,
    handleOnForbiddenCallback,
    handleQlikOnSessionExpiredCallback,
    children
}: InsightProviderProps) => {
    useMount(async () => {
        try {
            const isSsl = qlikSettings?.qConfig?.isSecure || true
            const qlikUrl = `${isSsl ? 'https://' : 'http://'}${qlikSettings?.qConfig?.host}`
            storage.removeMany(Object.values(KEYS))
            storage.save(KEYS.QPLUS_TENANT_ID, tenantId)
            storage.save(KEYS.QPLUS_CUSTOMER_ID, customerId)
            storage.save(KEYS.QPLUS_MASHUP_APP_ID, mashupAppId)
            storage.save(KEYS.QPLUS_API_URL, config.apiUrl)
            storage.save(KEYS.QPLUS_GATEWAY, config?.gateway || '')
            storage.save(KEYS.QPLUS_QLIK_ENDPOINT, qlikUrl)
            storage.save(KEYS.QPLUS_IS_DEBUG, isDebug)
            storage.save(KEYS.QPLUS_VIRTUAL_PROXY, qlikSettings?.qConfig?.prefix || '')
        } catch (error: any) {
            console.log('Qplus error', error)
        }
    })

    const providerValues: InsightContextType = {
        tenantId,
        customerId,
        mashupAppId,
        config,
        ...value
    }

    return (
        <InsightContext.Provider value={providerValues}>
            <I18nProvider locale={locale}>
                <AlertProvider>
                    <OptionsProvider>
                        <BaseUiProvider>
                            <CustomStyleHandler>
                                <QlikLoaderProvider>
                                    <QlikWrapper
                                        qlikSettings={qlikSettings}
                                        tenantId={tenantId}
                                        customerId={customerId}
                                        mashupAppId={mashupAppId}
                                        apiUrl={config.apiUrl}
                                        handleOnAuthInsightErrorCallback={
                                            handleOnAuthInsightErrorCallback
                                        }
                                        handleOnForbiddenCallback={handleOnForbiddenCallback}
                                        handleQlikOnSessionExpiredCallback={
                                            handleQlikOnSessionExpiredCallback
                                        }
                                        isWithNotifications={isWithNotifications}
                                        showNotificationsToastMsg={showNotificationsToastMsg}
                                        sessionPollingInMilliseconds={sessionPollingInMilliseconds}
                                        returnTo={returnTo}>
                                        {children}
                                    </QlikWrapper>
                                </QlikLoaderProvider>
                            </CustomStyleHandler>
                        </BaseUiProvider>
                    </OptionsProvider>
                </AlertProvider>
            </I18nProvider>
        </InsightContext.Provider>
    )
}

const OptionsProvider: React.FC<any> = ({ children }) => {
    const existingTheme = useTheme()
    return <MuiThemeProvider theme={existingTheme}>{children}</MuiThemeProvider>
}

interface QplusProps {
    qlikSettings: QSettings
    tenantId: string
    customerId: string
    mashupAppId: string
    apiUrl: string
    isWithNotifications?: boolean
    showNotificationsToastMsg?: boolean
    sessionPollingInMilliseconds?: number
    returnTo?: string
    children: ReactNode
    handleOnAuthInsightErrorCallback?: (error: any) => void
    handleOnForbiddenCallback?: (error: string, message: string, statusCode: number) => void
    handleQlikOnSessionExpiredCallback?: () => void
}

const QlikWrapper: React.FC<QplusProps> = ({
    children,
    qlikSettings,
    apiUrl,
    tenantId,
    customerId,
    mashupAppId,
    returnTo = '',
    isWithNotifications = true,
    showNotificationsToastMsg = true,
    sessionPollingInMilliseconds = 15000,
    handleOnForbiddenCallback,
    handleOnAuthInsightErrorCallback,
    handleQlikOnSessionExpiredCallback
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { isQlikLoading, isQlikAppLoading, isQlikGlobalLoading } = useQlikLoaderContext()
    const { LoadingComponent } = qlikSettings

    useEffect(() => {
        setIsLoading(isQlikLoading || isQlikAppLoading || isQlikGlobalLoading)
    }, [isQlikLoading, isQlikAppLoading, isQlikGlobalLoading])

    const Loader = LoadingComponent as React.ElementType

    return (
        <>
            {isLoading && <Loader />}
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                <QlikProviderWrapper
                    qlikSettings={qlikSettings}
                    apiUrl={apiUrl}
                    tenantId={tenantId}
                    customerId={customerId}
                    mashupAppId={mashupAppId}
                    returnTo={returnTo}>
                    <AuthInsightProvider
                        sessionPollingInMilliseconds={sessionPollingInMilliseconds}
                        handleOnForbiddenCallback={handleOnForbiddenCallback}
                        handleOnAuthInsightErrorCallback={handleOnAuthInsightErrorCallback}
                        handleQlikOnSessionExpiredCallback={handleQlikOnSessionExpiredCallback}>
                        <UserPreferencesProvider>
                            <QlikBoostrapProviderWrapper
                                qlikSettings={qlikSettings}
                                isWithNotifications={isWithNotifications}
                                showNotificationsToastMsg={showNotificationsToastMsg}>
                                {children}
                            </QlikBoostrapProviderWrapper>
                        </UserPreferencesProvider>
                    </AuthInsightProvider>
                </QlikProviderWrapper>
            </div>
        </>
    )
}

interface QlikProviderWrapperProps {
    qlikSettings: QSettings
    tenantId?: string
    customerId?: string
    mashupAppId?: string
    apiUrl?: string
    isWithNotifications?: boolean
    showNotificationsToastMsg?: boolean
    returnTo?: string
    children: ReactNode
}

const QlikProviderWrapper: React.FC<QlikProviderWrapperProps> = ({
    qlikSettings,
    apiUrl,
    tenantId,
    customerId,
    mashupAppId,
    returnTo = '',
    children
}) => {
    const returnUrl = encodeURIComponent(qlikSettings?.qConfig?.returnTo)

    // PAM: LogIn through Qlik Identity Provider
    const oAuthEndpoint = new URL(`${apiUrl}/qlik/saas/jwt/login`) as any
    const redirectUri = `${oAuthEndpoint}?tenantId=${tenantId}&customerId=${customerId}&mashupAppName=${mashupAppId}&returnTo=${returnUrl}`

    return (
        <QlikProvider settings={qlikSettings} oAuthUrl={redirectUri} returnTo={returnTo}>
            {children}
        </QlikProvider>
    )
}

const QlikBoostrapProviderWrapper: React.FC<QlikProviderWrapperProps> = ({
    qlikSettings,
    isWithNotifications,
    showNotificationsToastMsg,
    children
}) => {
    return (
        <QlikEventPreventionProvider>
            <QlikGlobalEventProvider>
                <QlikBootstrapProvider>
                    <QlikGlobalProviderWrapper
                        qlikSettings={qlikSettings}
                        isWithNotifications={isWithNotifications}
                        showNotificationsToastMsg={showNotificationsToastMsg}>
                        <QlikThemeProvider theme={qlikSettings.qTheme}>
                            {children}
                        </QlikThemeProvider>
                    </QlikGlobalProviderWrapper>
                </QlikBootstrapProvider>
            </QlikGlobalEventProvider>
        </QlikEventPreventionProvider>
    )
}

const QlikGlobalProviderWrapper: React.FC<QlikProviderWrapperProps> = ({
    qlikSettings,
    isWithNotifications,
    showNotificationsToastMsg,
    children
}) => {
    return (
        <QlikGlobalProvider>
            <QlikAppProviderWrapper
                qlikSettings={qlikSettings}
                isWithNotifications={isWithNotifications}
                showNotificationsToastMsg={showNotificationsToastMsg}>
                {children}
            </QlikAppProviderWrapper>
        </QlikGlobalProvider>
    )
}

const QlikAppProviderWrapper: React.FC<QlikProviderWrapperProps> = ({
    qlikSettings,
    isWithNotifications,
    showNotificationsToastMsg,
    children
}) => {
    return (
        <ConditionalWrapper
            condition={qlikSettings.qApi === QApiEnum.CAPABILITY_API}
            wrapper={children => <QlikAppEventProvider>{children}</QlikAppEventProvider>}>
            <ConditionalWrapper
                condition={qlikSettings.qApi === QApiEnum.CAPABILITY_API}
                wrapper={children => (
                    <QlikAppProvider qApps={qlikSettings.qApps}>{children}</QlikAppProvider>
                )}>
                <ConditionalWrapper
                    condition={qlikSettings.qApi === QApiEnum.ENIGMA_API}
                    wrapper={children => <QlikDocProvider>{children}</QlikDocProvider>}>
                    <QlikContentProviderWrapper
                        qlikSettings={qlikSettings}
                        isWithNotifications={isWithNotifications}
                        showNotificationsToastMsg={showNotificationsToastMsg}>
                        {children}
                    </QlikContentProviderWrapper>
                </ConditionalWrapper>
            </ConditionalWrapper>
        </ConditionalWrapper>
    )
}

const QlikContentProviderWrapper: React.FC<QlikProviderWrapperProps> = ({
    isWithNotifications,
    showNotificationsToastMsg,
    children
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { isQlikAppLoading } = useQlikLoaderContext()

    useEffect(() => {
        setIsLoading(isQlikAppLoading)
    }, [isQlikAppLoading])

    if (isLoading) return null

    return (
        <QlikReportingUiProvider>
            <QlikPinWallUiProvider>
                <QlikSelectionProvider>
                    <QlikBookmarkProvider>
                        <QlikMasterItemsProvider>
                            <QlikSheetProvider>
                                <QlikNotificationWrapper
                                    isWithNotifications={isWithNotifications}
                                    showNotificationsToastMsg={showNotificationsToastMsg}>
                                    {children}
                                </QlikNotificationWrapper>
                            </QlikSheetProvider>
                        </QlikMasterItemsProvider>
                    </QlikBookmarkProvider>
                </QlikSelectionProvider>
            </QlikPinWallUiProvider>
        </QlikReportingUiProvider>
    )
}

interface QlikSelfServiceWrapperProps {
    isWithNotifications?: boolean
    showNotificationsToastMsg?: boolean
    children: ReactNode
}

const QlikNotificationWrapper: React.FC<QlikSelfServiceWrapperProps> = ({
    isWithNotifications = true,
    showNotificationsToastMsg = true,
    children
}) => {
    return (
        <ConditionalWrapper
            condition={isWithNotifications}
            wrapper={children => (
                <NotificationWrapper showNotificationsToastMsg={showNotificationsToastMsg}>
                    {children}
                </NotificationWrapper>
            )}>
            {children}
        </ConditionalWrapper>
    )
}

interface NotificationWrapperProps {
    showNotificationsToastMsg?: boolean
    children: ReactNode
}

const NotificationWrapper: FC<NotificationWrapperProps> = ({
    showNotificationsToastMsg = true,
    children
}) => {
    return (
        <SyncNotificationProvider>
            <NotificationProvider>
                <ConditionalWrapper
                    condition={showNotificationsToastMsg}
                    wrapper={children => (
                        <SocialNotificationsHandler duration={AlertDuration.VERY_LONG}>
                            <QlikReportingProvider>
                                <QlikPinWallProvider>{children}</QlikPinWallProvider>
                            </QlikReportingProvider>
                        </SocialNotificationsHandler>
                    )}>
                    {children}
                </ConditionalWrapper>
            </NotificationProvider>
        </SyncNotificationProvider>
    )
}

export default InsightProvider
