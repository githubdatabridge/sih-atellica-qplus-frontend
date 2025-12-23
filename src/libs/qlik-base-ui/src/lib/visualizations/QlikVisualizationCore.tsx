import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Iframe from 'react-iframe'
import { useMount, useUnmount } from 'react-use'

import { Box, Theme, Typography, useTheme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'
import { v4 as uuidv4 } from 'uuid'

import { useWindowDimensions } from '@libs/common-hooks'
import { useI18n } from '@libs/common-providers'
import { AppInfoIcon, ChartLoader, FilterLoader } from '@libs/common-ui'
import {
    useQlikApplyPatch,
    useQlikContainerSize,
    useQlikExpression,
    useQlikGetObjectProperties,
    useQlikGetVisualization,
    useQlikGetVizColumns,
    useQlikVisualizationCreate,
    useQlikVisualizationExportData,
    useQlikVisualizationExportImg,
    useQlikVisualizationExportPdf
} from '@libs/qlik-capability-hooks'
import { QAction, QSheet } from '@libs/qlik-models'
import {
    useQlikActionsContext,
    useQlikApp,
    useQlikContext,
    useQlikSheetContext,
    useQlikThemeContext,
    useQlikTitleContext
} from '@libs/qlik-providers'
import { qlikConfigService } from '@libs/qlik-services'

import QlikHyperlinkButton from '../button/QlikHyperlinkButton'
import QlikFullScreenDialog from '../dialog/QlikFullscreenDialog'
import QlikVisualizationSnackbar from './components/snackbar/QlikVisualizationSnackbar'
import translations from './constants/translations'
import {
    QLIK_VIZ_DATAPOINTS_PATHS,
    QLIK_VIZ_LEGEND_PATHS,
    QLIK_VIZ_MIN_LEGEND_WIDTH,
    QLIK_VIZ_MIN_VALUE_WIDTH
} from './constants/visualization'
import { useVizDefaultOptions } from './hooks'
import SvgPreview from './images/SvgPreview'
import { useQlikVisualizationContext } from './QlikVisualizationContext'
import QlikToolbar from './toolbar/QlikToolbar'
import { IQlikToolbarInfoProps } from './toolbar/QlikToolbarInfo'

type TQlikVisualizationCoreClassNames = {
    toolbar?: string
    toolbarIcon?: string
    toolbarIconButton?: string
    footerNote?: string
    footerNoteText?: string
    calculationPrimaryText?: string
    calculationSecondaryText?: string
}

export interface IQlikPanelLinkOptions {
    pathName: string
    search?: string
    qlikActions?: QAction[]
    color?: 'primary' | 'secondary' | 'info' | 'default'
    className?: string
    icon?: React.ReactNode
}

export interface IQlikVisualizationCoreTitleOptions {
    disableQlikNativeTitles?: boolean
    useQlikTitlesInPanel?: boolean
    useQlikFooterInFooter?: boolean
}

export interface IQlikVisualizationCoreExportOptions {
    types: Array<'xlsx' | 'pdf' | 'png'>
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
}

export interface IQlikVisualizationCoreLegendOptions {
    minLegendWidth?: number
    autoLegend?: boolean
}

export interface IQlikVisualizationCoreDataPointOptions {
    minDataPointValuesWidth?: number
    autoDataPointValues?: boolean
}

export interface IQlikVisualizationCoreLoaderOptions {
    showFilterLoader?: number
}

export interface IQlikVisualizationCoreTypeOptions {
    types?: Array<'barchart' | 'piechart' | 'linechart' | 'table'>
    css?: any
    showSettings?: boolean
    handleVisualizationClickCallback?: (type: string) => void
}

export interface IQlikVisualizationCoreIFrameOptions {
    url: any
    title?: any
    src?: any
    scrolling?: any
    overflow?: any
    loading?: any
    frameBorder?: number
    position?: any
    display?: any
    height?: any
    width?: any
    allowFullScreen?: any
    allow?: any
    sandbox?: any
    styles?: any
    select?: any
    options?: any
}

type TQlikVisualizationCalculation = {
    condition?: string
    message?: string
    hideQlikId?: boolean
    icon?: JSX.Element
}

export interface IQlikVisualizationCoreProps {
    id: string
    qlikAppId?: string
    height?: string
    linkOptions?: IQlikPanelLinkOptions
    titleOptions?: IQlikVisualizationCoreTitleOptions
    exportOptions?: IQlikVisualizationCoreExportOptions
    legendOptions?: IQlikVisualizationCoreLegendOptions
    dataPointOptions?: IQlikVisualizationCoreDataPointOptions
    typeOptions?: IQlikVisualizationCoreTypeOptions
    infoOptions?: IQlikToolbarInfoProps
    iFrameOptions?: IQlikVisualizationCoreIFrameOptions
    loaderOptions?: IQlikVisualizationCoreLoaderOptions
    showAppWaterMark?: boolean
    calculation?: TQlikVisualizationCalculation
    enableFullscreen?: boolean
    isToolbarOnPanel?: boolean
    noInteraction?: boolean
    noSelections?: boolean
    inheritSheetVisibility?: boolean
    footerNote?: string
    classNames?: TQlikVisualizationCoreClassNames
    disableToolbarCss?: boolean
    handleCreateVizCallback?: (viz: any) => void
    handlePatchVizCallback?: (viz: any) => void
}

const QlikVisualizationCore: FC<IQlikVisualizationCoreProps> = ({
    qlikAppId,
    id,
    height,
    exportOptions,
    linkOptions,
    legendOptions,
    dataPointOptions,
    infoOptions,
    typeOptions,
    iFrameOptions,
    loaderOptions,
    titleOptions = {
        disableQlikNativeTitles: false,
        useQlikTitlesInPanel: false,
        useQlikFooterInFooter: false
    },
    showAppWaterMark,
    calculation,
    enableFullscreen = true,
    isToolbarOnPanel = true,
    noInteraction = false,
    noSelections = false,
    inheritSheetVisibility = false,
    footerNote,
    classNames,
    disableToolbarCss = false,
    handleCreateVizCallback,
    handlePatchVizCallback
}) => {
    const {
        setVisualizationObject,
        setVisualizationId,
        setShowVisualization,
        setOnVisualizationExport,
        setOnVisualizationFullscreen,
        setOnVisualizationTypeChange,
        visualizationOptions
    } = useQlikVisualizationContext()
    const {
        settings: { qConfig }
    } = useQlikContext()
    const { qAppId, qMeta, qTitle, qDescription } = useQlikApp(qlikAppId)
    const { qTheme } = useQlikThemeContext()
    const { qSheetMap } = useQlikSheetContext()

    const { setVisualization } = useQlikGetVisualization()
    const { setVisualizationCreate } = useQlikVisualizationCreate()
    const { setVizColumns } = useQlikGetVizColumns()
    const { setApplyPatch } = useQlikApplyPatch()
    const { setObjectProperties } = useQlikGetObjectProperties()
    const { setVisualizationExportData } = useQlikVisualizationExportData()
    const { setVisualizationExportImg } = useQlikVisualizationExportImg()
    const { setVisualizationExportPdf } = useQlikVisualizationExportPdf()

    const {
        qKpis: [qCalculationCondition]
    } = useQlikExpression({
        qlikAppId: qAppId,
        expressions: [calculation?.condition || '=1=1'],
        invalidation: true,
        isCalculated: Boolean(calculation?.condition)
    })
    const [viz, setViz] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [visualizationElementId] = useState(uuidv4())
    const [qFootNote, setQlikFootnote] = useState<string>('')
    const [snackbarKey, setSnackbarKey] = useState<number>(0)
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
    const [isSheetVisible, setIsSheetVisible] = useState<boolean>(true)
    const [isCalculated, setIsCalculated] = useState<boolean>(true)

    const { setActionsNode, setShowActionsNode } = useQlikActionsContext()
    const { qlikTitle, qlikSubtitle, setQlikTitles, setShowQlikTitle } = useQlikTitleContext()
    const targetRef = useRef<any>()
    const { widthC, heightC } = useQlikContainerSize(targetRef)
    const { setVizDefaultOptions } = useVizDefaultOptions()
    const { height: wHeight } = useWindowDimensions()
    const { t } = useI18n()

    const qViz = useRef<any>(null)
    const qVizColumns = useRef<any[]>(null)
    const qVizType = useRef<string>('')
    const qVizOptions = useRef<any>({})

    const theme = useTheme()

    const isFooterNoteHelper = useMemo(() => {
        return (
            titleOptions?.useQlikFooterInFooter &&
            (showAppWaterMark || linkOptions || footerNote || qFootNote)
        )
    }, [footerNote, linkOptions, showAppWaterMark, titleOptions?.useQlikFooterInFooter, qFootNote])

    const patchLegend = useCallback(
        async (v: any, show: boolean) => {
            const type = v?.qVisualization?.model?.layout.qInfo.qType
            const vizLegendPath = QLIK_VIZ_LEGEND_PATHS.find(v => v.type === type)
            if (vizLegendPath) {
                await setApplyPatch(
                    v.qVisualization.model,
                    'replace',
                    vizLegendPath.path,
                    show,
                    true,
                    qAppId
                )
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const patchDataPoints = useCallback(
        async (v: any, show: boolean) => {
            const showLabel = QLIK_VIZ_DATAPOINTS_PATHS.find(v => v.type === 'showLabels')
            if (showLabel) {
                await setApplyPatch(
                    v.qVisualization.model,
                    'replace',
                    showLabel?.path,
                    show,
                    true,
                    qAppId
                )
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const updateTitles = useCallback(() => {
        if (!qViz.current?.qVisualization?.model) return
        setQlikTitles(
            qViz.current.qVisualization.model.layout.title as string,
            qViz.current.qVisualization.model.layout.subtitle as string
        )
        setQlikFootnote(qViz.current.qVisualization.model.layout.footnote as string)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const setTitleInPanel = useCallback(
        (visualization: any, useTitle: boolean, useFooter: boolean) => {
            if (useTitle || useFooter)
                visualization.qVisualization.model.Validated.bind(updateTitles)
            if (useTitle) {
                setQlikTitles(
                    visualization.qVisualization.model.layout.title as string,
                    visualization.qVisualization.model.layout.subtitle as string
                )
            }
            if (useFooter) {
                setQlikFootnote(visualization.qVisualization.model.layout.footnote as string)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const applyTitleHidingStyles = useCallback(
        (elementId: string, hide: boolean) => {
            const container = document.getElementById(elementId)
            if (container) {
                if (hide) {
                    container.classList.add('qlik-hide-native-titles')
                } else {
                    container.classList.remove('qlik-hide-native-titles')
                }
            }
        },
        []
    )

    const checkLegendTitles = useCallback(
        (viz: any, width: number) => {
            if (legendOptions?.autoLegend) {
                if (
                    width > 0 &&
                    width <= (legendOptions?.minLegendWidth || QLIK_VIZ_MIN_LEGEND_WIDTH)
                ) {
                    patchLegend(viz, false)
                } else {
                    if (width > 0) patchLegend(viz, true)
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [legendOptions?.autoLegend, legendOptions?.minLegendWidth]
    )

    const checkDataPoints = useCallback(
        (viz: any, width: number) => {
            const vizMinShowDataWidth =
                dataPointOptions?.minDataPointValuesWidth || QLIK_VIZ_MIN_VALUE_WIDTH
            if (dataPointOptions?.autoDataPointValues) {
                if (width > 0 && width <= vizMinShowDataWidth) {
                    patchDataPoints(viz, false)
                } else {
                    if (width > 0) patchDataPoints(viz, true)
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataPointOptions?.autoDataPointValues, dataPointOptions?.minDataPointValuesWidth]
    )

    const updateViz = useCallback(
        async (id: string) => {
            return await setVisualization(id, qAppId)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const loadViz = useCallback(async () => {
        setIsLoading(true)
        const vis = viz || qViz.current
        if (vis) {
            vis.close()
        }
        const visualization = await updateViz(id)
        if (visualization) {
            qViz.current = visualization
            setTitleInPanel(
                visualization,
                titleOptions?.useQlikTitlesInPanel,
                titleOptions?.useQlikFooterInFooter
            )
            checkLegendTitles(qViz.current, targetRef.current?.offsetWidth)
            checkDataPoints(qViz.current, targetRef.current?.offsetWidth)

            setTimeout(async () => {
                if (visualizationElementId) {
                    const element = document.getElementById(visualizationElementId)
                    if (element) {
                        // Apply title hiding CSS BEFORE show to prevent flickering
                        if (titleOptions?.disableQlikNativeTitles) {
                            applyTitleHidingStyles(visualizationElementId, true)
                        }

                        // Show the visualization
                        await visualization.show(visualizationElementId, {
                            noSelections: noSelections,
                            noInteraction: noInteraction
                        })
                        await visualization.resize()


                    }
                }
                setViz(visualization)
                if (setVisualizationObject) setVisualizationObject(visualization)
                if (handleCreateVizCallback) handleCreateVizCallback(visualization)

                setIsLoading(false)
            }, 500)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        id,
        visualizationElementId,
        viz,
        titleOptions?.disableQlikNativeTitles,
        titleOptions?.useQlikTitlesInPanel,
        noSelections,
        noInteraction,
        setVisualizationObject,
        setTitleInPanel
    ])

    const checkSheetVisibility = () => {
        let isShow = true
        if (inheritSheetVisibility) {
            let sheet: QSheet = null
            const sheets = qSheetMap.get(qAppId)
            for (const s of sheets) {
                const sheetObjectFound = s.cells.find(c => c.id === id)
                if (sheetObjectFound) {
                    sheet = s
                    break
                }
            }
            if (sheet.showCondition) {
                if (Number(sheet.showCondition) === 0) {
                    isShow = false
                }
            }
        }

        return isShow
    }

    const checkCalculationCondition = (result: string) => Number(result) !== 0

    useMount(() => {
        // Inject global CSS for hiding Qlik native titles (only once)
        if (!document.getElementById('qlik-hide-titles-global-style')) {
            const style = document.createElement('style')
            style.id = 'qlik-hide-titles-global-style'
            style.textContent = `
                .qlik-hide-native-titles .qv-object-title,
                .qlik-hide-native-titles .qv-object-title-text,
                .qlik-hide-native-titles .qv-object-subtitle,
                .qlik-hide-native-titles .qv-object-header {
                    display: none !important;
                }
            `
            document.head.appendChild(style)
        }

        if (setOnVisualizationExport) setOnVisualizationExport(() => onExport)
        if (setOnVisualizationTypeChange) setOnVisualizationTypeChange(() => onVizChange)
        if (setOnVisualizationFullscreen) setOnVisualizationFullscreen(() => onFullscreen)
        if (setVisualizationId) setVisualizationId(id)
    })

    useEffect(() => {
        const isCalc =
            calculation?.condition === undefined ||
            calculation?.condition === '' ||
            qCalculationCondition

        if (
            (isCalc && qSheetMap?.size > 0 && inheritSheetVisibility) ||
            (!inheritSheetVisibility && isCalc)
        ) {
            if ((inheritSheetVisibility && checkSheetVisibility()) || !inheritSheetVisibility) {
                if (isToolbarOnPanel) {
                    setActionsNode(toolbar)
                }
                if (calculation?.condition) {
                    if (qCalculationCondition && qCalculationCondition !== "=''") {
                        if (checkCalculationCondition(qCalculationCondition)) {
                            setIsCalculated(true)
                            loadViz()
                        } else {
                            setIsCalculated(false)
                        }
                    }
                } else {
                    loadViz()
                }
            } else {
                setIsSheetVisible(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qSheetMap, qCalculationCondition])

    useEffect(() => {
        qVizOptions.current = visualizationOptions
        if (handlePatchVizCallback) handlePatchVizCallback(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visualizationOptions])

    useEffect(() => {
        const vis = qViz.current || viz
        const width = widthC || targetRef.current?.offsetWidth
        checkLegendTitles(vis, width)
        checkDataPoints(vis, width)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [widthC])

    useEffect(() => {
        if (setShowQlikTitle) setShowQlikTitle(isCalculated)
        if (setShowActionsNode) setShowActionsNode(isCalculated)
        if (setShowVisualization) setShowVisualization(isCalculated)
    }, [setShowQlikTitle, setShowActionsNode, setShowVisualization, isCalculated])

    useUnmount(() => {
        if (setOnVisualizationExport) setOnVisualizationExport(undefined)
        if (setOnVisualizationFullscreen) setOnVisualizationFullscreen(undefined)
        if (setOnVisualizationTypeChange) setOnVisualizationTypeChange(undefined)

        const vis = qViz.current || viz

        if (vis) {
            vis.qVisualization?.model?.Validated.unbind(updateTitles)
            vis.close()
            qViz.current = null
        }
    })

    const createVizViaApi = useCallback(
        async (vizType: string) => {
            let vizNew = null
            try {
                setIsLoading(true)

                if (qViz.current) {
                    await qViz.current.close()
                }
                const object = await setObjectProperties(id, qAppId)
                if (object) {
                    const columns = await setVizColumns(object.properties, qAppId)
                    qVizColumns.current = columns

                    const defaultOptions = setVizDefaultOptions(vizType)
                    const opts = { ...(qVizOptions.current || {}), ...defaultOptions }

                    vizNew = await setVisualizationCreate(vizType, columns, opts, qAppId)
                    if (vizNew) {
                        qViz.current = vizNew.qVisualization
                        setVisualization(qViz.current, qAppId)
                        setViz(qViz.current)
                        setVisualizationObject(qViz.current)
                        if (handleCreateVizCallback) handleCreateVizCallback(qViz.current)
                    }
                }

                return vizNew
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsLoading(false)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id, setIsLoading, setVisualizationObject]
    )

    const renderVizViaApi = useCallback(async () => {
        if (!qVizType.current) {
            return await loadViz()
        } else {
            const vizNew = await createVizViaApi(qVizType.current)
            const element = document.getElementById(visualizationElementId)

            if (visualizationElementId && vizNew && element) {
                await vizNew.show(visualizationElementId)
                await vizNew.resize()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visualizationElementId])

    const onVizChange = useCallback(async (type: string) => {
        qVizType.current = type
        qVizOptions.current = {}
        await renderVizViaApi()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onExport = async (type: string) => {
        const element = document.getElementById(visualizationElementId)
        const vis = qViz.current || viz
        if (type === 'png')
            await setVisualizationExportImg(
                vis,
                {
                    format: 'png',
                    height: element?.offsetHeight,
                    width: element?.offsetWidth
                },
                qConfig.prefix
            )
        else if (type === 'pdf') {
            await setVisualizationExportPdf(
                vis,
                { documentSize: 'a4', aspectRatio: 2, orientation: 'landscape' },
                qConfig.prefix
            )
        } else {
            await setVisualizationExportData(vis, { format: 'OOXML', state: 'A' }, qConfig.prefix)
        }
    }

    const onFullscreen = useCallback(async () => {
        setSnackbarKey(0)
        setIsFullscreen(true)
        await renderVizViaApi()
        const visualization = viz || qViz.current
        if (legendOptions?.autoLegend) {
            patchLegend(visualization, true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setIsFullscreen, setSnackbarKey, legendOptions?.autoLegend, viz])

    const onExitFullscreen = useCallback(async () => {
        setIsFullscreen(false)
        await renderVizViaApi()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setIsFullscreen])

    const handleSnackbarClick = () => {
        const key = new Date().getTime()
        setSnackbarKey(key)
    }

    const { classes } = useStyles()

    const renderViz = (snackbarKey: any, fullscreen = false) => {
        return (
            <>
                <div
                    id={visualizationElementId}
                    ref={targetRef}
                    style={{
                        height:
                            (isLoading && isSheetVisible && isCalculated) ||
                                !isSheetVisible ||
                                !isCalculated
                                ? '0px'
                                : !isFullscreen && !enableFullscreen
                                    ? 'inherit'
                                    : '100%',
                        width: '100%',
                        paddingLeft: '16px',
                        padding: '16px'
                    }}
                    onClick={noSelections ? () => handleSnackbarClick() : undefined}
                />
                {isLoading && isSheetVisible && isCalculated ? (
                    <div
                        ref={targetRef}
                        style={{
                            height: isFullscreen || enableFullscreen ? '100%' : 'inherit',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: '16px',
                            paddingRight: '16px',
                            paddingBottom: '16px',
                            marginTop: '-20px'
                        }}>
                        {loaderOptions?.showFilterLoader ?? true
                            ? ChartLoader(
                                widthC,
                                isFullscreen
                                    ? wHeight - 200
                                    : Math.max(heightC - (isFooterNoteHelper ? 80 : 60), 0)
                            )
                            : FilterLoader(
                                widthC,
                                isFullscreen
                                    ? wHeight - 200
                                    : Math.max(heightC - (isFooterNoteHelper ? 30 : 10), 0)
                            )}
                    </div>
                ) : iFrameOptions && fullscreen ? (
                    <Iframe
                        url={`${qlikConfigService.config.isSecure ? 'https' : 'http'}://${qlikConfigService.config.host
                            }/${qlikConfigService.config.prefix
                                ? `${qlikConfigService.config.prefix}/`
                                : '/'
                            }single/?appid=${qAppId}&obj=${id}&theme=${qTheme}&${iFrameOptions.select ? `${iFrameOptions.select}&` : ''
                            }&${iFrameOptions.options ? `${iFrameOptions.options}&` : ''}identity=${qlikConfigService.config?.identity
                            }`}
                        width="100%"
                        height="100%"
                        frameBorder={0}
                    />
                ) : isSheetVisible && isCalculated ? (
                    noSelections ? (
                        <QlikVisualizationSnackbar
                            k={snackbarKey}
                            message={t(translations.vizIsReadonly)}
                        />
                    ) : null
                ) : (
                    <div
                        style={{
                            height: !isFullscreen && !enableFullscreen ? 'inherit' : '100%',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Box p={2}>
                            <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                                {calculation?.icon || <SvgPreview />}
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Box>
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <Typography
                                            sx={{
                                                fontSize: '0.825rem',
                                                fontStyle: 'oblique',
                                                color: theme.palette.text.disabled
                                            }}
                                            className={`${classNames?.calculationPrimaryText || ''
                                                }`}>
                                            {!isSheetVisible
                                                ? t(translations.vizUnauthorized)
                                                : calculation?.message ||
                                                t(translations.vizIsNotCalculated)}
                                        </Typography>
                                    </Box>
                                    {!isSheetVisible ||
                                        (!calculation?.hideQlikId && (
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center">
                                                <Typography
                                                    sx={{
                                                        fontSize: '0.725rem',
                                                        fontStyle: 'oblique',
                                                        color: theme.palette.text.disabled
                                                    }}
                                                    className={`${classNames?.calculationSecondaryText || ''
                                                        }`}>
                                                    -{id}-
                                                </Typography>
                                            </Box>
                                        ))}
                                </Box>
                            </Box>
                        </Box>
                    </div>
                )}
            </>
        )
    }

    const toolbar = (
        <QlikToolbar
            typeOptions={
                typeOptions && {
                    ...typeOptions
                }
            }
            infoOptions={
                infoOptions && {
                    ...infoOptions
                }
            }
            exportOptions={
                exportOptions && {
                    ...exportOptions
                }
            }
            className={classNames?.toolbar}
            classNames={{
                icon: classNames?.toolbarIcon || '',
                iconButton: classNames?.toolbarIconButton || ''
            }}
            enableFullscreen={enableFullscreen}
            isInline={!isToolbarOnPanel}
            disableToolbarCss={disableToolbarCss}
        />
    )

    const footer = isFooterNoteHelper && (
        <Box
            display="flex"
            width="100%"
            justifyContent="center"
            alignItems="center"
            pl={1}
            pr={1}
            className={`${isFooterNoteHelper ? classes.footerNote : undefined} ${classNames?.footerNote
                }`}>
            <Box flexGrow={1}>
                <Typography className={`${classes.footerNoteText} ${classNames?.footerNoteText}`}>
                    {footerNote || qFootNote || ''}
                </Typography>
            </Box>
            {linkOptions && (
                <Box pr={showAppWaterMark ? 1 : 0}>
                    <QlikHyperlinkButton {...linkOptions} />
                </Box>
            )}
            {showAppWaterMark && (
                <Box pr={1}>
                    <AppInfoIcon
                        initials={qMeta?.initials}
                        title={qTitle}
                        text={qDescription}
                        backgroundColor={qMeta?.backgroundColor}
                        color={qMeta?.color}
                    />
                </Box>
            )}
        </Box>
    )

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height={height || '100%'}>
            {!isToolbarOnPanel && isSheetVisible && isCalculated && (
                <Box width="100%">{toolbar}</Box>
            )}
            <QlikFullScreenDialog
                qlikAppId={qAppId}
                isOpen={isFullscreen}
                exportOptions={exportOptions}
                closeTooltipText={t(translations.fullscreenTooltipClose)}
                css={{ marginTop: '5px' }}
                disableEnforceFocus={true}
                title={qlikTitle}
                subTitle={qlikSubtitle}
                onClose={onExitFullscreen}
                options={{
                    customComponent: footer
                }}>
                {renderViz(0, true)}
            </QlikFullScreenDialog>
            {!isFullscreen && renderViz(snackbarKey)}
            {isFooterNoteHelper && (
                <Box
                    display="flex"
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                    pl={1}
                    pr={1}
                    className={`${isFooterNoteHelper ? classes.footerNote : undefined} ${classNames?.footerNote
                        }`}>
                    {footer}
                </Box>
            )}
        </Box>
    )
}

export default memo(QlikVisualizationCore)

const useStyles = makeStyles()((theme: Theme) => ({
    footerNote: {
        backgroundColor: theme.palette.background.default,
        minHeight: '35px',
        height: '35px'
    },
    footerNoteText: {
        fontSize: '0.825rem',
        fontStyle: 'italic',
        color: theme.palette.text.primary
    }
}))
