// @ts-nocheck
import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'
import { Box, CircularProgress } from '@mui/material'
import {
    useQplusAuthContext,
    useQplusI18nContext,
    useQplusPreferencesContext,
    useQplusSelectionContext,
    userQplusPreferenceService
} from '@databridge/qplus'

import { useAppContext } from 'app/context/AppContext'
import Layout from 'app/layout/Layout'
import { dashboardUrl } from 'app/layout/constants/constants'

const ComplianceDashboard = React.lazy(() => import('./compliance/ComplianceDashboard'))
const AuditDashboard = React.lazy(() => import('./audit/AuditDashboard'))
const ReportingDashboard = React.lazy(() => import('./reporting/ReportingDashboard'))
const PinwallDashboard = React.lazy(() => import('./pinwall/PinwallDashboard'))
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard'))

const DashboardPage = React.memo(() => {
    const { labelsIsLoading } = useQplusI18nContext()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { qSelectionMap } = useQplusSelectionContext()
    const { setIsAppLoading, isAppLoading, pages, defaultPage, isHeaderVisible } = useAppContext()
    const { userPreferences, setUserPreferences, refreshPreferences } = useQplusPreferencesContext()
    const { appUser } = useQplusAuthContext()
    const location = useLocation()

    useEffect(() => {
        setIsLoading(labelsIsLoading)
        setIsAppLoading(labelsIsLoading)
    }, [labelsIsLoading, setIsAppLoading])

    useEffect(() => {
        void (async () => {
            try {
                if (!isLoading && !isAppLoading) {
                    const name = /[^/]*$/.exec(location.pathname)[0]
                    if (name === 'compliance' || name === 'audit') {
                        const qSelection = qSelectionMap.get(pages.get(name))

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
                                })
                            setUserPreferences(newPreferences)
                            refreshPreferences()
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qSelectionMap])

    if (isLoading || isAppLoading) return null

    return (
        <Layout>
            <Suspense
                fallback={
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="800px"
                        sx={{ marginTop: isHeaderVisible ? '225px' : '72px' }}>
                        <Skeleton />
                        <CircularProgress color="secondary" size={80} />
                    </Box>
                }>
                <Routes>
                    <Route path="/*" element={<Navigate to={`${dashboardUrl}/${defaultPage}`} />} />
                    {pages.get('compliance') && (
                        <Route
                            path={`${dashboardUrl}/compliance/*`}
                            element={<ComplianceDashboard />}
                        />
                    )}
                    {pages.get('reporting') && (
                        <>
                            <Route
                                path={`${dashboardUrl}/reporting/*`}
                                element={<ReportingDashboard />}
                            />
                            <Route
                                path={`${dashboardUrl}/reporting/pinwall/*`}
                                element={<PinwallDashboard />}
                            />
                        </>
                    )}
                    {pages.get('audit') && (
                        <Route path={`${dashboardUrl}/audit/*`} element={<AuditDashboard />} />
                    )}

                    <Route
                        path={`${dashboardUrl}/administration/*`}
                        element={
                            appUser?.roles?.includes('admin') && pages.get('reporting') ? (
                                <AdminDashboard />
                            ) : (
                                <Navigate to={`${dashboardUrl}/${defaultPage}`} />
                            )
                        }
                    />
                </Routes>
            </Suspense>
        </Layout>
    )
})

export default DashboardPage
