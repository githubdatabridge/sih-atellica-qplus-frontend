import React, { FC, useState, useEffect } from 'react'

import Snackbar from '@mui/material/Snackbar'

import { makeStyles } from 'tss-react/mui'

export interface QlikVisualizationSnackbarProps {
    k?: number
    message?: string
}

const QlikVisualizationSnackbar: FC<QlikVisualizationSnackbarProps> = ({ k, message }) => {
    const [snackPack, setSnackPack] = useState([])
    const [open, setOpen] = useState<boolean>(false)
    const [messageInfo, setMessageInfo] = useState(undefined)
    const { classes } = useStyles()

    useEffect(() => {
        if (snackPack.length && !messageInfo) {
            setMessageInfo({ ...snackPack[0] })
            setSnackPack(prev => prev.slice(1))
            setOpen(true)
        } else if (snackPack.length && messageInfo && open) {
            setOpen(false)
        }
    }, [snackPack, messageInfo, open])

    useEffect(() => {
        if (k > 0) setSnackPack(prev => [...prev, { message, k }])
        return () => {}
    }, [k, message])

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }

    const handleSnackbarExited = () => {
        setMessageInfo(undefined)
    }

    return (
        <Snackbar
            key={messageInfo ? messageInfo.k : undefined}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            ContentProps={{
                'aria-describedby': 'message-id',
                className: classes.snackbarContent
            }}
            open={open}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            TransitionProps={{ onExited: handleSnackbarExited }}
            message={messageInfo ? messageInfo.message : undefined}
        />
    )
}

export default QlikVisualizationSnackbar

const useStyles = makeStyles()((theme: any) => ({
    snackbarContent: {
        backgroundColor: theme.palette.primary.main,
        color: '#FFF'
    },
    close: {
        padding: theme.spacing(0.5)
    }
}))
