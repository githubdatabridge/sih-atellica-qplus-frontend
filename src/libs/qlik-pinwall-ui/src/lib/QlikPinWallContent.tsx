import { FC, useCallback, useEffect, useRef, useState } from 'react'

import { Layout } from 'react-grid-layout'
import { useMediaQuery } from 'react-responsive'
import { useWindowSize } from 'react-use'

import { Box, CircularProgress, useTheme } from '@mui/material'

import { useI18n } from '@libs/common-providers'
import { AlertDuration, AlertType, useAlertContext } from '@libs/common-ui'
import { useParseFilters } from '@libs/core-hooks'
import { PinWall, ReportFilters } from '@libs/core-models'
import { GridWallReport } from '@libs/gridwall-ui'
import { QlikFullscreenDialog } from '@libs/qlik-base-ui'
import {
    useQlikAppContext,
    useQlikBootstrapContext,
    useQlikMasterItemContext,
    useQlikSelectionContext
} from '@libs/qlik-providers'

import backendToGridLibMapperReport from './components/backendToGridLibMapperReport'
import fillEmptyCells from './components/fillEmptyCells'
import translation from './constants/translations'
import { useGridWallContext, useQlikPinWallDispatch, useQlikPinWallState } from './contexts'
import { updatePinWall, persistPinWall, raiseError } from './contexts/store/pinWall.actions'
import {
    IQlikPinWallExportOptions,
    TQlikPinWallClasses,
    TQlikPinWallFullscreenOptions
} from './QlikPinWall'
import QlikPinWallEmpty from './QlikPinWallEmpty'

export interface ReportLayout extends Layout {
    reportId?: number
}

interface IQlikPinWallContentProps {
    numberOfPinWalls: number
    pageId?: string
    cHeight?: number
    isFullscreen?: boolean
    showWizardImage?: boolean
    showAppWaterMark?: boolean
    pinwallIsLoading?: boolean
    fullscreenOptions?: TQlikPinWallFullscreenOptions
    exportOptions?: IQlikPinWallExportOptions
    classNames?: TQlikPinWallClasses
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    LoaderComponent?: JSX.Element
    isFullScreenCloseCallback?: () => void
}

const QlikPinWallContent: FC<IQlikPinWallContentProps> = ({
    pageId,
    cHeight = 0,
    isFullscreen = false,
    showWizardImage = true,
    showAppWaterMark = true,
    pinwallIsLoading = true,
    exportOptions,
    LoaderComponent,
    color = 'secondary',
    classNames,
    fullscreenOptions,
    isFullScreenCloseCallback
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [isPinWallLoading, setIsPinWallLoading] = useState<boolean>(true)
    const [isDesigned, setIsDesigned] = useState<boolean>(false)
    const [reports, setReports] = useState(null)
    const [pinwallRows, setPinwallRows] = useState([])

    const { rows, isFixed, setRows } = useGridWallContext()
    const dispatch = useQlikPinWallDispatch()
    const { height } = useWindowSize()
    const { q } = useQlikBootstrapContext()
    const { qAppMap } = useQlikAppContext()
    const { qMasterDimensionsMap, qMasterMeasuresMap } = useQlikMasterItemContext()
    const { setDockedFields } = useQlikSelectionContext()
    const { setParseFilters } = useParseFilters()
    const {
        activePinWall: pinWall,
        activePinWallFilters: pinWallFilters,
        pinWalls,
        pinWallableReports,
        refreshPinWallInMilliseconds,
        errorMessage
    } = useQlikPinWallState()
    const { showToast } = useAlertContext()

    const { t } = useI18n()

    const isLandscape = useMediaQuery({ query: '(orientation: landscape)' })
    const isMobile = useMediaQuery({ query: '(max-width: 599px)' })
    const headerFullscreenHeight = isMobile ? (isLandscape ? 52 : 60) : 70

    const pinWallRef = useRef<PinWall>(null)

    const checkIsPinWallDesigned = useCallback(pinWall => {
        let isPinWallDesigned = false
        if (pinWall?.content?.cells && pinWall?.content?.cells.length > 0) {
            if (pinWall?.content) {
                for (const cell of pinWall.content.cells) {
                    if (cell?.reportId) {
                        isPinWallDesigned = true
                        break
                    }
                }
            }
        }
        setIsDesigned(isPinWallDesigned)
    }, [])

    useEffect(() => {
        setIsPinWallLoading(pinwallIsLoading)
    }, [pinwallIsLoading])

    useEffect(() => {
        if (!isPinWallLoading && pinWall) {
            setIsLoading(true)
            checkIsPinWallDesigned(pinWall)
            pinWallRef.current = pinWall
            // WORKAROUND => Delay 500 to render properly the pinwall
            setTimeout(() => {
                setIsLoading(false)
            }, 300)
        }
        if (!isPinWallLoading && !pinWall) {
            setIsLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pinWall, isPinWallLoading])

    useEffect(() => {
        let sFilters: ReportFilters[] = []

        // Parse PinWall Filters
        if (pinWallFilters.length > 0 && qMasterDimensionsMap.size > 0) {
            for (const pFilter of pinWallFilters) {
                const qDimensions = qMasterDimensionsMap.get(pFilter.qlikAppId)
                const qFilters = setParseFilters(pFilter.filters, qDimensions, [], true)
                sFilters = [...sFilters, ...qFilters]
            }
        }

        // Set PinWall Filters
        setDockedFields(sFilters)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qMasterDimensionsMap, pinWallFilters])

    useEffect(() => {
        if (!isPinWallLoading) {
            setPinwallRows(rows)
        }
    }, [rows, isPinWallLoading])

    useEffect(() => {
        setReports(pinWallableReports)
    }, [pinWallableReports])

    useEffect(() => {
        // PinWall gets refreshed and updated as soon the save action is triggered which leads to have a new timestamp
        if (refreshPinWallInMilliseconds) {
            // Dispatch update PinWall which sets the state
            dispatch(updatePinWall(pinWallRef.current))
            checkIsPinWallDesigned(pinWallRef.current)
            try {
                // Dispatch persist PinWall which triggers backend endpoint
                persistPinWall(dispatch, pinWallRef.current, true)
            } catch (error) {
                showToast(
                    t(translation.pinwallToastMsgEditError),
                    AlertType.ERROR,
                    AlertDuration.VERY_LONG
                )
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshPinWallInMilliseconds])

    useEffect(() => {
        try {
            if (errorMessage) {
                showToast(
                    t(translation.pinwallToastMsgEditError),
                    AlertType.ERROR,
                    AlertDuration.VERY_LONG
                )
            }
        } finally {
            dispatch(raiseError(''))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorMessage])

    const handleDeleteCell = (id: string, reportId: number) => {
        const uPinWall = JSON.parse(JSON.stringify(pinWall))
        if (uPinWall) {
            for (const cell of uPinWall.content.cells) {
                if (cell?.reportId === reportId) {
                    delete cell.reportId
                    cell.visualizationId = `empty-${cell.x}-${cell.y}`
                    break
                }
            }
        }
        pinWallRef.current = uPinWall
        dispatch(updatePinWall(uPinWall))
    }

    const onExitFullscreen = () => {
        isFullScreenCloseCallback()
    }

    const renderPinWall = () => {
        if (isLoading || isPinWallLoading) {
            return (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexGrow="1"
                    height={cHeight}
                    width="100%"
                    style={{ backgroundColor: theme.palette.background.paper }}>
                    {LoaderComponent || <CircularProgress color={color} size={60} />}
                </Box>
            )
        }

        if (!pinWall && isFixed) {
            return (
                <QlikPinWallEmpty
                    pageId={pageId}
                    isFullscreen={isFullscreen}
                    height={cHeight}
                    title={t(translation.pinwallEmptyTitle)}
                    description={t(translation.pinwallEmptyButton)}
                    buttonText={t(translation.pinwallCreateButton)}
                    showWizardImage={showWizardImage}
                    color={color}
                />
            )
        }

        if (!isDesigned && isFixed) {
            return (
                <QlikPinWallEmpty
                    isFullscreen={isFullscreen}
                    height={cHeight}
                    title={t(translation.pinwallEmptyTitle)}
                    description={t(translation.pinwallEmptyDescription)}
                    showActionButton={false}
                    showWizardImage={showWizardImage}
                    color={color}
                />
            )
        }

        return (
            <GridWallReport
                margin={[
                    pinWall?.content?.meta?.layout?.margin || 0,
                    pinWall?.content?.meta?.layout?.margin || 0
                ]}
                containerPadding={[
                    pinWall?.content?.meta?.layout?.padding || 0,
                    pinWall?.content?.meta?.layout?.padding || 0
                ]}
                className={classNames?.gridWall || undefined}
                classNames={{
                    cell: classNames?.cell || undefined
                }}
                rows={pinwallRows}
                cellCount={pinWall?.content.cellCount || 9}
                onDelete={(id, reportId) => handleDeleteCell(id, reportId)}
                rowHeight={
                    (isFullscreen ? height - headerFullscreenHeight : cHeight) /
                        Math.sqrt(pinWall?.content.cellCount) -
                    (pinWall?.content?.meta?.layout?.padding || 0)
                }
                onLayoutChange={(l: ReportLayout[]) => {
                    pinwallRows[0]?.map(r => {
                        for (let i = 0; i < l.length; i++) {
                            if (l[i].i === `${r.name}-${r.reportId || 0}`) {
                                l[i].reportId = r?.reportId || 0
                            }
                        }
                    })
                    const cells = l?.map(libLayoutCell => {
                        const c: any = {
                            width: libLayoutCell.w,
                            height: libLayoutCell.h,
                            x: libLayoutCell.x,
                            y: libLayoutCell.y
                        }
                        if (libLayoutCell?.reportId) {
                            c.reportId = libLayoutCell.reportId
                        } else {
                            c.visualizationId = `empty-${libLayoutCell.x}-${libLayoutCell.y}`
                        }
                        return c
                    })
                    const rowCells = l?.map(libLayoutCell => {
                        const c: any = {
                            name: libLayoutCell.i,
                            width: libLayoutCell.w,
                            height: libLayoutCell.h,
                            x: libLayoutCell.x,
                            y: libLayoutCell.y
                        }
                        if (libLayoutCell.reportId) c.reportId = libLayoutCell.reportId
                        return c
                    })
                    pinwallRows[0]?.map(r => {
                        for (let i = 0; i < rowCells.length; i++) {
                            if (rowCells[i].reportId === r.reportId) {
                                rowCells[i].name = r.name
                                if (r.description) rowCells[i].description = r.description
                            }
                        }
                    })

                    const newLayout = fillEmptyCells(
                        rowCells?.map(x =>
                            backendToGridLibMapperReport(
                                x,
                                reports,
                                qAppMap,
                                qMasterDimensionsMap,
                                qMasterMeasuresMap,
                                exportOptions?.types,
                                showAppWaterMark,
                                isFixed,
                                color,
                                {
                                    icon: `${classNames?.toolbarIcon}`,
                                    iconButton: `${classNames?.toolbarIconButton}`,
                                    footNote: `${classNames?.vizFootNote || ''}`
                                }
                            )
                        ),
                        Math.sqrt(pinWall?.content?.cellCount || 16)
                    )

                    setRows([newLayout])

                    const uPinWall = pinWalls?.find(pw => pw.id === pinWall.id)
                    uPinWall.content = { ...pinWall?.content, cells }

                    // Save updated pinwall reference in ref variable to avoid re-rendering behaviour
                    pinWallRef.current = uPinWall
                }}
                onResizeStop={() => {
                    if (q) q?.resize()
                    setRows(prev => [[...prev[0]]])
                }}
                onDragStop={() => setRows(prev => [[...prev[0]]])}
                isDraggable
                isResizable
                isFixed={isFixed}
            />
        )
    }

    const theme = useTheme()

    return isFullscreen ? (
        <QlikFullscreenDialog
            title={pinWallRef?.current?.title}
            isOpen={isFullscreen}
            onClose={onExitFullscreen}
            closeTooltipText={t(translation.pinwallDialogClose)}
            options={fullscreenOptions}
            toolbarOptions={{
                showClearAllButton: true,
                showExportButton: false
            }}
            disableEnforceFocus={true}>
            {renderPinWall()}
        </QlikFullscreenDialog>
    ) : (
        renderPinWall()
    )
}

export default QlikPinWallContent
