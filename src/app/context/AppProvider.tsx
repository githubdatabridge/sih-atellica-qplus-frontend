import React, { useCallback, useState, useEffect } from "react";
import { useMount } from "react-use";
import { QplusLoaderProvider, QplusProvider } from "@databridge/qplus";
import { QplusFieldFilter } from "@databridge/qplus-types";

import { initI18n, mapLanguageCode } from "app/i18n";
import languageResources from "assets/i18n";
import translations from "app/common/translations";
import { getQlikConfig } from "app/config/qlikConfig";
import { SplashScreen } from "app/layout/SplashScreen";
import { ErrorDialog } from "app/layout/components/dialog/error/ErrorDialog";
import { DEV } from "app/common/config";
import { IS_DEV } from "app/config/appConfig";
import { processUrl } from "app/utils/appUtils";
import { AppContext, AppContextType, TPages, TQlikApp } from "./AppContext";

// Module-level cache for i18n to survive HMR in dev mode
let cachedBrowserLanguage: string | null = null;

interface Props {
    isInitialized: boolean;
    defaultPage: string;
    pages: TPages;
    qApps: TQlikApp[];
    hasWrongConfiguration?: boolean;
    value?: AppContextType;
    hostname?: string;
    vp?: string;
    children?: React.ReactNode;
}

const AppProvider: React.FC<Props> = ({
    value = {},
    hostname,
    vp = "",
    qApps,
    defaultPage,
    pages,
    isInitialized,
    hasWrongConfiguration = false,
    children
}) => {
    const [isI18nReady, setIsI18nReady] = useState<boolean>(false);
    const [browserLanguage, setBrowserLanguage] = useState<string>("");
    const [isAdminRole, setIsAdmin] = useState<boolean>(false);
    const [isHeaderVisible, setHeaderVisible] = useState<boolean>(true);
    const [selectionCount, setCountSelection] = useState<number>(0);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(false);
    const [isUserGuard, setUserGuard] = useState<boolean>(false);
    const [defaultFilters, setFilters] = useState<QplusFieldFilter[]>([]);
    const [modifiedApps, setModifiedApps] = useState<TQlikApp[]>([]);
    const [hiddenFields, setFields] = useState<string[]>([]);
    const [showForbiddenDialog, setShowForbiddenDialog] = useState<boolean>(false);
    const [showSessionExpirationDialog, setSessionExpirationDialog] = useState<boolean>(false);
    const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState<boolean>(false);
    const [showUnauthorizedDialog, setShowUnauthorizeddDialog] = useState<boolean>(false);

    // Consolidated ready state - only true when ALL initialization is complete
    const isReady = isInitialized && isI18nReady && browserLanguage && modifiedApps.length > 0;

    const setIsUserGuard = (isGuard: boolean) => {
        setUserGuard(isGuard);
    };

    const setIsAdminRole = (isAdmin: boolean) => {
        setIsAdmin(isAdmin);
    };

    const setDefaultFilters = (filters: QplusFieldFilter[]) => {
        setFilters(filters);
    };

    const setHiddenFields = (fields: string[]) => {
        setFields(fields);
    };

    const setIsHeaderVisible = (isVisible: boolean) => {
        setHeaderVisible(isVisible);
    };

    const setSelectionCount = (count: number) => {
        setCountSelection(count);
    };

    const setShowSessionExpirationDialog = useCallback((show: boolean) => {
        setSessionExpirationDialog(show);
    }, []);

    const onHandleForbiddenCallback = useCallback(
        (_error: string, _message: string, _statusCode: number) => {
            setShowForbiddenDialog(true);
        },
        [setShowForbiddenDialog]
    );

    useMount(async () => {
        try {
            // Use cached language if available (HMR scenario)
            if (cachedBrowserLanguage) {
                setBrowserLanguage(cachedBrowserLanguage);
                setIsI18nReady(true);
                return;
            }

            // Get the browser language with fallback to English
            const [language, region] = navigator.language.split("-");
            const lowercaseRegion = region ? region.toLowerCase() : "";
            const languageCode = lowercaseRegion || language || "en";
            const mappedLanguageCode = mapLanguageCode(languageCode);
            console.log("Browser Language", mappedLanguageCode);
            await initI18n(languageResources.app, mappedLanguageCode);
            // Cache and set both states together to minimize re-renders
            cachedBrowserLanguage = mappedLanguageCode;
            setBrowserLanguage(mappedLanguageCode);
            setIsI18nReady(true);
        } catch (error) {
            console.error("Qplus Error", error);
            // Still mark as ready to allow error handling
            setIsI18nReady(true);
        }
    });

    useEffect(() => {
        if (qApps && qApps.length > 0) {
            const updatedApps = qApps.map(app => ({
                ...app,
                onQlikAppClosedCallback: (appId, type, event) => {
                    DEV && console.log("DEBUG Closed", appId, type, event);
                    setShowSessionExpirationDialog(true);
                },
                onQlikAppErrorCallback: (appId, type, event) => {
                    DEV && console.error("DEBUG Error", appId, type, event);
                }
            }));

            setModifiedApps(updatedApps);
        }
    }, [qApps, setShowSessionExpirationDialog]);

    const onQlikAccessDeniedCallback = useCallback(() => {
        setShowAccessDeniedDialog(true);
    }, []);

    const onQlikClosedCallback = useCallback(() => {
        setSessionExpirationDialog(true);
    }, []);

    const handleCloseErrorClick = () => {
        window.location.href = window.env.VITE_LOGIN_URL;
    };

    const logoutUser = () => {
        localStorage.clear();
    };

    return (
        <>
            {!isReady && <SplashScreen />}
            {isReady && !hasWrongConfiguration && (
                    <div>
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
                                    handleOnForbiddenCallback={onHandleForbiddenCallback}
                                    tenantId={window.env.VITE_TENANT_ID}
                                    customerId={window.env.VITE_CUSTOMER_ID}
                                    mashupAppId={window.env.VITE_MASHUP_APP_ID}
                                    qlikSettings={getQlikConfig(
                                        hostname,
                                        vp,
                                        window.env.VITE_DEFAULT_THEME,
                                        onQlikAccessDeniedCallback,
                                        onQlikClosedCallback,
                                        modifiedApps
                                    )}
                                    config={{
                                        apiUrl: processUrl(window.env.VITE_QPLUS_APP_API, IS_DEV),
                                        gateway: window.env.VITE_INSIGHT_SOCKET_PATH
                                    }}
                                    locale={browserLanguage.toUpperCase()}
                                    isWithNotifications
                                    showNotificationsToastMsg
                                    handleOnAuthInsightErrorCallback={() => {
                                        setShowUnauthorizeddDialog(true);
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

            {isI18nReady && (
                <ErrorDialog
                    title={translations.errorTitle}
                    primaryText={
                        showUnauthorizedDialog
                            ? translations.unauthorized
                            : showAccessDeniedDialog
                                ? translations.accessDenied
                                : showSessionExpirationDialog
                                    ? translations.sessionExpired
                                    : showForbiddenDialog
                                        ? translations.forbidden
                                        : translations.invalidParameters
                    }
                    secondaryText={
                        showSessionExpirationDialog
                            ? translations.reloginMessage
                            : translations.contactAdminMessage
                    }
                    buttonText={translations.closeButtonText}
                    closeTooltipText={translations.closeTooltipText}
                    isOpen={
                        showUnauthorizedDialog ||
                        showAccessDeniedDialog ||
                        showSessionExpirationDialog ||
                        showForbiddenDialog ||
                        hasWrongConfiguration
                    }
                    handleCloseCallback={handleCloseErrorClick}
                />
            )}
        </>
    );
};

export default AppProvider;
