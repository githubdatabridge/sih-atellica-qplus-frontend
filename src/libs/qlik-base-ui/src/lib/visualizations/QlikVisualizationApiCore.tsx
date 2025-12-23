import React, { FC, useCallback, useEffect, useRef, useState } from 'react'

import { useMount, useUnmount } from 'react-use'

import { Box, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'
import { v4 as uuidv4 } from 'uuid'

import { useWindowDimensions } from '@libs/common-hooks'
import { useI18n } from '@libs/common-providers'
import { AppInfoIcon, ChartLoader } from '@libs/common-ui'
import {
    useQlikContainerSize,
    useQlikVisualizationCreate,
    useQlikVisualizationExportData,
    useQlikVisualizationExportImg,
    useQlikVisualizationExportPdf
} from '@libs/qlik-capability-hooks'
import { QAction } from '@libs/qlik-models'
import { useQlikActionsContext, useQlikApp, useQlikContext } from '@libs/qlik-providers'

import QlikHyperlinkButton from '../button/QlikHyperlinkButton'
import QlikFullScreenDialog from '../dialog/QlikFullscreenDialog'
import translations from './constants/translations'
import { useVizDefaultOptions } from './hooks'
import { useQlikVisualizationContext } from './QlikVisualizationContext'
import QlikToolbar from './toolbar/QlikToolbar'
import { IQlikToolbarInfoProps } from './toolbar/QlikToolbarInfo'

type TQlikVisualizationApiCoreClassNames = {
    toolbar?: string
    toolbarIcon?: string
    toolbarIconButton?: string
    footNote?: string
}

type TQlikVisualizationApi = {
    columns: any[]
    options: any
    vizType: string
}

export interface IQlikVisualizationCoreExportOptions {
    types: Array<'xlsx' | 'pdf' | 'png'>
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
}

export interface IQlikVisualizationApiFullscreenOptions {
    title?: string
}

export interface IQlikVisualizationApiLinkOptions {
    pathName: string
    search?: string
    qlikActions?: QAction[]
    color?: 'primary' | 'info' | 'secondary' | 'default'
    className?: string
    icon?: React.ReactNode
}

export interface IQlikVisualizationApiCoreProps {
    qlikAppId?: string
    height?: string
    exportOptions?: IQlikVisualizationCoreExportOptions
    infoOptions?: IQlikToolbarInfoProps
    linkOptions?: IQlikVisualizationApiLinkOptions
    fullscreenOptions?: IQlikVisualizationApiFullscreenOptions
    enableFullscreen?: boolean
    isToolbarOnPanel?: boolean
    vizOptions: TQlikVisualizationApi
    shouldRerender?: boolean
    classNames?: TQlikVisualizationApiCoreClassNames
    onCreateVisualizationCallback?: (viz: any, elementId: string) => void
    showAppWaterMark?: boolean
    disableToolbarCss?: boolean
}

const QlikVisualizationApiCore: FC<IQlikVisualizationApiCoreProps> = ({
    qlikAppId,
    height,
    exportOptions,
    infoOptions,
    linkOptions,
    fullscreenOptions,
    enableFullscreen = true,
    isToolbarOnPanel = true,
    vizOptions,
    shouldRerender = true,
    onCreateVisualizationCallback,
    showAppWaterMark = false,
    disableToolbarCss = false,
    classNames
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [visualizationElementId] = useState(uuidv4())

    const { setOnVisualizationExport, setOnVisualizationFullscreen } = useQlikVisualizationContext()
    const {
        settings: { qConfig }
    } = useQlikContext()
    const { qMeta, qTitle, qDescription, qAppId } = useQlikApp(qlikAppId)
    const [viz, setViz] = useState<any>(null)
    const { setVisualizationCreate } = useQlikVisualizationCreate()
    const { setVisualizationExportData } = useQlikVisualizationExportData()
    const { setVisualizationExportImg } = useQlikVisualizationExportImg()
    const { setVisualizationExportPdf } = useQlikVisualizationExportPdf()
    const { setActionsNode, setShowActionsNode } = useQlikActionsContext()
    const targetRef = useRef<any>()
    const { widthC, heightC } = useQlikContainerSize(targetRef)
    const { setVizDefaultOptions } = useVizDefaultOptions()
    const { t } = useI18n()
    const { height: wHeight } = useWindowDimensions()

    const qViz = useRef<any>(null)

    const { classes } = useStyles()

    const createViz = useCallback(
        async (vizType: string, columns: any[], options: any) => {
            try {
                setIsLoading(true)

                if (qViz.current) {
                    await qViz.current.close()
                }

                const defaultOptions = setVizDefaultOptions(vizType)
                const opts = { ...(options || {}), ...defaultOptions }
                const vizNew = await setVisualizationCreate(vizType, columns, opts, qAppId)
                if (vizNew) {
                    qViz.current = vizNew.qVisualization
                    setViz(vizNew.qVisualization)
                }

                return vizNew
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsLoading(false)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    useMount(async () => {
        if (setOnVisualizationExport) setOnVisualizationExport(() => onExport)
        if (setOnVisualizationFullscreen) setOnVisualizationFullscreen(() => onFullscreen)

        if (isToolbarOnPanel) {
            setShowActionsNode(true)
            setActionsNode(toolbarNode)
        }
        await vizHandler(vizOptions)
    })

    useEffect(() => {
        if (shouldRerender) vizHandler(vizOptions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vizOptions])

    const vizHandler = useCallback(
        async vizOptions => {
            if (vizOptions?.vizType) {
                const vizNew = await createViz(
                    vizOptions.vizType,
                    vizOptions.columns,
                    vizOptions.options
                )
                const element = document.getElementById(visualizationElementId)
                if (visualizationElementId && vizNew && element) {
                    await vizNew.show(visualizationElementId)
                    await vizNew.resize()
                }
                if (onCreateVisualizationCallback)
                    onCreateVisualizationCallback(vizNew, visualizationElementId)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [visualizationElementId]
    )

    useUnmount(() => {
        if (setOnVisualizationExport) setOnVisualizationExport(undefined)
        if (setOnVisualizationFullscreen) setOnVisualizationFullscreen(undefined)

        const vis = qViz.current || viz

        if (vis) {
            vis.close()
            qViz.current = null
        }
    })

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

    const [isFullscreen, setIsFullscreen] = useState(false)

    const onFullscreen = async () => {
        setIsFullscreen(true)
        const vizNew = await createViz(vizOptions.vizType, vizOptions?.columns, vizOptions?.options)
        const element = document.getElementById(visualizationElementId)
        if (visualizationElementId && element) {
            await vizNew.show(visualizationElementId)
            await vizNew.resize()
        }
    }

    const onExitFullscreen = async () => {
        setIsFullscreen(false)
        const vizNew = await createViz(vizOptions.vizType, vizOptions?.columns, vizOptions?.options)
        const element = document.getElementById(visualizationElementId)
        if (visualizationElementId && element) {
            await vizNew.show(visualizationElementId)
            await vizNew.resize()
        }
    }

    const isFooterHelper = showAppWaterMark || linkOptions

    const footer = isFooterHelper && (
        <Box
            display="flex"
            width="100%"
            justifyContent="center"
            alignItems="center"
            pl={1}
            pr={1}
            className={`${classes.footNote} ${classNames?.footNote}`}>
            <Box flexGrow={1}></Box>
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

    const renderViz = useCallback(
        () => {
            return (
                <>
                    <div
                        id={visualizationElementId}
                        style={{
                            height: isLoading
                                ? '0px'
                                : isFullscreen || enableFullscreen
                                ? '100%'
                                : 'inherit',
                            width: '100%',
                            padding: '16px'
                        }}
                        className={classes.boxPanel}
                    />
                    {isLoading ? (
                        <div
                            ref={targetRef}
                            style={{
                                height: isFullscreen || enableFullscreen ? '100%' : 'inherit',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '16px',
                                paddingRight: '16px',
                                paddingBottom: '8px',
                                paddingTop: '8px'
                            }}>
                            {ChartLoader(
                                widthC,
                                isFullscreen
                                    ? wHeight - 216
                                    : isFooterHelper
                                    ? heightC - 51
                                    : heightC
                            )}
                        </div>
                    ) : null}
                </>
            )
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [visualizationElementId, targetRef, widthC, heightC, isLoading]
    )

    const toolbarNode = (
        <QlikToolbar
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
            enableFullscreen={enableFullscreen}
            isInline={!isToolbarOnPanel}
            disableToolbarCss={disableToolbarCss}
            className={classNames?.toolbar}
            classNames={{
                icon: classNames?.toolbarIcon || '',
                iconButton: classNames?.toolbarIconButton || ''
            }}
        />
    )

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height={height || '100%'}
            className={classes.boxPanel}>
            {!isToolbarOnPanel && !isLoading && toolbarNode}
            {isFullscreen ? (
                <QlikFullScreenDialog
                    qlikAppId={qAppId}
                    title={fullscreenOptions?.title || ''}
                    isOpen={isFullscreen}
                    exportOptions={
                        exportOptions && {
                            ...exportOptions
                        }
                    }
                    disableEnforceFocus={true}
                    closeTooltipText={t(translations.fullscreenTooltipClose)}
                    css={{ marginTop: '5px' }}
                    onClose={onExitFullscreen}>
                    {renderViz()}
                </QlikFullScreenDialog>
            ) : (
                renderViz()
            )}
            {footer}
        </Box>
    )
}

export default QlikVisualizationApiCore

const useStyles = makeStyles()((theme: Theme) => ({
    boxPanel: {
        background: theme.palette.background.paper
    },
    footNote: {
        backgroundColor: theme.palette.background.default,
        height: '35px'
    },
    footNoteText: {
        fontSize: '0.825rem',
        fontStyle: 'italic',
        color: theme.palette.text.primary
    }
}))
