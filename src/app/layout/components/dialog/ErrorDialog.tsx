import React, { FC, useState, useEffect } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Button, Typography, Box, useTheme, Theme } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import { QplusBaseDraggableDialog } from '@databridge/qplus'

export interface IErrorDialogProps {
    isOpen: boolean
    title: string
    primaryText: string
    secondaryText: string
    buttonText: string
    handleCloseCallback?: (isOpen: boolean) => void
}

export const ErrorDialog: FC<IErrorDialogProps> = ({
    isOpen,
    title,
    primaryText,
    secondaryText,
    buttonText,
    handleCloseCallback
}) => {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { classes } = useStyles()

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

    const handleClose = () => {
        setOpen(false)
        setIsLoading(false)
        if (handleCloseCallback) handleCloseCallback(false)
    }

    const theme = useTheme()

    return open ? (
        <QplusBaseDraggableDialog
            dismissDialogCallback={handleClose}
            closeTooltipText={'Close'}
            title={title}
            hideBackdrop={false}
            cssPaper={{ minHeight: '450px' }}>
            <Box width="100%" height="100%">
                <Box p={1} textAlign="center">
                    <ErrorIcon
                        style={{ width: 150, height: 150, color: theme.palette.info.dark }}
                    />
                </Box>
                <Box p={1} textAlign="center">
                    <Box>
                        <Typography
                            color="primary"
                            variant="h5"
                            className={classes.permissionTitle}>
                            {primaryText}
                        </Typography>
                    </Box>
                    <Box p={1}>
                        <Typography
                            color="primary"
                            component="span"
                            className={classes.permissionDescription}>
                            {secondaryText}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    mb={4}
                    mt={2}
                    display="flex"
                    justifyContent="center"
                    className={classes.buttonBox}>
                    <Button
                        onClick={handleClose}
                        className={classes.buttonAction}
                        disabled={isLoading}>
                        {buttonText}
                    </Button>
                </Box>
            </Box>
        </QplusBaseDraggableDialog>
    ) : null
}

export default ErrorDialog

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%'
    },
    draggablePaper: { zIndex: 1150 },
    rowLayout: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center' // To be vertically aligned
    },
    paper: {
        width: '700px',
        height: '600px',
        padding: '0px',
        zIndex: 99999
    },
    textField: {
        fontWeight: 500
    },
    box: {
        textAlign: 'center',
        borderBottom: '1px solid #ebebeb',
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingTop: '30px'
    },
    buttonBox: {
        '@media (max-width: 500px)': {
            marginTop: '20px'
        },
        '@media (max-width: 400px)': {
            marginTop: '0px'
        }
    },
    iconButton: {
        cursor: 'pointer'
    },
    iconDraggable: {
        color: theme.palette.common.highlight40
    },
    icon: {
        color: theme.palette.common.primaryText
    },
    inputRoot: {
        color: theme.palette.common.primaryText
    },
    dialogTitle: {
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: '20px',
        letterSpacing: 0,
        top: '5px',
        color: theme.palette.common.primaryText
    },
    permissionTitle: {
        '@media (max-width: 500px)': {
            fontSize: '24px'
        }
    },
    permissionDescription: {
        '@media (max-width: 500px)': {
            fontSize: '12px'
        }
    },
    buttonAction: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '50px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1rem',
        '@media (max-width: 500px)': {
            fontSize: '0.825rem'
        },
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
