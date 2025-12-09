import React, { Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { Box, CircularProgress } from "@mui/material";
import {
    useQplusAuthContext,
    useQplusPreferencesContext,
    useQplusSelectionContext,
    userQplusPreferenceService
} from "@databridge/qplus";

import { useAppContext } from "app/context/AppContext";
import Layout from "app/layout/Layout";
import { DASHBOARD_URL_PATH } from "app/layout/constants/constants";
import { QPLUS_USER_ROLES } from "app/shared/constants/constants";
import { clearUrlParams, clearUrlParamsInHashRouter } from "app/utils/appUtils";
import { setSessionStorageItem } from "app/utils/storageUtils";
import { POCWEB_LAST_VISITED_PAGE } from "app/config/appConfig";

const ComplianceDashboard = React.lazy(() => import("./compliance/ComplianceDashboard"));
const AuditDashboard = React.lazy(() => import("./audit/AuditDashboard"));
const ReportingDashboard = React.lazy(() => import("./reporting/ReportingDashboard"));
const PinwallDashboard = React.lazy(() => import("./pinwall/PinwallDashboard"));
const AdminDashboard = React.lazy(() => import("./admin/AdminDashboard"));
const LoaderPage = React.lazy(() => import("./loader/LoaderPage"));

const RouteApp = React.memo(() => {
    const { qSelectionMap } = useQplusSelectionContext();
    const { isAppLoading, pages, defaultPage, isHeaderVisible } = useAppContext();
    const { userPreferences, setUserPreferences, refreshPreferences } =
        useQplusPreferencesContext();
    const { appUser } = useQplusAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isHashRouter = window.env.VITE_ROUTER === "Hash";
        if (!isHashRouter) {
            clearUrlParams(navigate, defaultPage);
        } else {
            clearUrlParamsInHashRouter(defaultPage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultPage]);

    useEffect(() => {
        if (location?.pathname && !location.pathname?.includes("loader")) {
            setSessionStorageItem(POCWEB_LAST_VISITED_PAGE, location.pathname);
        }
    }, [location?.pathname]);

    useEffect(() => {
        (async () => {
            try {
                if (!isAppLoading) {
                    const name = /[^/]*$/.exec(location.pathname)[0];
                    if (name === "compliance" || name === "audit") {
                        const qSelection = qSelectionMap.get(pages.get(name));

                        if (qSelection?.qDockedFields) {
                            const newPreferences =
                                await userQplusPreferenceService.updatePreferences({
                                    additionalPreferences: {
                                        ...userPreferences.additionalPreferences,
                                        filters: {
                                            ...userPreferences?.additionalPreferences?.filters,
                                            [name]: qSelection?.qDockedFields
                                        }
                                    }
                                });
                            setUserPreferences(newPreferences);
                            refreshPreferences();
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        })().catch(error => {
            console.error(error);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qSelectionMap]);

    if (isAppLoading) return null;

    return (
        <Layout>
            <Suspense
                fallback={
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="800px"
                        sx={{ marginTop: isHeaderVisible ? "225px" : "72px" }}>
                        <Skeleton />
                        <CircularProgress color="secondary" size={80} />
                    </Box>
                }>
                <Routes>
                    <Route
                        path="/*"
                        element={<Navigate to={`${DASHBOARD_URL_PATH}/${defaultPage}`} />}
                    />
                    <Route path={`${DASHBOARD_URL_PATH}/loader/*`} element={<LoaderPage />} />
                    {pages.get("compliance") && (
                        <Route
                            path={`${DASHBOARD_URL_PATH}/compliance/*`}
                            element={<ComplianceDashboard />}
                        />
                    )}
                    {pages.get("reporting") && (
                        <>
                            <Route
                                path={`${DASHBOARD_URL_PATH}/reporting/*`}
                                element={<ReportingDashboard />}
                            />
                            <Route
                                path={`${DASHBOARD_URL_PATH}/reporting/pinwall/*`}
                                element={<PinwallDashboard />}
                            />
                        </>
                    )}
                    {pages.get("audit") && (
                        <Route
                            path={`${DASHBOARD_URL_PATH}/audit/*`}
                            element={<AuditDashboard />}
                        />
                    )}
                    <Route
                        path={`${DASHBOARD_URL_PATH}/administration/*`}
                        element={
                            appUser?.roles?.includes(QPLUS_USER_ROLES.ADMIN) &&
                            pages.get("reporting") ? (
                                <AdminDashboard />
                            ) : (
                                <Navigate to={`${DASHBOARD_URL_PATH}/${defaultPage}`} />
                            )
                        }
                    />
                </Routes>
            </Suspense>
        </Layout>
    );
});

export default RouteApp;
