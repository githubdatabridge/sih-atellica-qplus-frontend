import React, { FC, useEffect, useState } from 'react'

import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { Container, IconButton } from '@mui/material'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Paper from '@mui/material/Paper'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { DraggableDialog, IconTooltip } from '@libs/common-ui'
import { useQlikBookmarkContext } from '@libs/qlik-providers'

import QlikBookmarkShareForm from './components/form/ShareBookmarkForm'
import translation from './constants/translations'
import { TQlikApiBookmarkClasses } from './types'

export interface IQlikApiBookmarkShareDialogProps {
    cssButton?: any
    classNames?: TQlikApiBookmarkClasses
    icon?: React.ReactNode
}

const QlikApiBookmarkShareDialog: FC<IQlikApiBookmarkShareDialogProps> = ({
    cssButton,
    classNames,
    icon
}) => {
    const { classes } = useStyles()
    const [open, setOpen] = useState(false)
    const [count, setCount] = useState(0)
    const { t } = useI18n()
    const { qBookmarkPublicCount } = useQlikBookmarkContext()

    useEffect(() => {
        setCount(qBookmarkPublicCount || 0)
    }, [qBookmarkPublicCount])

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const isDisabled = count === 0

    return (
        <>
            <IconTooltip title={t(translation.dlgShareBookmarkTooltip)}>
                <IconButton
                    color="secondary"
                    aria-label="favorite"
                    component="span"
                    onClick={handleClickOpen}
                    className={classes.iconButton}
                    classes={{
                        root: classNames?.iconButton,
                        disabled: classNames?.iconButtonDisabled
                    }}
                    style={{ ...cssButton }}
                    disabled={isDisabled}
                    size="large">
                    {icon ?? <ShareOutlinedIcon />}
                </IconButton>
            </IconTooltip>
            {open && (
                <DraggableDialog
                    dismissDialogCallback={handleClose}
                    closeTooltipText={t(translation.dialogClose)}
                    dialogProps={{ maxWidth: 'sm' }}
                    title={t(translation.dlgShareDialogTitle)}
                    hideBackdrop={false}>
                    <DialogContent style={{ padding: '0px' }}>
                        <DialogContentText>
                            <Container style={{ padding: '0px' }}>
                                <Paper elevation={0} className={classes.paper}>
                                    <QlikBookmarkShareForm onCloseCallback={handleClose} />
                                </Paper>
                            </Container>
                        </DialogContentText>
                    </DialogContent>
                </DraggableDialog>
            )}
        </>
    )
}

export default QlikApiBookmarkShareDialog

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
