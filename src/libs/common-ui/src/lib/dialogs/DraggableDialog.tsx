import React, { ReactNode, useEffect, useState } from 'react'

import Draggable from 'react-draggable'
import { useNavigate } from 'react-router-dom'

import CloseIcon from '@mui/icons-material/Close'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { Box, Modal, Theme } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Paper, { PaperProps } from '@mui/material/Paper'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

import { useBaseUiContext, useI18n } from '@libs/common-providers'

import { IconTooltip } from '../ui'
import translation from './constants/translations'

const useStyles = makeStyles()((theme: Theme) => ({
    paper: { pointerEvents: 'auto', minHeight: '20vh', maxHeight: '80vh' },
    draggablePaper: { zIndex: 1100 },
    icon: {
        color: theme.palette.primary.contrastText
    },
    appBar: {
        boxShadow: 'none',
        position: 'relative',
        backgroundColor: theme.palette.primary.main
    },
    rightAlignDialog: {
        justifyContent: 'flex-end',
        paddingRight: '0'
    }
}))

export interface IDraggableDialogProps {
    isOpen?: boolean
    pageId?: string
    searchParams?: URLSearchParams
    title?: string
    dialogProps?: Partial<DialogProps>
    dismissDialogCallback?(isModal: boolean): any
    hideBackdrop?: boolean
    closeTooltipText?: string
    rightAlign?: boolean
    cssPaper?: any
    children: ReactNode
}

export const DraggableDialog: React.FC<IDraggableDialogProps> = ({
    isOpen = true,
    pageId,
    searchParams,
    title,
    children,
    closeTooltipText,
    dismissDialogCallback = null,
    dialogProps = { maxWidth: 'sm' },
    hideBackdrop = true,
    rightAlign = false,
    cssPaper = null
}) => {
    const navigate = useNavigate()
    const { classes } = useStyles()
    const { cssDialogRoot, cssDialogPaper, cssDialogAppBar, cssDialogIcon, cssDialogTitle } =
        useBaseUiContext()
    const [open, setOpen] = useState(isOpen)
    const { t } = useI18n()

    const useOverrideStyles = makeStyles()((theme: Theme) => ({
        overrideRoot: {
            pointerEvents: 'none',
            ...cssDialogRoot
        },
        overridePaper: {
            pointerEvents: 'auto',
            minHeight: '20vh',
            maxHeight: '80vh',
            ...cssDialogPaper,
            ...cssPaper
        }
    }))

    const closeDialogHandlerHelper = () => {
        if (pageId) {
            const queryParams = searchParams ? `?${searchParams?.toString()}` : ''
            navigate(`${pageId}${queryParams}`)
        }
        setOpen(false)
        if (dismissDialogCallback) {
            dismissDialogCallback(false)
        }
    }

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            event.stopPropagation()
            return false
        }
        closeDialogHandlerHelper()
    }

    const handleCloseButtonClick = () => {
        closeDialogHandlerHelper()
    }

    const { classes: classesOverride } = useOverrideStyles()

    return (
        <Modal open={open} onClose={handleClose}>
            <Dialog
                classes={{
                    root: classesOverride.overrideRoot,
                    paper: cssPaper ? classesOverride.overridePaper : classes.paper,
                    scrollPaper: rightAlign ? classes.rightAlignDialog : ''
                }}
                hideBackdrop={hideBackdrop}
                open={open}
                onClose={(event, reason) => handleClose(event, reason)}
                PaperComponent={DraggablePaper}
                TransitionComponent={Transition}
                aria-labelledby="drag-icon"
                {...dialogProps}
                fullWidth
                disableAutoFocus={true}
                disableEnforceFocus={false}>
                <AppBar className={classes.appBar} style={{ ...cssDialogAppBar }}>
                    <Box display="flex" alignItems="center" flexGrow="1">
                        <IconButton
                            aria-label="drag"
                            disableFocusRipple
                            disableRipple
                            disableTouchRipple>
                            <DragHandleIcon
                                id="drag-icon"
                                className={classes.icon}
                                style={{ cursor: 'move', ...cssDialogIcon }}
                            />
                        </IconButton>
                        <Typography variant="h6" style={{ ...cssDialogTitle }}>
                            {title}
                        </Typography>
                        <Box
                            display="flex"
                            alignItems="center"
                            flexGrow="1"
                            justifyContent="flex-end">
                            <IconTooltip title={closeTooltipText || t(translation.close)}>
                                <IconButton aria-label="close" onClick={handleCloseButtonClick}>
                                    <CloseIcon
                                        className={classes.icon}
                                        style={{ ...cssDialogIcon }}
                                    />
                                </IconButton>
                            </IconTooltip>
                        </Box>
                    </Box>
                </AppBar>
                {children}
            </Dialog>
        </Modal>
    )
}

const DraggablePaper = (props: PaperProps) => {
    const { classes } = useStyles()
    const { cssDialogPaper } = useBaseUiContext()

    return (
        <Draggable handle="#drag-icon" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper
                {...props}
                classes={{ root: classes.draggablePaper }}
                style={{ ...cssDialogPaper }}
                id="comment-dialog"
            />
        </Draggable>
    )
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default DraggableDialog
