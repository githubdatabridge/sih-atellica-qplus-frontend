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
import { useQlikSelectionContext } from '@libs/qlik-providers'

import CreateBookmarkForm from './components/form/CreateBookmarkForm'
import translation from './constants/translations'
import { TQlikApiBookmarkClasses } from './types'

export type TQlikApiBookmarkOptions = {
    isPrivate?: boolean
    withLayout?: boolean
    withPageNavigation?: boolean
}

export interface IQlikApiBookmarkCreateDialogProps {
    showPublicToggle?: boolean
    showLayoutToggle?: boolean
    showPageToggle?: boolean
    color?: 'secondary' | 'primary' | 'info' | 'error' | 'success' | 'warning'
    cssButton?: any
    defaultOptions?: TQlikApiBookmarkOptions
    classNames?: TQlikApiBookmarkClasses
    icon?: React.ReactNode
    hideBackdrop?: boolean
}

const QlikApiBookmarkCreateDialog: FC<IQlikApiBookmarkCreateDialogProps> = ({
    showPublicToggle = true,
    showLayoutToggle = true,
    showPageToggle = true,
    defaultOptions = {
        isPrivate: true,
        withLayout: true,
        withPageNavigation: true
    },
    color,
    cssButton,
    classNames,
    icon,
    hideBackdrop = false
}) => {
    const { classes } = useStyles()
    const [open, setOpen] = useState(false)
    const [count, setCount] = useState(0)
    const theme = useTheme()
    const [activeColor, setActiveColor] = useState<string>(theme.palette.secondary.main)
    const { t } = useI18n()
    const { qGlobalSelectionCount } = useQlikSelectionContext()

    useEffect(() => {
        setCount(qGlobalSelectionCount || 0)
    }, [qGlobalSelectionCount])

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
                                        color={color}
                                        defaultOptions={defaultOptions}
                                        showPublicToggle={showPublicToggle}
                                        showLayoutToggle={showLayoutToggle}
                                        showPageToggle={showPageToggle}
                                        classNames={{
                                            buttonCancel: classNames?.buttonCancel || '',
                                            buttonProgress: classNames?.buttonProgress || '',
                                            buttonSave: classNames?.buttonSave || ''
                                        }}
                                        onCallbackSubmit={handleOnBookmarkCreationCallback}
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

export default QlikApiBookmarkCreateDialog

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
