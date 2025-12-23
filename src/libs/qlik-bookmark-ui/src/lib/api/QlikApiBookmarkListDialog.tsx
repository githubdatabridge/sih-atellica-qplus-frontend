import React, { FC, useEffect, useState } from 'react'

import GroupAddIcon from '@mui/icons-material/GroupAdd'
import FavoriteListIcon from '@mui/icons-material/PlaylistAddCheck'
import { Container, IconButton } from '@mui/material'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Paper from '@mui/material/Paper'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { DraggableDialog, IconTooltip } from '@libs/common-ui'
import { useQlikBookmarkContext } from '@libs/qlik-providers'

import BookmarkTable from './components/table/BookmarkTable'
import translation from './constants/translations'
import { TQlikApiBookmarkClasses } from './types'

export interface IQlikApiBookmarkDialogProps {
    isSharedWithMe?: boolean
    scopedToPath?: boolean
    cssButton?: any
    classNames?: TQlikApiBookmarkClasses
    icon?: React.ReactNode
    hideBackdrop?: boolean
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
}

const QlikApiBookmarkListDialog: FC<IQlikApiBookmarkDialogProps> = ({
    isSharedWithMe = false,
    scopedToPath = false,
    cssButton,
    classNames,
    icon,
    hideBackdrop = false,
    color = 'secondary'
}) => {
    const { classes } = useStyles()
    const [open, setOpen] = useState(false)
    const [startAnimation, setStartAnimation] = useState<boolean>(false)
    const { animation, setAnimation, setBookmarkContext } = useQlikBookmarkContext()
    const { t } = useI18n()

    useEffect(() => {
        if (!isSharedWithMe) setStartAnimation(!!animation)
    }, [animation, isSharedWithMe])

    useEffect(() => {
        if (startAnimation && !isSharedWithMe) {
            setTimeout(() => {
                setAnimation(false)
            }, 3000)
        }
    }, [setAnimation, isSharedWithMe, startAnimation])

    useEffect(() => {
        setBookmarkContext(scopedToPath)
    }, [scopedToPath, setBookmarkContext])

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <IconTooltip
                title={
                    isSharedWithMe
                        ? t(translation.dlgSharedWithMeTooltip)
                        : t(translation.dlgListTooltip)
                }>
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
                    style={{ ...cssButton, bottom: '1px' }}
                    size="large">
                    {icon ??
                        (isSharedWithMe ? (
                            <GroupAddIcon
                                className={startAnimation ? classes.animation : undefined}
                            />
                        ) : (
                            <FavoriteListIcon
                                className={startAnimation ? classes.animation : undefined}
                            />
                        ))}
                </IconButton>
            </IconTooltip>
            {open && (
                <DraggableDialog
                    dismissDialogCallback={handleClose}
                    closeTooltipText={t(translation.dialogClose)}
                    dialogProps={{ maxWidth: 'lg' }}
                    title={
                        isSharedWithMe
                            ? t(translation.dlgSharedListTitle)
                            : t(translation.dlgListTitle)
                    }
                    hideBackdrop={hideBackdrop}>
                    <DialogContent style={{ padding: '0px' }}>
                        <DialogContentText>
                            <Container style={{ padding: '0px' }}>
                                <Paper elevation={0} className={classes.paper}>
                                    <BookmarkTable
                                        isSharedWithMe={isSharedWithMe}
                                        scopedToPath={scopedToPath}
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

export default QlikApiBookmarkListDialog

const useStyles = makeStyles()((theme: any) => ({
    paper: {
        flexGrow: 1,
        width: '100%',
        minHeight: '500px',
        overflow: 'hidden'
    },

    iconButton: {
        cursor: 'pointer'
    },
    animation: {
        animation: 'bPulse 1.5s infinite'
    }
}))
