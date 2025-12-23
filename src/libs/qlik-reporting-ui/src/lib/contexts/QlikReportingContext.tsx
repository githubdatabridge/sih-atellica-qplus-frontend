import { useContext, createContext, Dispatch, SetStateAction } from 'react'

import { BasicUserInfo, Report } from '@libs/common-models'
import {
    ReportDataset,
    ReportMeasures,
    ReportDimensions,
    ReportVisualizations,
    ReportFilters,
    ReportPayload,
    SharedReportUsers,
    ReportPatchPayload,
    ReportExport
} from '@libs/core-models'

export type QlikReportingContextType = {
    reportTitle: string
    reportDescription: string
    reportCommentCount: number
    reportVisualization: any
    reportVisualizations: ReportVisualizations[]
    reportVizColumns: any[]
    reportVizOptions: any
    reportVizType: string
    reportIsLoading: boolean
    reportDataset: ReportDataset | null
    reportSelectedDimensions: ReportDimensions[]
    reportSelectedMeasures: ReportMeasures[]
    reportSelectDimensions: ReportDimensions[]
    reportSelectMeasures: ReportMeasures[]
    reportSelectDatasets: ReportDataset[]
    reportFilters: ReportFilters[]
    reportFilterList: ReportFilters[]
    reportDefaultFilters: ReportFilters[]
    reportId: number
    reportUserMentionSuggestions: BasicUserInfo[]
    reportUserCount: number
    reportTemplateCount: number
    reportSharedCount: number
    isReportAdmin: boolean
    isReportEditable: boolean
    isReportPersonal: boolean
    isReportSystem: boolean
    isReportPinwallable: boolean
    isReportWithBookmark: boolean
    isReportReadOnly: boolean
    userReports: Report[]
    templateReports: Report[]
    sharedReports: Report[]
    reportAuthor: string
    setReportTitle: Dispatch<SetStateAction<string>> | undefined
    setReportDescription: Dispatch<SetStateAction<string>> | undefined
    setReportVizColumns: Dispatch<SetStateAction<any>> | undefined
    setReportVizOptions: Dispatch<SetStateAction<any>> | undefined
    setReportVisualization: Dispatch<SetStateAction<any>> | undefined
    setReportVizType: Dispatch<SetStateAction<string>> | undefined
    setReportIsLoading: Dispatch<SetStateAction<boolean>> | undefined
    setReportDataset: Dispatch<SetStateAction<ReportDataset>> | undefined
    setReportSelectedDimensions: Dispatch<SetStateAction<ReportDimensions[]>> | undefined
    setReportSelectedMeasures: Dispatch<SetStateAction<ReportMeasures[]>> | undefined
    setReportSelectDimensions: Dispatch<SetStateAction<ReportDimensions[]>> | undefined
    setReportSelectMeasures: Dispatch<SetStateAction<ReportMeasures[]>> | undefined
    setReportSelectDatasets: Dispatch<SetStateAction<ReportDataset[]>> | undefined
    setReportFilters: Dispatch<SetStateAction<any>> | undefined
    setReportVisualizations: Dispatch<SetStateAction<ReportVisualizations[]>> | undefined
    setReportId: Dispatch<SetStateAction<number>> | undefined
    setIsReportAdmin: Dispatch<SetStateAction<boolean>> | undefined
    setIsReportEditable: Dispatch<SetStateAction<boolean>> | undefined
    setReportFilterList: Dispatch<SetStateAction<any>> | undefined
    setReportDefaultFilters: Dispatch<SetStateAction<any>> | undefined
    setIsReportSystem: Dispatch<SetStateAction<boolean>> | undefined
    setIsReportPinwallable: Dispatch<SetStateAction<boolean>> | undefined
    setIsReportWithBookmark: Dispatch<SetStateAction<boolean>> | undefined
    setIsReportReadOnly: Dispatch<SetStateAction<boolean>> | undefined
    loadPaginatedReports?: (perPage?: number, page?: number, query?: string) => any
    loadUserReports: (
        isAdmin?: boolean,
        hasWriteAccess?: boolean,
        rowsPerPage?: number
    ) => Promise<Report[]>
    loadTemplateReports: (
        isAdmin?: boolean,
        hasWriteAccess?: boolean,
        rowsPerPage?: number,
        shouldIterate?: boolean
    ) => Promise<Report[]>
    loadSharedReports: (pageNumber?: number, shouldIterate?: boolean) => Promise<Report[]>
    getReportById: (id: number) => Promise<Report>
    importReport: (code: string) => Promise<Report>
    exportReport: (report: ReportExport) => Promise<string>
    clearReport: () => void
    eraseReport: () => void
    refreshReportUsers: () => void
    createReport: (payload: ReportPayload) => Promise<Report>
    cloneReport: (id: number, dimensions: ReportDimensions[], measures: ReportMeasures[]) => void
    deleteReport: (id: number) => void
    patchReport: (id: number, payload: ReportPatchPayload) => Promise<Report>
    getReportUsers: (id: number, includeMe?: boolean) => Promise<SharedReportUsers[]>
    unShareReport: (id: number, appUserIds: any) => void
    shareReport: (id: number, appUserIds: any) => void
    getDatasets: () => Promise<ReportDataset[]>
    getDatasetById: (id: number) => Promise<ReportDataset>
    createDataset: (newDataset: any) => Promise<ReportDataset>
    updateDataset: (datasetId: number, newDataset: any) => Promise<ReportDataset>
    deleteDataset: (id: number, deleteDataset?: boolean) => Promise<any>
    getReportCommentCount: (id: number) => Promise<number>
}

export const QlikReportingContext = createContext<QlikReportingContextType>({
    userReports: [],
    templateReports: [],
    sharedReports: [],
    reportFilters: [],
    reportFilterList: [],
    reportDefaultFilters: [],
    reportVisualization: null,
    reportVizColumns: [],
    reportVizOptions: {},
    reportVizType: '',
    reportDataset: null,
    reportIsLoading: false,
    reportSelectedDimensions: [],
    reportSelectedMeasures: [],
    reportSelectDimensions: [],
    reportSelectMeasures: [],
    reportSelectDatasets: [],
    reportVisualizations: [],
    reportId: 0,
    reportCommentCount: 0,
    reportUserMentionSuggestions: [],
    reportSharedCount: 0,
    reportUserCount: 0,
    reportTemplateCount: 0,
    reportTitle: '',
    reportDescription: '',
    reportAuthor: '',
    isReportAdmin: false,
    isReportEditable: false,
    isReportReadOnly: false,
    isReportPersonal: false,
    isReportSystem: true,
    isReportPinwallable: false,
    isReportWithBookmark: false,
    setReportVisualization: undefined,
    setReportVizColumns: undefined,
    setReportVizOptions: undefined,
    setReportDataset: undefined,
    setReportIsLoading: undefined,
    setReportVizType: undefined,
    setReportSelectedDimensions: undefined,
    setReportSelectedMeasures: undefined,
    setReportSelectDimensions: undefined,
    setReportSelectMeasures: undefined,
    setReportSelectDatasets: undefined,
    setReportFilters: undefined,
    setReportFilterList: undefined,
    setReportId: undefined,
    setIsReportEditable: undefined,
    setIsReportSystem: undefined,
    setIsReportPinwallable: undefined,
    setReportTitle: undefined,
    setReportDescription: undefined,
    setReportDefaultFilters: undefined,
    setIsReportWithBookmark: undefined,
    setReportVisualizations: undefined,
    setIsReportAdmin: undefined,
    setIsReportReadOnly: undefined,
    loadUserReports: (_isAdmin?: boolean, _hasWriteAccess?: boolean, _rowsPerPage?: number) => {
        throw new Error('loadReports() must be used within a QlikReportingProvider')
    },
    loadTemplateReports: (
        _isAdmin?: boolean,
        _hasWriteAccess?: boolean,
        _rowsPerPage?: number,
        _shouldIterate?: boolean
    ) => {
        throw new Error('loadTemplateReports() must be used within a QlikReportingProvider')
    },
    loadSharedReports: (_pageNumber?: number, _shouldIterate?: boolean) => {
        throw new Error('loadSharedReports() must be used within a QlikReportingProvider')
    },
    refreshReportUsers: () => {
        throw new Error('refreshReportUsers() must be used within a QlikReportingProvider')
    },
    clearReport: () => {
        throw new Error('clearReport() must be used within a QlikReportingProvider')
    },
    eraseReport: () => {
        throw new Error('eraseReport() must be used within a QlikReportingProvider')
    },
    getReportById: (_id: number) => {
        throw new Error('getReportById() must be used within a QlikReportingProvider')
    },
    importReport: (_code: string) => {
        throw new Error('importReport() must be used within a QlikReportingProvider')
    },
    exportReport: (_report: ReportExport) => {
        throw new Error('exportReport() must be used within a QlikReportingProvider')
    },
    createReport: (_payload: ReportPayload) => {
        throw new Error('createReport() must be used within a QlikReportingProvider')
    },
    cloneReport: (_id: number, _dimensions: ReportDimensions[], _measures: ReportMeasures[]) => {
        throw new Error('cloneReport() must be used within a QlikReportingProvider')
    },
    deleteReport: (_id: number) => {
        throw new Error('deleteReport() must be used within a QlikReportingProvider')
    },
    patchReport: (_id: number, _payload: ReportPatchPayload) => {
        throw new Error('patchReport() must be used within a QlikReportingProvider')
    },
    getReportUsers: (_id: number, _includeMe: boolean | undefined) => {
        throw new Error('getReportUsers() must be used within a QlikReportingProvider')
    },
    unShareReport: (_id: number, _appUserIds: any) => {
        throw new Error('unShareReport() must be used within a QlikReportingProvider')
    },
    shareReport: (_id: number, _appUserIds: any) => {
        throw new Error('shareReport() must be used within a QlikReportingProvider')
    },
    getDatasets: () => {
        throw new Error('getDatasets() must be used within a QlikReportingProvider')
    },
    getDatasetById: (_id: number) => {
        throw new Error('getDatasetById() must be used within a QlikReportingProvider')
    },
    createDataset: () => {
        throw new Error('createDataset() must be used within a QlikReportingProvider')
    },
    updateDataset: () => {
        throw new Error('updateDataset() must be used within a QlikReportingProvider')
    },
    deleteDataset: () => {
        throw new Error('deleteDataset() must be used within a QlikReportingProvider')
    },
    getReportCommentCount: (_id: number) => {
        throw new Error('getReportCommentCount() must be used within a QlikReportingProvider')
    }
})

export const useQlikReportingContext = () => useContext(QlikReportingContext)
