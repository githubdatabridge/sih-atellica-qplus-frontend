import React, { FC, useState, useEffect } from 'react'

import FavoriteListIcon from '@mui/icons-material/PlaylistAddCheck'
import { Container, IconButton } from '@mui/material'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Paper from '@mui/material/Paper'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { DraggableDialog, IconTooltip } from '@libs/common-ui'
import { useQlikApp } from '@libs/qlik-providers'

import BookmarkTable from './components/table/BookmarkTable'
import translation from './constants/translations'
import { TQlikBookmarkClasses } from './types'

export interface IQlikBookmarkDialogProps {
    qlikAppId?: string
    cssButton?: any
    classNames?: TQlikBookmarkClasses
    icon?: React.ReactNode
    hideBackdrop?: boolean
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
}

const QlikBookmarkListDialog: FC<IQlikBookmarkDialogProps> = ({
    qlikAppId,
    cssButton,
    classNames,
    icon,
    hideBackdrop = false,
    color = 'secondary'
}) => {
    const [appId, setAppId] = useState<string>('')
    const { qAppId } = useQlikApp(qlikAppId)
    const { classes } = useStyles()
    const [open, setOpen] = useState(false)
    const { t } = useI18n()

    useEffect(() => {
        setAppId(qAppId)
    }, [qAppId])

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <IconTooltip title={t(translation.dlgListTooltip)}>
                <IconButton
                    color="secondary"
                    aria-label="favorite"
                    component="span"
                    onClick={handleClickOpen}
                    className={classes.iconButton}
                    classes={{
                        root: classNames?.iconButton || '',
                        disabled: classNames?.iconButtonDisabled || ''
                    }}
                    style={{ ...cssButton, bottom: '1px' }}
                    size="large">
                    {icon ?? <FavoriteListIcon />}
                </IconButton>
            </IconTooltip>
            {open && (
                <DraggableDialog
                    dismissDialogCallback={handleClose}
                    closeTooltipText={t(translation.dialogClose)}
                    dialogProps={{ maxWidth: 'lg' }}
                    title={t(translation.dlgListTitle)}
                    hideBackdrop={hideBackdrop}>
                    <DialogContent style={{ padding: '0px' }}>
                        <DialogContentText>
                            <Container style={{ padding: '0px' }}>
                                <Paper elevation={0} className={classes.paper}>
                                    <BookmarkTable
                                        qlikAppId={appId}
                                        onRestoreCallback={handleClose}
                                        color={color}
                                        classNames={classNames}
                                    />
                                </Paper>
                            </Container>
                        </DialogContentText>
                    </DialogContent>
                </DraggableDialog>
            )}
        </>
    )
}

export default QlikBookmarkListDialog

const useStyles = makeStyles()((theme: any) => ({
    paper: {
        flexGrow: 1,
        width: '100%',
        minHeight: '500px',
        overflow: 'hidden'
    },

    iconButton: {
        cursor: 'pointer'
    }
}))
