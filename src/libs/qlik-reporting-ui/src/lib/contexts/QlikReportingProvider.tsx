import React, { ReactNode, useCallback, useEffect, useState } from 'react'

import { commentService } from '@libs/collaboration-services'
import { BasicUserInfo, Report } from '@libs/common-models'
import { useAuthContext } from '@libs/common-providers'
import { KEYS, storage } from '@libs/common-utils'
import { useParseFilters } from '@libs/core-hooks'
import {
    ReportDataset,
    ReportDimensions,
    ReportExport,
    ReportFilters,
    ReportMeasures,
    ReportPatchPayload,
    ReportPayload,
    ReportVisualizations
} from '@libs/core-models'
import { datasetService, reportService } from '@libs/core-services'
import { useQlikAppContext, useQlikSelectionContext } from '@libs/qlik-providers'

import {
    REPORTING_INITIAL_VIZ_TYPE,
    URL_QUERY_PARAM_VALUE_TYPE_REPORTS
} from '../constants/constants'
import { useParseDimensions, useParseMeasures, useReplaceQueryParams } from '../hooks'
import { checkIfReportIsReadOnly } from '../utils'
import { QlikReportingContext, QlikReportingContextType } from './QlikReportingContext'

interface Props {
    value?: QlikReportingContextType
    children: ReactNode
}

const QlikReportingProvider = ({ value, children }: Props) => {
    const [reportAuthor, setAuthor] = useState<string | null>(null)
    const [reportTitle, setTitle] = useState<string | null>(null)
    const [reportDescription, setDescription] = useState<string | null>(null)
    const [reportVisualization, setVisualization] = useState<any | null>(null)
    const [reportVizColumns, setColumns] = useState<any[] | null>([])
    const [reportVizOptions, setOption] = useState<any | null>({})
    const [reportDataset, setDataset] = useState<ReportDataset | null>(null)
    const [reportSelectedDimensions, setSelectedDimensions] = useState<ReportDimensions[] | null>(
        []
    )
    const [reportSelectedMeasures, setSelectedMeasures] = useState<ReportMeasures[] | null>([])
    const [reportSelectDimensions, setSelectDimensions] = useState<ReportDimensions[] | null>([])
    const [reportSelectMeasures, setSelectMeasures] = useState<ReportMeasures[] | null>([])
    const [reportSelectDatasets, setSelectVisualizations] = useState<ReportDataset[] | null>([])
    const [reportIsLoading, setIsLoading] = useState<boolean | null>(null)
    const [reportVizType, setVizType] = useState<string | null>(null)
    const [reportVisualizations, setVisualizations] = useState<ReportVisualizations[]>([])
    const [reportFilters, setFiltersReport] = useState<ReportFilters[]>([])
    const [reportFilterList, setFilterList] = useState<ReportFilters[]>([])
    const [defaultFilters, setFilters] = useState<ReportFilters[]>([])
    const [reportDefaultFilters, setDefaultFilters] = useState<ReportFilters[]>([])
    const [reportId, setRepId] = useState<number>(0)
    const [reportCommentCount] = useState<number>(0)
    const [reportUserCount, setReportCount] = useState<number>(0)
    const [reportTemplateCount, setReportTemplateCount] = useState<number>(0)
    const [reportSharedCount, setReportSharedCount] = useState<number>(0)
    const [reportUserMentionSuggestions, setReportUserMentionSuggestions] = useState<
        BasicUserInfo[]
    >([])
    const [isReportEditable, setIsEditable] = useState<boolean | null>(false)
    const [isReportPersonal, setIsReportPersonal] = useState<boolean | null>(false)
    const [isReportSystem, setIsSystem] = useState<boolean | null>(true)
    const [isReportPinwallable, setIsPinwallable] = useState<boolean | null>(false)
    const [isReportWithBookmark, setIsWithBookmark] = useState<boolean | null>(false)
    const [isReportAdmin, setIsReportAdmin] = React.useState<boolean>(false)
    const [isReportReadOnly, setIsReportReadOnly] = React.useState<boolean>(false)

    const [userReports, setUserReports] = useState<Report[]>([])
    const [templateReports, setTemplateReports] = useState<Report[]>([])
    const [sharedReports, setSharedReports] = useState<Report[]>([])
    const { appUser } = useAuthContext()
    const { setReplaceQueryParams } = useReplaceQueryParams()
    const { setDockedFields } = useQlikSelectionContext()
    const { qAppMap } = useQlikAppContext()
    const { setParseDimensions } = useParseDimensions()
    const { setParseMeasures } = useParseMeasures()
    const { setParseFilters } = useParseFilters()

    useEffect(() => {
        void (async () => {
            try {
                const isAdminOn = storage.load(KEYS.QPLUS_ROLE_IS_ADMIN)
                setIsReportAdmin(isAdminOn)

                if (reportId > 0) {
                    const report = await getReportById(reportId)
                    const readOnly = checkIfReportIsReadOnly(report, appUser, isAdminOn)
                    setIsReportReadOnly(readOnly)
                    setIsReportPersonal(report.appUserId === appUser.appUserId)
                    setIsReportSystem(report.isSystem)
                    setAuthor(report?.user?.name)
                } else {
                    setIsReportPersonal(false)
                    setIsReportSystem(false)
                    setAuthor(appUser?.name || '')
                }
            } catch (error) {
                console.log('Qplus Error', error)
                throw new Error(error)
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportId, appUser])

    useEffect(() => {
        setFilters(reportDefaultFilters)
    }, [reportDefaultFilters])

    useEffect(() => {
        void (async () => {
            try {
                refreshReportUsers()
            } catch (error) {
                console.log('Qplus Error', error)
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportId])

    const refreshReportUsers = useCallback(async () => {
        try {
            if (appUser && reportId > 0 && !isReportSystem) {
                const filterMentionUsers = await reportService.getReportUsers(reportId, false)
                const userList: BasicUserInfo[] = []
                for (const mentionUser of filterMentionUsers) {
                    userList.push({
                        appUserId: mentionUser.appUserId,
                        name: mentionUser.name,
                        email: mentionUser?.email
                    })
                }
                setReportUserMentionSuggestions(userList)
            } else {
                setReportUserMentionSuggestions([])
            }
        } catch (error) {
            console.log('Qplus Error', error)
            setSharedReports([])
            setReportSharedCount(0)
        }
    }, [reportId, isReportSystem, appUser])

    const getReportById = useCallback(async (id: number): Promise<Report> => {
        try {
            return await reportService.getReport(id)
        } catch (error) {
            clearReport()
            console.log('Qplus Error', error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getReportCommentCount = useCallback(async (id: number): Promise<number> => {
        try {
            const result = await commentService.getReportCommentCount(id)
            return result?.count || 0
        } catch (error) {
            console.log('Qplus Error', error)
            return 0
        }
    }, [])

    const importReport = useCallback(async (code: string): Promise<Report> => {
        try {
            return await reportService.importReport(code)
        } catch (error) {
            console.log('Qplus Error', error)
            throw new Error(error)
        }
    }, [])

    const exportReport = useCallback(async (report: ReportExport): Promise<string> => {
        try {
            return await reportService.exportReport(report)
        } catch (error) {
            console.log('Qplus Error', error)
            throw new Error(error)
        }
    }, [])

    const createReport = useCallback(async (payload: ReportPayload) => {
        try {
            return await reportService.createReport(payload)
        } catch (error) {
            console.log('Qplus Error', error)
            throw new Error(error)
        }
    }, [])

    const cloneReport = useCallback(
        async (id: number, dimensions: ReportDimensions[], measures: ReportMeasures[]) => {
            try {
                copyReport(id, dimensions, measures)
            } catch (error) {
                console.log('Qplus Error', error)
                throw new Error(error)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const deleteReport = useCallback(async (id: number) => {
        try {
            await reportService.deleteReport(id)
        } catch (error) {
            console.log('Qplus Error', error)
            throw new Error(error)
        }
    }, [])

    const patchReport = useCallback(async (id: number, payload: ReportPatchPayload) => {
        try {
            return await reportService.patchReport(id, payload)
        } catch (error) {
            console.log('Qplus Error', error)
            throw new Error(error)
        }
    }, [])

    const getReportUsers = useCallback(async (id: number, includeMe = false) => {
        try {
            return await reportService.getReportUsers(id, includeMe)
        } catch (error) {
            console.log('Qplus Error', error)
            return []
        }
    }, [])

    const unShareReport = useCallback(async (id: number, appUserIds: any) => {
        try {
            await reportService.unshareReport(id, appUserIds)
        } catch (error) {
            console.log('Qplus Error', error)
            throw new Error(error)
        }
    }, [])

    const shareReport = useCallback(async (id: number, appUserIds: any) => {
        try {
            await reportService.shareReport(id, appUserIds)
        } catch (error) {
            console.log('Qplus Error', error)
            throw new Error(error)
        }
    }, [])

    const loadUserReports = useCallback(
        async (isAdmin = false, hasWriteAccess = false, rowsPerPage = 100) => {
            try {
                let reports = []
                let filterConditions = `filter[appUserId][eq]=${appUser.appUserId}&`

                // Adjust the filter based on user admin status and write access
                filterConditions += isAdmin
                    ? 'filter[isSystem][eq]=true&'
                    : 'filter[isSystem][eq]=false&'

                // Add additional condition if the user has write access
                if (hasWriteAccess) {
                    filterConditions += 'filter[templateId][not]=null&'
                }

                // Remove the last '&' from filterConditions
                filterConditions = filterConditions.slice(0, -1)

                const { data, total } = await reportService.getAllReports(
                    rowsPerPage,
                    `?${filterConditions}`,
                    false
                )
                reports = reports.concat(data)
                reportService.sortArray(reports)

                setUserReports(reports)
                setReportCount(total || 0)

                return reports
            } catch (error) {
                console.error('Insight Error', error)
                setUserReports([])
                setReportCount(0)
                throw new Error(error)
            }
        },
        [appUser, setUserReports, setReportCount]
    )

    const loadTemplateReports = useCallback(
        async (
            isAdmin = false,
            hasWriteAccess = false,
            rowsPerPage = 100,
            shouldIterate = true
        ) => {
            try {
                let reports = []
                let query = '?filter[isSystem][eq]=true'

                if (isAdmin) {
                    if (hasWriteAccess) {
                        // Admin with write access: include templates with non-null templateId
                        query = `?filter[appUserId][not]=${appUser.appUserId}&filter[isSystem][eq]=true&filter[templateId][not]=null`
                    } else {
                        console.log('No write access')
                        // Admin without write access: do not include based on appUserId
                        query = `?filter[appUserId][not]=${appUser.appUserId}&filter[isSystem][eq]=true`
                    }
                }

                console.log('Template', rowsPerPage)
                const { data, total } = await reportService.getAllReports(
                    rowsPerPage,
                    query,
                    false,
                    shouldIterate
                )
                reports = reports.concat(data)
                reportService.sortArray(reports)

                setTemplateReports(reports)
                setReportTemplateCount(total || 0)

                return reports
            } catch (error) {
                console.error('Insight Error', error) // More appropriate error logging
                setTemplateReports([])
                setReportTemplateCount(0)
                throw new Error(error)
            }
        },
        [appUser.appUserId, setTemplateReports, setReportTemplateCount]
    )

    const loadSharedReports = useCallback(
        async (rowsPerPage = 100, shouldIterate = true) => {
            try {
                if (appUser?.appUserId) {
                    const { data, total } = await reportService.getSharedWithMeReports(
                        appUser.appUserId,
                        rowsPerPage,
                        shouldIterate
                    )
                    setSharedReports(data)
                    setReportSharedCount(total || 0)
                    return data
                }

                return []
            } catch (error) {
                console.log('Qplus Error', error)
                setSharedReports([])
                setReportSharedCount(0)
            }
        },
        [appUser]
    )

    const loadPaginatedReports = useCallback(
        async (perPage = 100, page: number, query: string) => {
            try {
                const reports = await reportService.getParamReports(perPage, page, query)
                const filteredReports = reports.data.filter(
                    r => r.isSystem || r.appUserId === appUser.appUserId
                )
                setUserReports(filteredReports)
                setReportCount(filteredReports.length)
                return { data: filteredReports, pagination: reports.pagination }
            } catch (error) {
                console.log('Qplus Error', error)
                setUserReports([])
                setReportCount(0)
                throw new Error(error)
            }
        },
        [appUser]
    )

    const getDatasets = useCallback(async (): Promise<ReportDataset[]> => {
        try {
            return (await datasetService.getAllDatasets()) as ReportDataset[]
        } catch (error) {
            throw new Error(error)
        }
    }, [])

    const getDatasetById = useCallback(async (id: number): Promise<ReportDataset> => {
        try {
            return (await datasetService.getDataset(id)) as ReportDataset
        } catch (error) {
            throw new Error(error)
        }
    }, [])

    const createDataset = useCallback(async (newDataset: any): Promise<ReportDataset> => {
        try {
            return (await datasetService.createDataset(newDataset)) as ReportDataset
        } catch (error) {
            console.log('Qplus Error', error)
            throw new Error(error)
        }
    }, [])

    const updateDataset = useCallback(
        async (datasetId: number, newDataset: any): Promise<ReportDataset> => {
            try {
                return (await datasetService.updateDataset(datasetId, newDataset)) as ReportDataset
            } catch (error) {
                console.log('Qplus Error', error)
                throw new Error(error)
            }
        },
        []
    )

    const deleteDataset = useCallback(async (id: number, cascade = true): Promise<any> => {
        try {
            return (await datasetService.deleteDataset(id, cascade)) as any
        } catch (error) {
            console.log('Qplus Error', error)
            throw new Error(error?.data?.message)
        }
    }, [])

    const clearReport = useCallback(async () => {
        setReportTitle('')
        setReportDescription('')
        setReplaceQueryParams(0, URL_QUERY_PARAM_VALUE_TYPE_REPORTS)
        setReportSelectDimensions([])
        setReportSelectMeasures([])
        setReportSelectedDimensions([])
        setReportSelectedMeasures([])
        setReportVisualizations([])
        setDockedFields(defaultFilters)
        setReportFilters(defaultFilters)
        setReportFilterList([])
        setReportVizOptions({})
        setReportDataset(null)
        setReportId(0)
        setIsReportEditable(false)
        setReportVisualization(null)
        setIsReportPinwallable(true)
        setIsReportWithBookmark(false)
        setIsReportPersonal(true)
        setIsSystem(false)
        setIsReportReadOnly(false)
        setReportVizType(REPORTING_INITIAL_VIZ_TYPE)
        const qAppMapValues = Array.from(qAppMap.values())
        qAppMapValues?.map(v => v?.qApi?.clearAll())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultFilters, qAppMap])

    const copyReport = useCallback(
        async (id: number, dimensions: ReportDimensions[], measures: ReportMeasures[]) => {
            const report = await reportService.cloneReport(id)

            const lDimensions = setParseDimensions(report.content.dimensions, dimensions)
            const lMeasures = setParseMeasures(report.content.measures, measures)
            const lFilters = setParseFilters(report.content.filters, dimensions, defaultFilters)

            setReportTitle('')
            setReportDescription('')
            setReportSelectDimensions(dimensions)
            setReportSelectMeasures(measures)
            setReportSelectedDimensions(lDimensions)
            setReportSelectedMeasures(lMeasures)
            setReportVisualizations(report.dataset.visualizations)
            setDockedFields(lFilters)
            setReportFilters(lFilters)
            setReportVizOptions(report.content.options)
            setReportDataset(report.dataset)
            setReportId(0)
            setIsReportEditable(true)
            setIsReportPinwallable(report.isPinwallable)
            setIsReportWithBookmark(false)
            setIsReportPersonal(true)
            setIsSystem(false)
            setIsReportReadOnly(false)
            setReportVizType(report.visualizationType)
            setReplaceQueryParams(0, URL_QUERY_PARAM_VALUE_TYPE_REPORTS)
            const qAppMapValues = Array.from(qAppMap.values())
            qAppMapValues?.map(v => v?.qApi?.clearAll())
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [defaultFilters, qAppMap]
    )

    const eraseReport = useCallback(async () => {
        setReportSelectedDimensions([])
        setReportSelectedMeasures([])
        setDockedFields(defaultFilters)
        setReportFilters(defaultFilters)
        setReportFilterList([])
        setReportVizOptions({})
        setIsReportEditable(false)
        setIsReportReadOnly(false)
        setReportVisualization(null)
        setIsReportPinwallable(true)
        setIsReportWithBookmark(false)
        setReportVizType(null)
        setReportDataset(null)
        const qAppMapValues = Array.from(qAppMap.values())
        qAppMapValues?.map(v => v?.qApi?.clearAll())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultFilters, qAppMap])

    const setReportVisualization = useCallback((reportVisualization: any) => {
        setVisualization(reportVisualization)
    }, [])

    const setReportVizColumns = useCallback((qlikColumns: any[]) => {
        setColumns(qlikColumns)
    }, [])

    const setReportVizOptions = useCallback((option: any) => {
        setOption(option)
    }, [])

    const setReportDataset = useCallback((reportDataset: any) => {
        setDataset(reportDataset)
    }, [])

    const setReportIsLoading = useCallback((isLoading: boolean) => {
        setIsLoading(isLoading)
    }, [])

    const setReportVizType = useCallback((reportVizType: string) => {
        setVizType(reportVizType)
    }, [])

    const setReportSelectedDimensions = useCallback((dimensions: ReportDimensions[]) => {
        setSelectedDimensions(dimensions)
    }, [])

    const setReportSelectedMeasures = useCallback((measures: ReportMeasures[]) => {
        setSelectedMeasures(measures)
    }, [])

    const setReportSelectDimensions = useCallback((dimensions: ReportDimensions[]) => {
        setSelectDimensions(dimensions)
    }, [])

    const setReportSelectMeasures = useCallback((measures: ReportMeasures[]) => {
        setSelectMeasures(measures)
    }, [])

    const setReportSelectDatasets = useCallback((visualizations: ReportDataset[]) => {
        setSelectVisualizations(visualizations)
    }, [])

    const setReportFilters = useCallback((filters: ReportFilters[]) => {
        setFiltersReport(filters)
    }, [])

    const setReportDefaultFilters = useCallback((filters: ReportFilters[]) => {
        setDefaultFilters(filters)
    }, [])

    const setReportFilterList = useCallback((filterList: ReportFilters[]) => {
        setFilterList(filterList)
    }, [])

    const setReportId = useCallback((reportId: number) => {
        setRepId(reportId)
    }, [])

    const setIsReportEditable = useCallback((isEditing: boolean) => {
        setIsEditable(isEditing)
    }, [])

    const setIsReportSystem = useCallback((isSystem: boolean) => {
        setIsSystem(isSystem)
    }, [])

    const setReportTitle = useCallback((title: string) => {
        setTitle(title)
    }, [])

    const setReportDescription = useCallback((description: string) => {
        setDescription(description)
    }, [])

    const setIsReportPinwallable = useCallback((isPinwallable: boolean) => {
        setIsPinwallable(isPinwallable)
    }, [])

    const setIsReportWithBookmark = useCallback((isWithBookmark: boolean) => {
        setIsWithBookmark(isWithBookmark)
    }, [])

    const setReportVisualizations = useCallback((reportVisualizations: ReportVisualizations[]) => {
        setVisualizations(reportVisualizations)
    }, [])

    const providerValues: QlikReportingContextType = {
        reportAuthor,
        reportTitle,
        reportDescription,
        reportVisualization,
        reportVizColumns,
        reportVizOptions,
        reportDataset,
        reportIsLoading,
        reportVizType,
        reportSelectedDimensions,
        reportSelectedMeasures,
        reportSelectDimensions,
        reportSelectMeasures,
        reportSelectDatasets,
        reportFilters,
        reportVisualizations,
        reportFilterList,
        reportDefaultFilters,
        reportId,
        reportCommentCount,
        reportUserMentionSuggestions,
        isReportAdmin,
        isReportEditable,
        isReportPersonal,
        isReportSystem,
        isReportPinwallable,
        isReportWithBookmark,
        isReportReadOnly,
        userReports,
        templateReports,
        sharedReports,
        reportUserCount,
        reportTemplateCount,
        reportSharedCount,
        refreshReportUsers,
        setReportTitle,
        setReportDescription,
        setReportVisualization,
        setReportVisualizations,
        setReportVizColumns,
        setReportVizOptions,
        setReportDataset,
        setReportIsLoading,
        setReportVizType,
        setReportSelectedDimensions,
        setReportSelectedMeasures,
        setReportSelectDimensions,
        setReportSelectMeasures,
        setReportSelectDatasets,
        setReportFilters,
        setReportFilterList,
        setReportDefaultFilters,
        setReportId,
        setIsReportAdmin,
        setIsReportEditable,
        setIsReportSystem,
        setIsReportPinwallable,
        setIsReportWithBookmark,
        setIsReportReadOnly,
        loadTemplateReports,
        loadUserReports,
        loadPaginatedReports,
        loadSharedReports,
        clearReport,
        eraseReport,
        createReport,
        deleteReport,
        exportReport,
        getReportById,
        getReportUsers,
        importReport,
        patchReport,
        cloneReport,
        shareReport,
        unShareReport,
        getDatasets,
        getDatasetById,
        createDataset,
        updateDataset,
        deleteDataset,
        getReportCommentCount
    }

    return (
        <QlikReportingContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikReportingContext.Provider>
    )
}

export default QlikReportingProvider
