import { FC } from 'react'

import { Box, Button, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import DraggableDialog from './DraggableDialog'

export interface IConfirmationDialogProps {
    pageId?: string
    searchParams?: URLSearchParams
    primaryText: string
    secondaryText?: string
    yesText?: string
    noText?: string
    dialogTitleText?: string
    hideBackdrop?: boolean
    onClose: () => void
    onYes: () => void
    onNo: () => void
}

export const ConfirmationDialog: FC<IConfirmationDialogProps> = ({
    pageId,
    searchParams,
    primaryText,
    secondaryText,
    onYes,
    onNo,
    onClose,
    yesText,
    dialogTitleText,
    noText,
    hideBackdrop = true
}) => {
    const { classes } = useStyles()

    return (
        <DraggableDialog
            pageId={pageId}
            searchParams={searchParams}
            dismissDialogCallback={onClose}
            title={dialogTitleText}
            hideBackdrop={hideBackdrop}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={4}>
                <Typography className={classes.textPrimary}>{primaryText}</Typography>
                <Box mb={1} />
                {secondaryText && (
                    <Typography className={classes.textSecondary}>{secondaryText}</Typography>
                )}
                <Box mb={1} />

                <Box display="flex" alignItems="center" justifyContent="center">
                    <Button onClick={onNo}>{noText}</Button>
                    <Box mr={1} />
                    <Button onClick={onYes} className={classes.button}>
                        {yesText}
                    </Button>
                </Box>
            </Box>
        </DraggableDialog>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    textPrimary: {
        fontSize: '0.95rem'
    },
    textSecondary: {
        fontSize: '0.925rem'
    },
    button: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.common.white
        }
    }
}))
