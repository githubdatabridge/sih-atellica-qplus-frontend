import React, { FC, useEffect, useState } from 'react'

import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Container, IconButton } from '@mui/material'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { DraggableDialog, IconTooltip } from '@libs/common-ui'
import { useQlikApp, useQlikSelectionContext } from '@libs/qlik-providers'

import CreateBookmarkForm from './components/form/CreateBookmarkForm'
import translation from './constants/translations'
import { TQlikBookmarkClasses } from './types'

export interface IQlikBookmarkCreateDialogProps {
    qlikAppId?: string
    color?: 'secondary' | 'primary' | 'info' | 'error' | 'success' | 'warning'
    cssButton?: any
    classNames?: TQlikBookmarkClasses
    icon?: React.ReactNode
    hideBackdrop?: boolean
}

const QlikBookmarkCreateDialog: FC<IQlikBookmarkCreateDialogProps> = ({
    qlikAppId = '',
    color,
    cssButton,
    classNames,
    icon,
    hideBackdrop = false
}) => {
    const [appId, setAppId] = useState<string>(qlikAppId)
    const [open, setOpen] = useState<boolean>(false)
    const [count, setCount] = useState<number>(0)
    const theme = useTheme()
    const [activeColor, setActiveColor] = useState<string>(theme.palette.secondary.main)
    const { qAppId } = useQlikApp(qlikAppId)
    const { qSelectionMap, qIsSelectionMapLoading } = useQlikSelectionContext()
    const { t } = useI18n()

    useEffect(() => {
        setAppId(qAppId)
    }, [qAppId])

    useEffect(() => {
        if (!qIsSelectionMapLoading && qSelectionMap?.size > 0) {
            const selection = qSelectionMap.get(appId)
            setCount(selection?.qSelectionCount || 0)
        }
    }, [appId, qIsSelectionMapLoading, qSelectionMap])

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const onMouseFavoriteEnterHandler = () => {
        setActiveColor(theme.palette.secondary.main)
    }

    const onMouseFavoriteLeaveHandler = () => {
        setActiveColor(theme.palette.secondary.main)
    }

    const handleOnBookmarkCreationCallback = (r: any) => {
        if (r) {
            setOpen(false)
        }
    }

    const { classes } = useStyles()

    const isDisabled = count === 0

    return (
        <>
            <IconTooltip title={t(translation.createTooltip)}>
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
                    style={{ ...cssButton, color: !isDisabled ? activeColor : null, bottom: '1px' }}
                    disabled={isDisabled}
                    size="large">
                    {isDisabled
                        ? icon ?? <FavoriteBorderIcon />
                        : icon ?? (
                              <FavoriteIcon
                                  onMouseEnter={onMouseFavoriteEnterHandler}
                                  onMouseLeave={onMouseFavoriteLeaveHandler}
                              />
                          )}
                </IconButton>
            </IconTooltip>
            {open && (
                <DraggableDialog
                    dismissDialogCallback={handleClose}
                    closeTooltipText={t('qplus-dialog-close')}
                    dialogProps={{ maxWidth: 'sm' }}
                    title={t(translation.dlgCreateTitle)}
                    hideBackdrop={hideBackdrop}>
                    <DialogContent style={{ padding: '0px' }}>
                        <DialogContentText>
                            <Container style={{ padding: '0px' }}>
                                <Paper elevation={0} className={classes.paper}>
                                    <CreateBookmarkForm
                                        qlikAppId={appId}
                                        color={color}
                                        onCallbackSubmit={handleOnBookmarkCreationCallback}
                                        classNames={{
                                            buttonCancel: classNames?.buttonCancel || '',
                                            buttonProgress: classNames?.buttonProgress || '',
                                            buttonSave: classNames?.buttonSave || ''
                                        }}
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

export default QlikBookmarkCreateDialog

const useStyles = makeStyles()((theme: any) => ({
    paper: {
        flexGrow: 1,
        width: '100%',
        minHeight: '410px',
        overflow: 'hidden'
    },
    iconButton: {
        cursor: 'pointer'
    }
}))
