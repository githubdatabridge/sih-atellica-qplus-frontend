import React, { FC } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Theme, useTheme } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

import { useBaseUiContext, useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { useQlikApp } from '@libs/qlik-providers'

import QlikClearButton from '../button/QlikClearButton'
import { IQlikVisualizationCoreExportOptions } from '../visualizations/QlikVisualizationCore'
import QlikToolbarExport from '../visualizations/toolbar/QlikToolbarExport'
import translation from './constants/translations'
import { TQlikFullscreenDialogToolbarOptions, TQlikFullscreenOptions } from './models'

export interface IQlikFullScreenDialogProps {
    isOpen: boolean
    qlikAppId?: string
    exportOptions?: IQlikVisualizationCoreExportOptions
    toolbarOptions?: TQlikFullscreenDialogToolbarOptions
    title?: string
    subTitle?: string
    children?: React.ReactNode
    css?: any
    closeTooltipText?: string
    fixed?: boolean
    showActionBar?: boolean
    options?: TQlikFullscreenOptions
    disableEnforceFocus?: boolean
    onClose: () => void
}

const QlikFullScreenDialog: FC<IQlikFullScreenDialogProps> = React.memo(
    ({
        qlikAppId,
        isOpen,
        title,
        subTitle,
        children,
        css,
        closeTooltipText,
        fixed = false,
        toolbarOptions = {
            showClearAllButton: true,
            showExportButton: true
        },
        showActionBar = false,
        options,
        exportOptions,
        disableEnforceFocus = false,
        onClose
    }) => {
        const {
            cssFullscreenDialog,
            cssFullscreenDialogAppBar,
            cssFullscreenDialogToolbar,
            cssFullscreenDialogButtonIcon,
            cssFullscreenDialogIcon,
            cssFullscreenDialogTitle,
            cssFullscreenDialogSubTitle,
            cssFullscreenDialogActionBar,
            eraseNode
        } = useBaseUiContext()
        const { qAppId } = useQlikApp(qlikAppId)
        const { t } = useI18n()

        const position = fixed ? 'fixed' : 'relative'
        const { classes } = useStyles()
        const theme = useTheme()

        return (
            <Dialog
                fullScreen
                open={isOpen}
                onClose={onClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                disableEnforceFocus={disableEnforceFocus}
                style={{ zIndex: 1019, overflow: 'auto', ...cssFullscreenDialog }}>
                <Box display="flex" flexDirection="column" height="100%">
                    <AppBar position={position} sx={{ ...cssFullscreenDialogAppBar }}>
                        <Toolbar
                            sx={{
                                ...cssFullscreenDialogToolbar
                            }}>
                            <Box display="flex" width="100%" alignItems="center">
                                <Box flexGrow="1">
                                    <Typography
                                        variant="h6"
                                        sx={{ flexGrow: 1, ...cssFullscreenDialogTitle }}>
                                        {title}
                                    </Typography>
                                    {subTitle && (
                                        <Typography
                                            sx={{
                                                fontSize: '0.925rem',
                                                color: theme.palette.text.primary,
                                                flexGrow: 1,
                                                ...cssFullscreenDialogSubTitle
                                            }}>
                                            {subTitle}
                                        </Typography>
                                    )}
                                </Box>
                                <Box pr={1}>
                                    {toolbarOptions?.showClearAllButton && (
                                        <QlikClearButton
                                            qlikAppId={qAppId}
                                            icon={eraseNode}
                                            cssIcon={{
                                                ...cssFullscreenDialogIcon
                                            }}
                                            showWithNoSelections={false}
                                            cssButtonIcon={{
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                '&:hover': {
                                                    bgcolor: 'primary.main',
                                                    ...cssFullscreenDialogButtonIcon
                                                },
                                                cursor: 'pointer',
                                                ...cssFullscreenDialogButtonIcon
                                            }}
                                        />
                                    )}
                                </Box>
                                <Box pr={1}>
                                    {exportOptions?.types && toolbarOptions?.showExportButton ? (
                                        <QlikToolbarExport
                                            types={exportOptions?.types || []}
                                            color={exportOptions?.color || 'secondary'}
                                            cssIcon={{
                                                ...cssFullscreenDialogIcon
                                            }}
                                            cssButtonIcon={{
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                '&:hover': {
                                                    bgcolor: 'primary.main',
                                                    ...cssFullscreenDialogButtonIcon
                                                },
                                                cursor: 'pointer',
                                                ...cssFullscreenDialogButtonIcon
                                            }}
                                        />
                                    ) : null}
                                </Box>

                                <Box>
                                    <IconTooltip title={closeTooltipText}>
                                        <IconButton
                                            edge="start"
                                            color="inherit"
                                            onClick={onClose}
                                            aria-label="close"
                                            tabIndex={-5}
                                            size="large"
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                '&:hover': {
                                                    bgcolor: 'primary.main',
                                                    ...cssFullscreenDialogButtonIcon
                                                },
                                                ...cssFullscreenDialogButtonIcon
                                            }}>
                                            <CloseIcon sx={{ ...cssFullscreenDialogIcon }} />
                                        </IconButton>
                                    </IconTooltip>
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    <Box
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                        flexGrow="1"
                        width="100%"
                        style={css}>
                        {isOpen && children}
                    </Box>
                    <Box
                        mb={2}
                        mt={5}
                        display="flex"
                        justifyContent="flex-end"
                        mr={2}
                        sx={{
                            display: showActionBar ? 'flex' : 'none',
                            ...cssFullscreenDialogActionBar
                        }}>
                        <Button onClick={onClose} className={classes.buttonClose}>
                            {t(translation.dialogFullscreenClose)}
                        </Button>
                    </Box>
                </Box>
                {options?.customComponent}
            </Dialog>
        )
    }
)

const useStyles = makeStyles()((theme: Theme) => ({
    customBadge: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        top: '12px',
        right: '10px'
    },
    buttonClose: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '16px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            boxShadow: 'none'
        }
    }
}))

export default QlikFullScreenDialog
