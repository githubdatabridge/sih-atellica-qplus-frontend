import React, { FC } from 'react'

import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import ErrorIcon from '@mui/icons-material/Error'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import { Box, Paper, Typography, Button, IconButton, useTheme, Theme } from '@mui/material'

import { useI18n } from '@libs/common-providers'

import { IconTooltip } from '../../ui'
import { useAlertContext } from './AlertContext'
import translations from './constants/translations'

export interface IAlertProps {
    severity: any
    onClose: () => void
    title: string
    message: string
    actionUrl?: string | null
}

const Alert: FC<IAlertProps> = ({ title, severity, onClose, message, actionUrl }) => {
    const {
        alertPaperCss,
        alertPaperElevation,
        alertInfoIcon,
        alertErrorIcon,
        alertWarningIcon,
        alertSuccessIcon
    } = useAlertContext()
    const { t } = useI18n()

    const theme = useTheme()

    const alertTypes = {
        success: {
            bgColor: alertSuccessIcon?.bgColor || 'transparent',
            icon: alertSuccessIcon?.icon,
            defaultIcon: CheckCircleIcon,
            fill: alertSuccessIcon?.fillColor || 'rgb(0, 154, 56)',
            titleCss: alertSuccessIcon?.titleCss || {
                fontWeight: 'bold',
                fontSize: '16px',
                textTransform: 'capitalize'
            },
            messageCss: alertSuccessIcon?.contentCss || {
                fontSize: '14px',
                color: theme.palette.text.primary
            },
            actionButtonCss: alertSuccessIcon?.actionButtonCss || { textTransform: 'capitalize' }
        },
        info: {
            bgColor: alertInfoIcon?.bgColor || 'transparent',
            icon: alertInfoIcon?.icon,
            defaultIcon: InfoIcon,
            fill: alertInfoIcon?.fillColor || '#99D9E6',
            titleCss: alertInfoIcon?.titleCss || {
                fontWeight: 'bold',
                fontSize: '16px',
                textTransform: 'capitalize'
            },
            messageCss: alertInfoIcon?.contentCss || {
                fontSize: '14px',
                color: theme.palette.text.primary
            },
            actionButtonCss: alertInfoIcon?.actionButtonCss || { textTransform: 'capitalize' }
        },
        warning: {
            bgColor: alertWarningIcon?.bgColor || 'transparent',
            icon: alertWarningIcon?.icon,
            defaultIcon: WarningIcon,
            fill: alertWarningIcon?.fillColor || 'rgb(255, 210, 0)',
            titleCss: alertWarningIcon?.titleCss || {
                fontWeight: 'bold',
                fontSize: '16px',
                textTransform: 'capitalize'
            },
            messageCss: alertWarningIcon?.contentCss || {
                fontSize: '14px',
                color: theme.palette.text.primary
            },
            actionButtonCss: alertWarningIcon?.actionButtonCss || { textTransform: 'capitalize' }
        },
        error: {
            bgColor: alertErrorIcon?.bgColor || 'transparent',
            icon: alertErrorIcon?.icon,
            defaultIcon: ErrorIcon,
            fill: alertErrorIcon?.fillColor || 'rgb(231, 0, 29)',
            titleCss: alertErrorIcon?.titleCss || {
                fontWeight: 'bold',
                fontSize: '16px',
                textTransform: 'capitalize'
            },
            messageCss: alertErrorIcon?.contentCss || {
                fontSize: '14px',
                color: theme.palette.text.primary
            },
            actionButtonCss: alertErrorIcon?.actionButtonCss || { textTransform: 'capitalize' }
        }
    }

    const DefaultIcon = alertTypes[severity].defaultIcon

    return (
        <Paper
            elevation={alertPaperElevation || 4}
            style={alertPaperCss || { minWidth: '400px', overflow: 'hidden' }}>
            <Box display="flex" pt={2}>
                <Box
                    display="flex"
                    flexDirection="column"
                    bgcolor={alertTypes[severity].bgColor}
                    pl={2}>
                    {alertTypes[severity].icon || (
                        <DefaultIcon
                            width={24}
                            height={24}
                            style={{ fill: alertTypes[severity].fill }}
                        />
                    )}
                </Box>
                <Box display="flex" flexDirection="column" minWidth="250px" pl={1}>
                    <Typography style={alertTypes[severity].titleCss}>
                        {title?.toLowerCase()}
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    width="100%"
                    height="100%"
                    justifyContent="center"
                    alignItems="center">
                    <Box style={{ marginTop: '-5px' }}>
                        <IconTooltip title="Close">
                            <IconButton onClick={onClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </IconTooltip>
                    </Box>
                </Box>
            </Box>
            <Box pl={2} pb={3} pr={2}>
                <Typography color="textSecondary" style={alertTypes[severity].messageCss}>
                    {ReactHtmlParser(message) || ''}
                </Typography>
                {actionUrl && (
                    <Box display="flex" alignItems="center" mt={2} justifyContent="flex-end">
                        <Link to={actionUrl}>
                            <Button
                                variant="contained"
                                color={'secondary'}
                                style={alertTypes[severity]?.actionButtonCss}>
                                {t(translations.actionButtonLabel)}
                            </Button>
                        </Link>
                    </Box>
                )}
            </Box>
        </Paper>
    )
}

export default Alert
