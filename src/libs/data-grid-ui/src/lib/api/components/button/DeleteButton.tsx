import React, { FC } from 'react'

import { Button, Theme, lighten } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

interface IDeleteButton {
    isDisabled?: boolean
    label?: string
    handleBulkDeleteCallback: () => void
}

export const DeleteButton: FC<IDeleteButton> = ({
    isDisabled = false,
    label = 'Delete',
    handleBulkDeleteCallback
}) => {
    const { classes } = useStyles()

    return (
        <Button
            color="secondary"
            className={isDisabled ? classes.buttonDisabled : classes.buttonDelete}
            sx={{ ml: 1 }}
            disabled={isDisabled}
            onClick={handleBulkDeleteCallback}>
            {label}
        </Button>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    buttonDisabled: {
        height: '34px',
        borderRadius: '4px',
        minWidth: '100px',
        border: `1px solid ${lighten(theme.palette.text.primary, 0.6)}`,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        textTransform: 'none',
        '&:hover': {
            border: `1px solid ${lighten(theme.palette.text.primary, 0.6)}`,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            boxShadow: 'none'
        },
        '&:focus': {
            border: `1px solid ${lighten(theme.palette.text.primary, 0.6)}`,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            boxShadow: 'none'
        }
    },
    buttonDelete: {
        height: '34px',
        borderRadius: '4px',
        minWidth: '100px',
        border: `1px solid ${theme.palette.text.primary}`,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        textTransform: 'none',
        '&:hover': {
            border: `1px solid ${theme.palette.text.primary}`,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            boxShadow: 'none'
        },
        '&:focus': {
            border: `1px solid ${theme.palette.text.primary}`,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            boxShadow: 'none'
        }
    }
}))
