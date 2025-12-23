import React from 'react'

import Snackbar, { SnackbarProps } from '@mui/material/Snackbar'
import { Box } from '@mui/system'

import Alert from '../Alert/Alert'

export interface IToastProps {
    open: boolean
    autoHideDuration?: number
    onClose: () => void
    severity: any
    message: string
    actionUrl?: string | null
}

const Toast: React.FC<IToastProps & SnackbarProps> = ({
    open,
    autoHideDuration = 3000,
    onClose,
    severity,
    message,
    actionUrl,
    ...snackbarProps
}) => {
    return open ? (
        <Snackbar
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            {...snackbarProps}>
            <Box ref={snackbarProps.ref}>
                <Alert
                    severity={severity}
                    onClose={onClose}
                    title={severity.toLocaleUpperCase()}
                    message={message}
                    actionUrl={actionUrl}
                />
            </Box>
        </Snackbar>
    ) : null
}

export default Toast
