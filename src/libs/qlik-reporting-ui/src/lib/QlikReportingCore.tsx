import React, { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useMediaQuery } from 'react-responsive'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMount } from 'react-use'

import { Box, CircularProgress, Divider, Typography, useTheme, Theme } from '@mui/material'
import { darken } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import { useQuery } from '@libs/common-hooks'
import { CircleLoader, IconTooltip } from '@libs/common-ui'
import { useParseFilters } from '@libs/core-hooks'
import {
    ReportDataset,
    ReportDimensions,
    ReportFilters,
    ReportMeasures,
    ReportVisualizations
} from '@libs/core-models'
import { QlikVisualizationApi } from '@libs/qlik-base-ui'
import { QMasterDimension, QMasterMeasure } from '@libs/qlik-models'
import {
    useQlikAppContext,
    useQlikBootstrapContext,
    useQlikLoaderContext,
    useQlikMasterItemContext,
    useQlikSelectionContext
} from '@libs/qlik-providers'

import { QlikReportingDialog, QlikReportingPreferencesDialog } from './components/dialog'
import {
    QlikReportingBurgerIconButton,
    QlikReportingInfoIconButton,
    QlikReportingLockerIconButton
} from './components/iconButton'
import { QlikReportingDimensionList, QlikReportingMeasureList } from './components/list'
import QlikReportingDatasetSelect from './components/select/QlikReportingDatasetSelect'
import QlikReportingEmpty from './components/stepper/QlikReportingStepper'
import QlikReportingVizTypeTabs from './components/tabs/QlikReportingVizTypeTabs'
import {
    REPORTING_BASE_CHARTS,
    REPORTING_INITIAL_VIZ_TYPE,
    REPORTING_VIEWS,
    URL_QUERY_PARAM_CRUD,
    URL_QUERY_PARAM_REPORT_ID,
    URL_QUERY_PARAM_VALUE_CRUD_CANCEL,
    URL_QUERY_PARAM_VALUE_CRUD_NEW,
    URL_QUERY_PARAM_VALUE_TYPE_REPORTS
} from './constants/constants'
import { useQlikReportingContext } from './contexts/QlikReportingContext'
import { useQlikReportingUiContext } from './contexts/QlikReportingUiContext'
import {
    useDatasetMapper,
    useParseDimensions,
    useParseMeasures,
    useReplaceQueryParams,
    useVizDefaultOptions
} from './hooks'
import QlikReportingFooter from './QlikReportingFooter'
import QlikReportingLoader from './QlikReportingLoader'

export type TQlikReportingCoreClasses = {
    root: string
    vizBar: string
    headerContainer: string
    actionsContainer: string
    burgerContainer: string
    titleContainer: string
    lockerContainer: string
    settingsContainer: string
    settingsButton: string
    settingsButtonDisabled: string
    buttonSave: string
    buttonCancel: string
    chartButtonActive: string
    chartButton: string
    footerButton: string
    menuButton: string
    refreshButton: string
    actionButtonActive: string
    actionButton: string
    stepperLabel: string
    stepperActive: string
    stepperCompleted: string
    stepperIconCompleted: string
    checkBoxItem: string
    checkBoxItemChecked: string
    checkBoxItemIntermediate: string
    controlToolbar: string
    toolbarIcon?: string
    toolbarIconButton?: string
    footNote?: string
}

export type TQlikReportingExportOptions = {
    types: Array<'xlsx' | 'pdf' | 'png'>
}

export interface IQlikReportingCoreProps {
    qlikAppId?: string
    width?: number
    height?: number
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    isToolbarWithDivider?: boolean
    defaultAppFilters?: ReportFilters[]
    views?: string[]
    showSignature?: boolean
    showWizardImage?: boolean
    showPinWallList?: boolean
    classNames?: Partial<TQlikReportingCoreClasses>
    exportOptions?: TQlikReportingExportOptions
    LoaderComponent?: JSX.Element
    children?: ReactNode
    handleDatasetCallback?: (qlikAppId: string) => void
}

const charts = REPORTING_BASE_CHARTS

const QlikReportingCore: FC<IQlikReportingCoreProps> = ({
    qlikAppId,
    height = 640,
    color = 'secondary',
    defaultAppFilters = [],
    views = REPORTING_VIEWS,
    isToolbarWithDivider = false,
    showSignature = true,
    showWizardImage = true,
    showPinWallList = true,
    classNames,
    exportOptions,
    LoaderComponent,
    handleDatasetCallback
}) => {
    const [qlikCurrAppId, setQlikCurrAppId] = useState<string>(qlikAppId)
    const [author, setAuthor] = React.useState<string>('')
    const [isSettingVisible, setIsSettingVisible] = React.useState<boolean>(false)
    const [title, setTitle] = React.useState<string>('')
    const [description, setDescription] = React.useState<string>('')
    const [dataset, setDataset] = useState<ReportDataset>(null)
    const [dimensions, setDimensions] = useState<ReportDimensions[]>([])
    const [measures, setMeasures] = useState<ReportMeasures[]>([])
    const [datasets, setDatasets] = useState<ReportDataset[]>([])
    const [options, setOptions] = useState<any>(null)
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isMasterItemLoading, setIsMasterItemLoading] = useState<boolean>(true)
    const { q } = useQlikBootstrapContext()
    const { qAppMap } = useQlikAppContext()
    const { setDockedFields, qSelectionMap } = useQlikSelectionContext()
    const navigate = useNavigate()
    const { isQlikMasterItemLoading } = useQlikLoaderContext()
    const { qMasterDimensionsMap, qMasterMeasuresMap } = useQlikMasterItemContext()
    const isTablet = useMediaQuery({ query: '(max-width: 1001px)' })
    const [searchParams, setSearchParams] = useSearchParams()

    const {
        reportId,
        reportTitle,
        reportAuthor,
        reportDataset,
        reportVizType,
        reportFilters,
        isReportReadOnly,
        reportIsLoading,
        reportVizOptions,
        reportVizColumns,
        reportSelectedDimensions,
        reportDescription,
        reportDefaultFilters,
        reportVisualizations,
        reportSelectedMeasures,
        getDatasets,
        getReportById,
        clearReport,
        setReportId,
        setReportFilters,
        setReportTitle,
        setReportDataset,
        setReportVizType,
        setIsReportSystem,
        setReportIsLoading,
        setReportFilterList,
        setReportVizColumns,
        setReportVizOptions,
        setIsReportEditable,
        setReportDescription,
        setReportVisualization,
        setIsReportPinwallable,
        setReportDefaultFilters,
        setReportSelectMeasures,
        setReportVisualizations,
        setIsReportWithBookmark,
        setReportSelectDimensions,
        setReportSelectedMeasures,
        setReportSelectedDimensions
    } = useQlikReportingContext()

    const { setParseDimensions } = useParseDimensions()
    const { setParseMeasures } = useParseMeasures()
    const { setReplaceQueryParams } = useReplaceQueryParams()
    const { setParseFilters } = useParseFilters()
    const { setDatasetMapper } = useDatasetMapper()
    const { setVizDefaultOptions } = useVizDefaultOptions()
    const { reportingTitleInfoNode } = useQlikReportingUiContext()

    const qReportId = useRef<number>(0)
    const queryParams = useQuery()

    const setReportIdFromQuery = (reportIdQuery: string, opQuery?: string) => {
        qReportId.current = Number(reportIdQuery)
        if (isQlikMasterItemLoading) return
        if (reportIdQuery) {
            switch (opQuery) {
                case URL_QUERY_PARAM_VALUE_CRUD_CANCEL:
                    if (checkVisualizationCondition()) {
                        applyReportOnQuery(qReportId.current)
                    } else {
                        clearReport()
                    }
                    replaceQueryParam(qReportId.current)
                    break
                case URL_QUERY_PARAM_VALUE_CRUD_NEW:
                    replaceQueryParam(qReportId.current)
                    break
                default:
                    if (checkVisualizationCondition()) {
                        const reportId = Number(reportIdQuery)
                        if (reportId) {
                            applyReportOnQuery(Number(reportIdQuery))
                        }
                    }
                    break
            }
            setIsReportEditable(false)
            setReportId(qReportId.current)
        } else if (reportId) {
            replaceQueryParam(reportId)
        }
    }

    const checkVisualizationCondition = () => {
        return datasets?.length > 0
    }

    const applyReportOnQuery = useCallback(
        async (rId: number) => {
            try {
                setReportIsLoading(true)
                setIsLoading(true)

                const report = await getReportById(rId)
                const dimensions = qMasterDimensionsMap.get(report.dataset.qlikAppId)
                const measures = qMasterMeasuresMap.get(report.dataset.qlikAppId)
                const lDimensions = setParseDimensions(report.content.dimensions, dimensions)
                const lMeasures = setParseMeasures(report.content.measures, measures)
                const lFilters = setParseFilters(
                    report.content.filters,
                    dimensions,
                    defaultAppFilters
                )
                const lDataset = report.dataset

                const lFilterList = setDatasetMapper(lDataset?.filters, dimensions)

                handleColumns(lDimensions, lMeasures, dimensions, measures, lDataset.qlikAppId)
                setQlikCurrAppId(report.dataset.qlikAppId)
                setReportDataset(lDataset)
                setReportVisualizations(lDataset?.visualizations || [])
                setReportSelectedDimensions(lDimensions)
                setReportSelectedMeasures(lMeasures)
                setReportVizType(report.visualizationType)
                setReportVizOptions(report.content.options)
                setReportFilters(lFilters)
                setReportFilterList(lFilterList)
                setDockedFields(lFilters)
                setReportTitle(report.title)
                setReportDescription(report.description)
                setIsReportPinwallable(report.isPinwallable)
                setIsReportWithBookmark(!!report.qlikState?.qsBookmarkId)

                qReportId.current = rId
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsLoading(false)
                setReportIsLoading(false)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [defaultAppFilters, qlikCurrAppId, qAppMap, setDockedFields]
    )

    const replaceQueryParam = useCallback(
        (rId: number) => {
            setReplaceQueryParams(rId, URL_QUERY_PARAM_VALUE_TYPE_REPORTS)
            qReportId.current = Number(rId)
            setReportId(rId)
        },
        [setReplaceQueryParams, setReportId]
    )

    useMount(async () => {
        if (!isQlikMasterItemLoading && reportFilters && reportFilters.length > 0) {
            setDockedFields(reportFilters)
        }

        const datasets = await getDatasets()
        setDatasets(datasets)
    })

    useEffect(() => {
        if (isQlikMasterItemLoading) {
            setIsLoading(true)
            setReportSelectedDimensions([])
            setReportSelectedMeasures([])
            setReportSelectDimensions([])
            setReportSelectMeasures([])
            setReportDataset(null)
            setReportFilters([])
            setReportVisualization(null)
            setReportVizOptions({})
        } else {
            setIsLoading(false)
            const queryReportId = queryParams.get(URL_QUERY_PARAM_REPORT_ID) || ''
            if (queryReportId) {
                const queryOp = queryParams.get(URL_QUERY_PARAM_CRUD) || ''
                setReportIdFromQuery(queryReportId, queryOp)
            }
        }
        setIsMasterItemLoading(isQlikMasterItemLoading)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isQlikMasterItemLoading])

    useEffect(() => {
        qReportId.current = reportId || 0
    }, [reportId])

    useEffect(() => {
        setAuthor(reportAuthor)
    }, [reportId, reportAuthor])

    useEffect(
        () => {
            const queryReportId = queryParams.get(URL_QUERY_PARAM_REPORT_ID) || ''
            const queryOp = queryParams.get(URL_QUERY_PARAM_CRUD) || ''

            if (
                (Number.isNaN(Number(queryReportId)) || Number(queryReportId) === 0) &&
                Number(queryReportId) === 0
            ) {
                if (dataset && queryOp !== URL_QUERY_PARAM_VALUE_CRUD_CANCEL) return
                if (queryOp === URL_QUERY_PARAM_VALUE_CRUD_NEW) return
                clearReport()
                return
            }
            if (datasets.length > 0) {
                setReportIdFromQuery(queryReportId, queryOp)
            }
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            navigate,
            // eslint-disable-next-line react-hooks/exhaustive-deps
            queryParams.get(URL_QUERY_PARAM_REPORT_ID),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            queryParams.get(URL_QUERY_PARAM_CRUD),
            datasets,
            reportId
        ]
    )

    useEffect(() => {
        setIsLoading(reportIsLoading)
    }, [reportIsLoading])

    useEffect(() => {
        setReportDefaultFilters(defaultAppFilters)
    }, [defaultAppFilters, setReportDefaultFilters])

    useEffect(() => {
        if (reportVisualizations) {
            setIsSettingVisible(reportVisualizations.length > 0)
        }
    }, [reportVisualizations])

    useEffect(() => {
        setDataset(reportDataset)
    }, [reportDataset])

    useEffect(() => {
        setTitle(reportTitle)
    }, [reportTitle])

    useEffect(() => {
        setDescription(reportDescription)
    }, [reportDescription])

    useEffect(() => {
        setOptions(reportVizOptions)
    }, [reportVizOptions])

    useEffect(() => {
        if (qlikCurrAppId) {
            setDimensions(qMasterDimensionsMap.get(qlikCurrAppId))
        }
    }, [qMasterDimensionsMap, qlikCurrAppId])

    useEffect(() => {
        if (qlikCurrAppId) {
            setMeasures(qMasterMeasuresMap.get(qlikCurrAppId))
        }
    }, [qMasterMeasuresMap, qlikCurrAppId])

    useEffect(() => {
        if (qlikCurrAppId) {
            const qSelection = qSelectionMap.get(qlikCurrAppId)
            setReportFilters(qSelection?.qDockedFields)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qSelectionMap, qlikCurrAppId, setReportFilters])

    useEffect(() => {
        if (isTablet) {
            setIsCollapsed(true)
        }
    }, [isTablet])

    const handleColumns = useCallback(
        (
            rDimensions: ReportDimensions[],
            rMeasures: ReportMeasures[],
            dims: QMasterDimension[],
            meas: QMasterMeasure[],
            qlikAppId: string
        ) => {
            if (qlikAppId) {
                const qApp = qAppMap.get(qlikAppId)
                const sDimensions: string[] = rDimensions.map(d => d.qLibraryId)
                const sMeasures: string[] = rMeasures.map(m => m.qLibraryId)
                const qDimensions = qApp.qMixinsApi._qPlusGetVizDimensions(sDimensions, dims)
                const qMeasures = qApp?.qMixinsApi._qPlusGetVizMeasures(sMeasures, meas)
                const columns = qApp?.qMixinsApi._qPlusGetVizColumns(qDimensions, qMeasures)
                setReportVizColumns(columns)
            }
        },
        [qAppMap, setReportVizColumns]
    )

    const onHandleRestoreVisualizationCallback = useCallback(
        async (
            vizType: string,
            dataset: ReportDataset,
            reportDimensions: ReportDimensions[],
            reportMeasures: ReportMeasures[],
            reportVisualizations: ReportVisualizations[],
            opts?: any,
            reportFilters?: ReportFilters[],
            qsBookmarkId?: string,
            reportId?: number,
            title?: string,
            description?: string,
            isSystem = false,
            isPinwallable = false,
            isImported = false
        ) => {
            try {
                setReportIsLoading(true)
                setIsLoading(true)
                const dimensions = qMasterDimensionsMap.get(dataset.qlikAppId)
                const measures = qMasterMeasuresMap.get(dataset.qlikAppId)
                handleColumns(
                    reportDimensions,
                    reportMeasures,
                    dimensions,
                    measures,
                    dataset.qlikAppId
                )
                const lDataset = dataset
                const lFilterList = setDatasetMapper(lDataset?.filters, dimensions)

                // Merge two arrays with unique values
                const a = new Set(reportFilters.map(x => `${x.qFieldName}${x.qAppId}`))
                const b = new Set(reportDefaultFilters.map(x => `${x.qFieldName}${x.qAppId}`))
                const diffFilterList = [
                    ...reportFilters.filter(x => !b.has(`${x.qFieldName}${x.qAppId}`)),
                    ...defaultAppFilters.filter(x => !a.has(`${x.qFieldName}${x.qAppId}`))
                ]

                qReportId.current = reportId
                setReportId(reportId)
                setReportDataset(dataset)
                setReportSelectedDimensions(reportDimensions)
                setReportSelectedMeasures(reportMeasures)
                setReportVisualizations(reportVisualizations)
                setReportVizType(vizType)
                setReportVizOptions(opts || {})
                setOptions(options || {})
                setReportFilters(diffFilterList)
                setReportFilterList(lFilterList)
                setDockedFields(diffFilterList)
                setReportTitle(title)
                setReportDescription(description)
                setIsReportSystem(isSystem)
                setIsReportPinwallable(isPinwallable)
                setIsReportWithBookmark(!!qsBookmarkId)
                setQlikCurrAppId(dataset.qlikAppId)
            } finally {
                setIsLoading(false)
                setReportIsLoading(false)
                setIsReportEditable(isImported)
            }
        },
        [
            options,
            setReportId,
            handleColumns,
            setReportTitle,
            setDockedFields,
            setDatasetMapper,
            setReportDataset,
            setReportVizType,
            setReportFilters,
            defaultAppFilters,
            setIsReportSystem,
            qMasterMeasuresMap,
            setReportIsLoading,
            setIsReportEditable,
            setReportVizOptions,
            setReportFilterList,
            qMasterDimensionsMap,
            reportDefaultFilters,
            setReportDescription,
            setIsReportPinwallable,
            setReportVisualizations,
            setIsReportWithBookmark,
            setReportSelectedMeasures,
            setReportSelectedDimensions
        ]
    )

    const renderControls = useCallback(() => {
        const isReportActive =
            reportDataset &&
            reportVizType &&
            (reportSelectedDimensions.length > 0 ||
                reportSelectedMeasures.length > 0 ||
                !REPORTING_BASE_CHARTS.includes(reportVizType))

        return (
            <Box
                className={`${classes.actionsContainer} ${classNames?.actionsContainer || ''}`}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    height: '100%'
                }}>
                <QlikReportingDialog
                    qlikAppId={qlikCurrAppId}
                    dimensions={dimensions}
                    measures={measures}
                    isNewReportActive={!!isReportActive}
                    isFilterActive={!!reportDataset}
                    isToolbarWithDivider={isToolbarWithDivider}
                    defaultAppFilters={defaultAppFilters}
                    color={color}
                    views={views}
                    showPinWallList={showPinWallList}
                    LoaderComponent={LoaderComponent}
                    classNames={classNames}
                    onRestoreVisualizationCallback={onHandleRestoreVisualizationCallback}
                    onRefreshReportCallback={onHandleRefreshReportCallback}
                />
            </Box>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        qlikCurrAppId,
        reportDataset,
        reportSelectedDimensions.length,
        reportSelectedMeasures.length,
        reportVizType,
        isToolbarWithDivider,
        defaultAppFilters,
        onHandleRestoreVisualizationCallback,
        color,
        views
    ])

    const handleDatasetChange = useCallback(
        async (
            dataset: ReportDataset,
            reportDimensions: ReportDimensions[],
            reportMeasures: ReportMeasures[],
            reportFilters: ReportFilters[],
            datasetVisualizatons: ReportVisualizations[],
            qlikAppId?: string
        ) => {
            setReportIsLoading(true)
            const qApp = qAppMap.get(qlikAppId)
            const qMasterDimensions = qMasterDimensionsMap.get(qlikAppId)
            const filters = setParseFilters(
                dataset?.filters?.map(f => f.qId) || [],
                qMasterDimensions,
                defaultAppFilters
            )
            setReportSelectedDimensions([])
            setReportSelectedMeasures([])
            setReportFilters(filters)
            setReportVizOptions({})
            setReportSelectDimensions(reportDimensions)
            setReportSelectMeasures(reportMeasures)
            setReportDataset(dataset || null)
            setReportFilterList(reportFilters)
            setReportVisualizations(datasetVisualizatons)
            setDockedFields(filters)
            setIsReportEditable(false)
            setQlikCurrAppId(qlikAppId)
            if (!dataset) setReportVisualization(null)
            const charts = datasetVisualizatons?.map(v => v.name) || []
            if (charts?.length > 0) {
                setReportVizType(
                    charts.includes(REPORTING_INITIAL_VIZ_TYPE)
                        ? REPORTING_INITIAL_VIZ_TYPE
                        : charts[0]
                )
            }
            qApp?.qApi?.clearAll()
            setReportIsLoading(false)
            if (handleDatasetCallback) handleDatasetCallback(qlikAppId)
        },
        [
            qAppMap,
            qMasterDimensionsMap,
            defaultAppFilters,
            setParseFilters,
            setReportSelectedDimensions,
            setReportSelectedMeasures,
            setReportFilters,
            setReportVizOptions,
            setReportSelectDimensions,
            setReportSelectMeasures,
            setReportDataset,
            setReportFilterList,
            setReportVisualizations,
            setDockedFields,
            setIsReportEditable,
            setReportVisualization,
            setReportIsLoading,
            setReportVizType,
            handleDatasetCallback
        ]
    )

    const handleDimensionToggle = useCallback(
        async (reportDimensions: ReportDimensions[]) => {
            setReportSelectedDimensions(reportDimensions)
            handleColumns(
                reportDimensions,
                reportSelectedMeasures,
                dimensions,
                measures,
                qlikCurrAppId
            )
            setIsReportEditable(reportDimensions.length > 0 || reportSelectedMeasures.length > 0)
        },
        [
            setReportSelectedDimensions,
            handleColumns,
            reportSelectedMeasures,
            dimensions,
            measures,
            qlikCurrAppId,
            setIsReportEditable
        ]
    )

    const handleMeasureToggle = useCallback(
        async (reportMeasures: ReportMeasures[]) => {
            setReportSelectedMeasures(reportMeasures)
            handleColumns(
                reportSelectedDimensions,
                reportMeasures,
                dimensions,
                measures,
                qlikCurrAppId
            )
            setIsReportEditable(reportMeasures.length > 0 || reportSelectedDimensions.length > 0)
        },
        [
            setReportSelectedMeasures,
            handleColumns,
            reportSelectedDimensions,
            dimensions,
            measures,
            qlikCurrAppId,
            setIsReportEditable
        ]
    )

    const handleVizToggle = useCallback(
        (type: string, isBaseChart: boolean) => {
            setReportVizType(type)
            if (
                (type && isBaseChart && reportSelectedDimensions.length > 0) ||
                reportSelectedMeasures.length > 0
            ) {
                setIsReportEditable(true)
            }

            if (!isBaseChart) {
                setReportSelectedDimensions([])
                setReportSelectedMeasures([])
                setIsReportEditable(true)
            }
        },
        [
            setReportVizType,
            reportSelectedDimensions.length,
            reportSelectedMeasures.length,
            setIsReportEditable,
            setReportSelectedDimensions,
            setReportSelectedMeasures
        ]
    )

    const handleOnCreateVisualization = useCallback((viz: any, elementId: string) => {
        setReportVisualization(viz)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleMenuOpenCallback = useCallback((status: boolean) => {
        setIsCollapsed(status)
        q?.resize()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onHandleRefreshReportCallback = useCallback(
        reportId => {
            applyReportOnQuery(reportId)
        },
        [applyReportOnQuery]
    )

    const renderReportViz = useMemo(() => {
        const op = searchParams.get('op')
        if (op) {
            searchParams.delete('op')
            setSearchParams(searchParams)
        }

        const defaultOptions = setVizDefaultOptions(reportVizType)
        const opts = { ...(reportVizOptions || {}), ...defaultOptions }
        if (reportVizType) {
            return (
                <Box
                    width="100%"
                    style={{
                        height: `calc(100% - ${showSignature ? '50px' : '0px'})`
                    }}>
                    <QlikVisualizationApi
                        key={new Date().valueOf()} // FIX WORKAROUND => When changing dimensions and measures w/o this hack it does not render correctly
                        visualizationOptions={{
                            qlikAppId: qlikCurrAppId,

                            vizOptions: {
                                vizType: !REPORTING_BASE_CHARTS.includes(reportVizType)
                                    ? opts?.qInfo?.qType
                                    : reportVizType,
                                columns: reportVizColumns,
                                options: opts
                            },
                            shouldRerender: false,
                            fullscreenOptions: {
                                title: reportTitle || ''
                            },
                            exportOptions: exportOptions,
                            isToolbarOnPanel: false,
                            enableFullscreen: true,
                            classNames: {
                                toolbarIcon: classNames?.toolbarIcon || '',
                                toolbarIconButton: classNames?.toolbarIconButton || '',
                                footNote: classNames?.footNote || ''
                            },
                            onCreateVisualizationCallback: handleOnCreateVisualization
                        }}
                    />
                </Box>
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        reportVizType,
        showSignature,
        height,
        reportVizOptions,
        reportVizColumns,
        qlikCurrAppId,
        charts
    ])

    const { classes } = useStyles()

    const isEnabled =
        reportVizType &&
        reportDataset &&
        (reportSelectedDimensions.length > 0 || reportSelectedMeasures.length > 0) &&
        !isReportReadOnly

    const isBaseChart = charts?.includes(reportVizType)

    const shouldRenderReport =
        reportVizType &&
        reportDataset &&
        (!!reportSelectedDimensions.length ||
            !!reportSelectedMeasures.length ||
            !REPORTING_BASE_CHARTS.includes(reportVizType)) &&
        !isLoading

    const shouldRenderSetting = reportDataset && isSettingVisible

    const theme = useTheme()

    return (
        <Box
            display="flex"
            flexDirection="row"
            width="100%"
            className={`${classes.root} ${classNames?.root}`}
            sx={{
                border: isToolbarWithDivider
                    ? `1px solid ${darken(theme.palette.divider, 0.1)}`
                    : null
            }}>
            <Box>
                <Box display="flex" flexDirection="row">
                    <Box
                        className={
                            isCollapsed
                                ? `${classes.headerDatasetCollapsed} ${classNames?.headerContainer}`
                                : `${classes.headerDataset} ${classNames?.headerContainer}`
                        }
                        display="flex"
                        width="100%">
                        {!isCollapsed && (
                            <Box flexGrow={1} mr={1}>
                                <QlikReportingDatasetSelect
                                    isEnabled={!isReportReadOnly}
                                    reportDimensions={dimensions}
                                    reportMeasures={measures}
                                    datasets={datasets}
                                    onDatasetChangeHandler={handleDatasetChange}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>

                <Box display="flex" flex={1} height={`${height - 15}px`}>
                    {!isCollapsed && (
                        <Box className={classes.selectorBox} width={'300px'}>
                            <Box
                                className={classes.containerSelector}
                                sx={{
                                    height: `${height / 2 - 40}px`,
                                    marginBottom: '10px',
                                    overflow: 'auto'
                                }}>
                                <QlikReportingDimensionList
                                    qlikAppId={qlikCurrAppId}
                                    color={color}
                                    handleToggleDimensionChange={handleDimensionToggle}
                                    isReportEnabled={!isReportReadOnly}
                                    isBaseChart={isBaseChart}
                                    height={height / 2 - 100}
                                    classNames={{
                                        checkBoxItem: classNames?.checkBoxItem || '',
                                        checkBoxItemChecked: classNames?.checkBoxItemChecked || '',
                                        checkBoxItemIntermediate:
                                            classNames?.checkBoxItemIntermediate || ''
                                    }}
                                />
                            </Box>
                            <Divider />

                            <Box
                                className={classes.containerSelector}
                                sx={{
                                    height: `${height / 2 - 40}px`,
                                    overflow: 'auto'
                                }}>
                                <QlikReportingMeasureList
                                    color={color}
                                    handleToggleMeasureChange={handleMeasureToggle}
                                    isReportEnabled={!isReportReadOnly}
                                    isBaseChart={isBaseChart}
                                    height={height / 2 - 100}
                                    classNames={{
                                        checkBoxItem: classNames?.checkBoxItem || '',
                                        checkBoxItemChecked: classNames?.checkBoxItemChecked || '',
                                        checkBoxItemIntermediate:
                                            classNames?.checkBoxItemIntermediate || ''
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            <Box display="flex" width="100%" flexDirection="column" flex={3}>
                <Box
                    display="flex"
                    width="100%"
                    flex={1}
                    className={`${classes.controlsToolbar} ${classNames?.controlToolbar || ''}`}
                    sx={{ minHeight: '50px' }}>
                    <Box
                        style={{ width: '60px' }}
                        className={`${classes.burgerContainer} ${
                            classNames?.burgerContainer || ''
                        }`}>
                        <QlikReportingBurgerIconButton
                            isOpen={!isReportReadOnly || qReportId.current === 0}
                            isCreated={qReportId.current > 0}
                            handleMenuOpenCallback={handleMenuOpenCallback}
                        />
                    </Box>
                    <Box
                        display="flex"
                        width="100%"
                        height="100%"
                        sx={{ justifyContent: 'center', alignItems: 'center' }}>
                        {title && !isTablet && (
                            <Box
                                className={`${classes.titleContainer} ${
                                    classNames?.titleContainer || ''
                                }`}>
                                <Typography className={classes.title}>{title}</Typography>
                            </Box>
                        )}

                        {description ? (
                            <Box
                                className={`${classes.titleContainer} ${
                                    classNames?.titleContainer || ''
                                }`}
                                height="100%"
                                style={{ minWidth: isTablet ? '60px' : null }}>
                                <IconTooltip
                                    title={isTablet ? `${title} -  ${description}` : description}>
                                    <Box
                                        className={classes.infoIcon}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        {reportingTitleInfoNode || (
                                            <QlikReportingInfoIconButton
                                                isOpen={
                                                    !isReportReadOnly || qReportId.current === 0
                                                }
                                                isCreated={qReportId.current > 0}
                                            />
                                        )}
                                    </Box>
                                </IconTooltip>
                            </Box>
                        ) : null}
                        {qReportId.current > 0 && (
                            <Box
                                width="60px"
                                height="100%"
                                className={
                                    !isReportReadOnly && qReportId.current === 0
                                        ? null
                                        : `${classes.lockerContainer} ${
                                              classNames?.lockerContainer || ''
                                          }`
                                }>
                                <QlikReportingLockerIconButton
                                    isOpen={!isReportReadOnly || qReportId.current === 0}
                                    isCreated={qReportId.current > 0}
                                    reportId={qReportId.current}
                                    dimensions={dimensions}
                                    measures={measures}
                                />
                            </Box>
                        )}

                        <Box flexGrow={1} className={classes.containerControls}>
                            {isLoading ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        flexDirection: 'row',
                                        height: '100%'
                                    }}>
                                    {CircleLoader(10, 60, 330, 50, 25, 20)}
                                </Box>
                            ) : (
                                renderControls()
                            )}
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" height="100%">
                    <Box style={{ width: '60px' }}>
                        <Box
                            className={`${classes.settingsToolbar} ${
                                classNames?.settingsContainer || ''
                            }`}>
                            {isSettingVisible && shouldRenderSetting && (
                                <QlikReportingPreferencesDialog
                                    isEnabled={!!isEnabled && isBaseChart}
                                    vizType={reportVizType}
                                    color={color}
                                    classNames={{
                                        settingsButton: classNames?.settingsButton || '',
                                        settingsButtonDisabled:
                                            classNames?.settingsButtonDisabled || '',
                                        buttonSave: classNames?.buttonSave || '',
                                        buttonCancel: classNames?.buttonCancel || ''
                                    }}
                                />
                            )}
                        </Box>

                        <Box
                            height={`${height - (showSignature ? 35 : 65)}px`}
                            className={`${classes.vizToolbar} ${classNames?.vizBar}`}>
                            <QlikReportingVizTypeTabs
                                onClickVizTypeHandler={handleVizToggle}
                                charts={charts}
                                isReportEnabled={!isReportReadOnly}
                                height={height - (showSignature ? 35 : 65)}
                                classNames={{
                                    iconButton: classNames?.chartButton || '',
                                    iconButtonActive: classNames?.chartButtonActive || ''
                                }}
                            />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            height: `100%`,
                            display: 'flex',
                            width: '100%',
                            paddingLeft: '20px',
                            paddingRight: '20px',
                            paddingBottom: '20px',
                            justifyContent: 'center'
                        }}
                        display="flex"
                        flexDirection="column">
                        {isMasterItemLoading ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                width="100%"
                                style={{
                                    height: `${height - 50}px`
                                }}>
                                {LoaderComponent || <CircularProgress color={color} size={60} />}
                            </Box>
                        ) : shouldRenderReport ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                width="100%"
                                style={{
                                    height: `${height - (showSignature && !isLoading ? 0 : 50)}px`
                                }}>
                                {renderReportViz}
                                {showSignature && !isLoading && (
                                    <QlikReportingFooter
                                        author={author}
                                        classNames={{
                                            iconButton: classNames?.footerButton || ''
                                        }}
                                    />
                                )}
                            </Box>
                        ) : isLoading ? (
                            <QlikReportingLoader color={color} customLoader={LoaderComponent} />
                        ) : (
                            <QlikReportingEmpty
                                showWizardImage={showWizardImage}
                                activeStep={!reportDataset ? 0 : !reportVizType ? 1 : 2}
                                classNames={{
                                    stepperActive: classNames?.stepperActive || '',
                                    stepperCompleted: classNames?.stepperCompleted || '',
                                    stepperIconCompleted: classNames?.stepperIconCompleted || '',
                                    stepperLabel: classNames?.stepperLabel || ''
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default QlikReportingCore

const useStyles = makeStyles()((theme: Theme) => ({
    header: {
        backgroundColor: theme.palette.background.paper
    },
    root: {
        backgroundColor: theme.palette.background.paper
    },
    settingsToolbar: {
        backgroundColor: theme.palette.background.default,
        height: '50px',
        minWidth: '60px',
        borderLeft: `1px solid ${darken(theme.palette.divider, 0.1)}`,
        borderRight: `1px solid ${darken(theme.palette.divider, 0.1)}`
    },
    vizToolbar: {
        backgroundColor: theme.palette.background.default,
        borderLeft: `1px solid ${darken(theme.palette.divider, 0.1)}`,
        borderRight: `1px solid ${darken(theme.palette.divider, 0.1)}`
    },
    controlsToolbar: {
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid  ${darken(theme.palette.divider, 0.1)}`,
        maxHeight: '50px'
    },
    containerControls: {
        height: '100%'
    },
    additionalContentContainer: {
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    containerTitle: {
        paddingLeft: 10,
        textAlign: 'left',
        minHeight: '48px',
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${darken(theme.palette.divider, 0.1)}`
    },
    actionsContainer: {
        background: theme.palette.background.default
    },
    headerDataset: {
        paddingLeft: 10,
        textAlign: 'left',
        minHeight: '50px',
        borderBottom: `1px solid ${darken(theme.palette.divider, 0.1)}`,
        backgroundColor: theme.palette.background.default
    },
    headerDatasetCollapsed: {
        textAlign: 'left',
        minHeight: '49px',
        backgroundColor: theme.palette.background.default
    },
    headerCollapse: {
        borderBottom: `1px solid ${darken(theme.palette.divider, 0.1)}`
    },
    containerSelector: {
        paddingTop: '8px'
    },
    selectorBox: {
        borderRadius: '4px',
        padding: '16px'
    },
    formControl: {
        minWidth: 300,
        border: '1px solid #EBEBEB'
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    listRoot: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    listItem: {
        paddingTop: '2px',
        paddingBottom: '2px'
    },
    listSection: {
        backgroundColor: 'inherit'
    },
    listSubheader: {
        fontWeight: 600,
        textAlign: 'left',
        color: theme.palette.text.primary,
        borderBottom: '1px solid #c2c2c2'
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0
    },
    infoIcon: {
        paddingRight: '5px',
        height: '100%'
    },
    iconButton: {
        '&:hover': {
            backgroundColor: 'transparent'
        },
        '&:hover $icon': {
            color: 'rgba(0, 0, 0, 0.9) !important'
        }
    },
    wizardContainer: {
        width: '25%',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    reportingWizard: {
        fontWeight: 600,
        fontSize: 14,
        color: theme.palette.text.primary,
        paddingLeft: '5px'
    },
    shareContainer: {
        width: '15%',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    childrenContainer: {
        width: '40%',
        height: '40px',
        display: 'flex',
        alignItems: 'left',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexGrow: 1
    },
    burgerContainer: {
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        minWidth: '60px',
        height: '49px'
    },
    lockerContainer: {
        backgroundColor: theme.palette.info.main,
        borderLeft: `1px solid ${theme.palette.info.contrastText}`,
        minWidth: '60px',
        textAlign: 'center'
    },
    titleContainer: {
        paddingLeft: '10px',
        paddingRight: '10px',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        maxWidth: '225px',
        height: '49px'
    },
    title: {
        fontSize: '0.925rem',
        fontWeight: 500,
        lineHeight: '48px',
        textOverflow: 'ellipsis',
        color: theme.palette.info.contrastText
    }
}))
