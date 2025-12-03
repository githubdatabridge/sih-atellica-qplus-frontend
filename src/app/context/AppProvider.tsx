import React, { useCallback, useState, useEffect } from 'react'
import { QplusLoaderProvider, QplusProvider } from '@databridge/qplus'
import { QplusFieldFilter } from '@databridge/qplus-types'
import { env } from 'env'

import { getQlikConfig } from 'app/config/qlikConfig'
import { SplashScreen } from 'app/layout/SplashScreen'
import { ErrorDialog } from 'app/layout/components/dialog/ErrorDialog'
import { AppContext, AppContextType, TPages, TQlikApp } from './AppContext'

interface Props {
    value?: AppContextType
    hostname?: string
    vp?: string
    isInitialized: boolean
    defaultPage: string
    pages: TPages
    qApps: TQlikApp[]
    hasWrongConfiguration?: boolean
}

const AppProvider: React.FC<Props> = ({
    value = {},
    hostname,
    vp = '',
    qApps,
    defaultPage,
    pages,
    isInitialized,
    hasWrongConfiguration = false,
    children
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAdminRole, setIsAdmin] = useState<boolean>(false)
    const [isHeaderVisible, setHeaderVisible] = useState<boolean>(true)
    const [selectionCount, setCountSelection] = useState<number>(0)
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true)
    const [isUserGuard, setUserGuard] = useState<boolean>(false)
    const [defaultFilters, setFilters] = useState<QplusFieldFilter[]>([])
    const [hiddenFields, setFields] = useState<string[]>([])
    const [showForbiddenDialog, setShowForbiddenDialog] = useState<boolean>(false)
    const [showSessionExpirationDialog, setSessionExpirationDialog] = useState<boolean>(false)
    const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState<boolean>(false)
    const [showUnauthorizedDialog, setShowUnauthorizeddDialog] = useState<boolean>(false)

    const setIsUserGuard = useCallback((isGuard: boolean) => {
        setUserGuard(isGuard)
    }, [])

    const setIsAdminRole = useCallback((isAdmin: boolean) => {
        setIsAdmin(isAdmin)
    }, [])

    const setDefaultFilters = useCallback((filters: QplusFieldFilter[]) => {
        setFilters(filters)
    }, [])

    const setHiddenFields = useCallback((fields: string[]) => {
        setFields(fields)
    }, [])

    const setIsHeaderVisible = useCallback((isVisible: boolean) => {
        setHeaderVisible(isVisible)
    }, [])

    const setSelectionCount = useCallback((count: number) => {
        setCountSelection(count)
    }, [])

    const setShowSessionExpirationDialog = useCallback((show: boolean) => {
        setSessionExpirationDialog(show)
    }, [])

    const onHandleForbidden = useCallback(
        (error: string, message: string, statusCode: number) => {
            setShowForbiddenDialog(true)
        },
        [setShowForbiddenDialog]
    )

    useEffect(() => {
        setIsLoading(isAppLoading)

        return () => {}
    }, [isAppLoading])

    const onQlikAccessDeniedCallback = useCallback(() => {
        setShowAccessDeniedDialog(true)
    }, [])

    const onQlikClosedCallback = useCallback(() => {
        alert('Close')
    }, [])

    const handleCloseErrorClick = () => {
        window.location = env.REACT_APP_LOGIN_URL || ''
    }

    const logoutUser = () => {
        localStorage.clear()
    }

    return (
        <>
            {(isLoading || !isInitialized) && <SplashScreen />}
            {isInitialized && !hasWrongConfiguration && (
                <div style={{ display: isLoading ? 'none' : 'block' }}>
                    <AppContext.Provider
                        value={{
                            hostname,
                            vp,
                            isUserGuard,
                            defaultFilters,
                            isAppLoading,
                            isHeaderVisible,
                            selectionCount,
                            showSessionExpirationDialog,
                            hiddenFields,
                            defaultPage,
                            pages,
                            isAdminRole,
                            logoutUser,
                            setIsAdminRole,
                            setIsUserGuard,
                            setDefaultFilters,
                            setHiddenFields,
                            setIsAppLoading,
                            setIsHeaderVisible,
                            setSelectionCount,
                            setShowSessionExpirationDialog,
                            ...value
                        }}>
                        <QplusLoaderProvider>
                            <QplusProvider
                                handleOnForbiddenCallback={onHandleForbidden}
                                tenantId={
                                    env.REACT_APP_TENANT_ID ?? process.env.REACT_APP_TENANT_ID
                                }
                                customerId={
                                    env.REACT_APP_CUSTOMER_ID ?? process.env.REACT_APP_CUSTOMER_ID
                                }
                                mashupAppId={
                                    env.REACT_APP_MASHUP_APP_ID ??
                                    process.env.REACT_APP_MASHUP_APP_ID
                                }
                                qlikSettings={getQlikConfig(
                                    hostname,
                                    vp,
                                    qApps,
                                    env.REACT_APP_DEFAULT_THEME,
                                    onQlikAccessDeniedCallback,
                                    onQlikClosedCallback
                                )}
                                config={{
                                    apiUrl: env.REACT_APP_INSIGHT_APP_API ?? '',
                                    gateway: env.REACT_APP_INSIGHT_SOCKET_PATH ?? ''
                                }}
                                locale="SYS"
                                isWithNotifications={true}
                                showNotificationsToastMsg={true}
                                handleOnAuthInsightErrorCallback={() => {
                                    setShowUnauthorizeddDialog(true)
                                }}
                                handleQlikOnSessionExpiredCallback={() =>
                                    setSessionExpirationDialog(true)
                                }>
                                {children}
                            </QplusProvider>
                        </QplusLoaderProvider>
                    </AppContext.Provider>
                </div>
            )}

            <ErrorDialog
                title="Error"
                primaryText={
                    showUnauthorizedDialog
                        ? 'Unauthorized!'
                        : showAccessDeniedDialog
                        ? 'Access Denied'
                        : showSessionExpirationDialog
                        ? 'Session Expired'
                        : showForbiddenDialog
                        ? 'Forbidden'
                        : 'Invalid parameters'
                }
                secondaryText={
                    showSessionExpirationDialog
                        ? 'Please re-login to POCWeb'
                        : 'If the problem persists, please contact your system administrator'
                }
                buttonText="Close"
                isOpen={
                    showUnauthorizedDialog ||
                    showAccessDeniedDialog ||
                    showSessionExpirationDialog ||
                    showForbiddenDialog ||
                    hasWrongConfiguration
                }
                handleCloseCallback={handleCloseErrorClick}
            />
        </>
    )
}

export default AppProvider
