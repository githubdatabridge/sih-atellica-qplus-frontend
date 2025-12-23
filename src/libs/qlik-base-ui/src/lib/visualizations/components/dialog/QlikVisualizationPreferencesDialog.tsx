import React, { FC } from 'react'

import { Button, Box, DialogActions, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { DraggableDialog } from '@libs/common-ui'

import QlikVisualizationPreferencesChart from '../../QlikVisualizationPreferences'

interface QlikVisualizationPreferencesDialogProps {
    vizType: string
    color?: string
    handleCloseCallback: () => void
}

const QlikVisualizationPreferencesDialog: FC<QlikVisualizationPreferencesDialogProps> = React.memo(
    ({ vizType, color, handleCloseCallback }) => {
        const { classes } = useStyles()
        const { t } = useI18n()

        const handleClose = () => {
            handleCloseCallback()
        }

        return (
            <DraggableDialog
                dialogProps={{ maxWidth: 'sm' }}
                dismissDialogCallback={handleClose}
                hideBackdrop={false}
                closeTooltipText={t('qplus-dialog-close')}
                title={`Settings -
                                ${vizType?.charAt(0).toUpperCase() + vizType?.slice(1)}`}>
                <Box style={{ padding: '0px', maxHeight: '500px' }} className={classes.scroll}>
                    {vizType ? (
                        <QlikVisualizationPreferencesChart vizType={vizType} color={color} />
                    ) : null}
                </Box>
                <DialogActions className={classes.dialogActions}>
                    <Button onClick={handleClose} className={classes.buttonSave}>
                        {'Close'}
                    </Button>
                </DialogActions>
            </DraggableDialog>
        )
    }
)

export default QlikVisualizationPreferencesDialog

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%'
    },
    scroll: {
        overflow: 'auto'
    },
    dialogActions: {
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`
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
        '&:hover': {
            backgroundColor: `${theme.palette.background.default} !important`,
            color: `${theme.palette.text.primary} !important`,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: `${theme.palette.background.default} !important`,
            color: `${theme.palette.text.primary} !important`,
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
