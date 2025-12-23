import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'

import { Paper, Typography, Box, Theme } from '@mui/material'
import { alpha } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import { useBaseUiContext, useI18n } from '@libs/common-providers'
import { FullScreenDialog } from '@libs/common-ui'
import { QVariable } from '@libs/qlik-models'
import { useQlikTitleContext, useQlikActionsContext } from '@libs/qlik-providers'

import R from '../../res/R'
import QlikInputVariable from '../variable/QlikInputVariable'
import QlikSelectVariable from '../variable/QlikSelectVariable'
import translation from './constants/translations'

export type TQlikPanelClasses = {
    paper?: string
    highlightedPaper?: string
    actions?: string
    titleText?: string
    subTitleText?: string
}

export interface IInfoOptions {
    title?: string
    text?: string
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
}

export interface IQlikInternalPanelProps {
    qlikAppId?: string
    variableOptions?: QVariable[]
    title?: string
    subtitle?: string
    highlighted?: boolean
    titleComponent?: ReactNode
    isVisible?: boolean
    showTitles?: boolean
    classNames?: TQlikPanelClasses
    children: ReactNode
}

const QlikPanel: FC<IQlikInternalPanelProps> = ({
    qlikAppId,
    isVisible = true,
    title,
    subtitle,
    showTitles = true,
    children,
    variableOptions,
    highlighted,
    classNames,
    titleComponent
}) => {
    const { t } = useI18n()
    const { classes } = useStyles()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const panelRef = useRef<any>(null)
    const executeScroll = () => panelRef?.current?.scrollIntoView()
    const { qlikTitle, qlikSubtitle, showQlikTitle } = useQlikTitleContext()
    const { actionsNode, showActionsNode } = useQlikActionsContext()
    const {
        cssQlikPanelPaper,
        cssQlikPanelOptions,
        cssQlikPanelTypographyTitle,
        cssQlikPanelTypographySubTitle
    } = useBaseUiContext()
    const onExitFullscreen = () => setIsFullscreen(false)

    useEffect(() => {
        if (highlighted) executeScroll()
    }, [highlighted])

    const panelActions = showActionsNode && (
        <Box display="flex" alignItems="center">
            {actionsNode}
        </Box>
    )

    return (
        <Box className={classes.box}>
            <Paper
                variant="outlined"
                classes={{
                    root: `${
                        highlighted
                            ? `${classes.highlightedPaper} ${classNames?.highlightedPaper}`
                            : `${classes.paper} ${classNames?.paper}`
                    }`
                }}
                style={cssQlikPanelPaper}
                ref={panelRef}>
                {variableOptions && variableOptions.length > 0 ? (
                    <Box display="flex" flexDirection="row">
                        {variableOptions.map((v, i) => {
                            return v.type === 'select' ? (
                                <Box
                                    key={`${v.variableName}`}
                                    width={`${Math.floor(100 / variableOptions.length)}%`}>
                                    <QlikSelectVariable qlikAppId={qlikAppId} variableOptions={v} />
                                </Box>
                            ) : (
                                <Box
                                    key={`${v.variableName}`}
                                    width={`${Math.floor(100 / variableOptions.length)}%`}>
                                    <QlikInputVariable qlikAppId={qlikAppId} variableOptions={v} />
                                </Box>
                            )
                        })}
                    </Box>
                ) : null}
                {isVisible ? (
                    <Box display="flex" flexDirection="column" height="100%">
                        <Box display="flex">
                            <Box
                                display="flex"
                                flexDirection="column"
                                pt={2}
                                flexGrow={1}
                                width="60%">
                                <Box display="flex" alignItems="center">
                                    {showTitles && ((showQlikTitle && qlikTitle) || title) ? (
                                        <Box pl={2}>
                                            <Typography
                                                className={`${classes.boxPanelTitle} ${classNames?.titleText}`}
                                                sx={{ ...cssQlikPanelTypographyTitle }}>
                                                {qlikTitle || title}
                                            </Typography>
                                        </Box>
                                    ) : null}
                                    <Box ml={1}>{titleComponent}</Box>
                                </Box>
                                {showTitles && ((showQlikTitle && qlikSubtitle) || subtitle) ? (
                                    <Box pl={2}>
                                        <Typography
                                            className={`${classes.boxPanelSubTitle} ${classNames?.subTitleText}`}
                                            sx={{ ...cssQlikPanelTypographySubTitle }}>
                                            {qlikSubtitle || subtitle}
                                        </Typography>
                                    </Box>
                                ) : null}
                            </Box>
                            <Box
                                className={`${classes.boxPanelActions} ${classNames?.actions}`}
                                sx={{ ...cssQlikPanelOptions }}>
                                {panelActions}
                            </Box>
                        </Box>
                        {children}
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" height="100%">
                        {children}
                    </Box>
                )}
            </Paper>
            <FullScreenDialog
                isOpen={isFullscreen}
                onClose={onExitFullscreen}
                closeTooltipText={t(translation.fullscreenTooltipClose)}
                disableEnforceFocus={true}>
                {children}
            </FullScreenDialog>
        </Box>
    )
}

export default QlikPanel

const useStyles = makeStyles()((theme: Theme) => ({
    box: {
        height: '100%',
        width: '100%'
    },
    paper: {
        border: `1px solid #ececec`,
        borderRadius: '8px',
        backgroundColor: theme.palette.background.paper,
        height: '100%'
    },
    highlightedPaper: {
        boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.04) !important',
        border: `2px solid ${alpha(R.colors.socialGreen, 1)}`,
        borderRadius: '8px'
    },

    boxPanelActions: {
        display: 'flex',
        alignItems: 'center',
        borderTop: 'none',
        borderRight: 'none',
        borderRadius: '0 0 0 4px',
        height: '40px',
        '@media (max-width: 1100px)': {
            '& svg': {
                height: '12px !important'
            }
        }
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        '@media (max-width: 500px)': {
            flexDirection: 'column',
            alignItems: 'start',
            marginBottom: '5px'
        }
    },
    boxPanelTitle: {
        fontWeight: 500,
        fontSize: 18,
        opacity: 0.7,
        marginRight: '8px',
        '@media (max-width: 1100px)': {
            fontSize: 16
        },
        '@media (max-width: 500px)': {
            marginRight: '0px',
            marginBottom: '5px'
        },
        '@media (max-width: 330px)': {
            fontSize: 11
        }
    },
    boxPanelSubTitle: {
        fontSize: 14,
        opacity: 0.4,
        fontWeight: 500,
        '@media (max-width: 500px)': {
            fontSize: 12
        },
        '@media (max-width: 330px)': {
            fontSize: 11
        }
    }
}))
