import React, { FC } from 'react'

import { useLocation } from 'react-router-dom'

import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Button, Box, DialogActions, Theme, darken } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { DraggableDialog, IconTooltip } from '@libs/common-ui'

import translation from '../../constants/translations'
import { useQlikReportingUiContext } from '../../contexts/QlikReportingUiContext'
import QlikReportingPreferencesOptions from '../options/QlikReportingPreferencesOptions'

type TQlikReportingPreferencesClasses = {
    settingsButton: string
    settingsButtonDisabled: string
    buttonSave: string
    buttonCancel: string
}

interface IQlikReportingPreferencesDialogProps {
    isEnabled: boolean
    vizType: string
    color?: any
    classNames?: Partial<TQlikReportingPreferencesClasses>
}

const QlikReportingPreferencesDialog: FC<IQlikReportingPreferencesDialogProps> = React.memo(
    ({ classNames, isEnabled, vizType, color }) => {
        const [, setValue] = React.useState<any>(0)
        const [open, setOpen] = React.useState(false)
        const { reportingTuneNode } = useQlikReportingUiContext()
        const location = useLocation()
        const searchParams = new URLSearchParams(window.location.search)

        const { classes } = useStyles()

        const { t } = useI18n()

        const handleClickOpen = () => {
            setValue(0)
            setOpen(true)
        }

        const handleClose = () => {
            setOpen(false)
        }

        return (
            <>
                <IconTooltip title={t(translation.reportingToolbarTuneTooltip)} placement="right">
                    <IconButton
                        color={color}
                        aria-label="favorite"
                        component="span"
                        onClick={handleClickOpen}
                        className={
                            isEnabled
                                ? `${classes.iconButton} ${classNames?.settingsButton || ''}`
                                : `${classes.iconButtonDisabled} ${
                                      classNames?.settingsButtonDisabled || ''
                                  }`
                        }
                        style={{
                            width: '100%',
                            height: '50px'
                        }}
                        disabled={!isEnabled}>
                        {reportingTuneNode || <SettingsIcon width={24} height={24} />}
                    </IconButton>
                </IconTooltip>
                {open && (
                    <DraggableDialog
                        dialogProps={{ maxWidth: 'sm' }}
                        dismissDialogCallback={handleClose}
                        closeTooltipText={t('qplus-dialog-close')}
                        hideBackdrop={false}
                        pageId={location.pathname}
                        searchParams={searchParams}
                        title={`${t(translation.reportingDialogSettingsTitle)}${' '}
                                ${vizType?.charAt(0).toUpperCase() + vizType?.slice(1)}`}>
                        <Box
                            style={{ padding: '0px', maxHeight: '500px' }}
                            className={classes.scroll}>
                            {vizType ? (
                                <QlikReportingPreferencesOptions vizType={vizType} color={color} />
                            ) : null}
                        </Box>
                        <DialogActions className={classes.dialogActions}>
                            <Button
                                onClick={handleClose}
                                className={`${classes.buttonCancel} ${
                                    classNames?.buttonCancel || ''
                                }`}>
                                {t(translation.reportingDialogSettingsBtnCancel)}
                            </Button>
                            <Button
                                onClick={handleClose}
                                className={`${classes.buttonSave} ${classNames?.buttonSave || ''}`}
                                color={color}>
                                {t(translation.reportingDialogSettingsBtnClose)}
                            </Button>
                        </DialogActions>
                    </DraggableDialog>
                )}
            </>
        )
    }
)

export default QlikReportingPreferencesDialog

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%'
    },
    backDrop: {
        background: 'rgba(0,0,0,0.25)'
    },
    rowLayout: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center' // To be vertically aligned
    },
    paper: {
        minWidth: '450px',
        minHeight: '500px',
        padding: '0px',
        maxHeight: '600px'
    },
    dialogActions: {
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`
    },
    scroll: {
        overflow: 'auto'
    },

    buttonCancel: {
        marginRight: '20px',
        paddingLeft: '25px',
        paddingRight: '25px',
        minWidth: '96px',
        height: '36px',
        borderRadius: '25px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: `${theme.palette.background.default} !important`,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: `${theme.palette.background.default} !important`,
            boxShadow: 'none'
        }
    },
    buttonSave: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText,
        textTransform: 'none',
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
    },
    iconButton: {
        width: '100%',
        borderRadius: '0px',
        cursor: 'pointer',
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText
        }
    },
    iconButtonDisabled: {
        width: '100%',
        borderRadius: '0px',
        cursor: 'pointer',
        borderBottom: `1px solid ${darken(theme.palette.divider, 0.1)}`
    }
}))
