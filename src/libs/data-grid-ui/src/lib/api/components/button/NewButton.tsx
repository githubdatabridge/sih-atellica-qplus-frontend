import React, { FC } from 'react'

import { Box, Button, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

interface INewButton {
    label?: string
    handleButtonNewCallback: () => void
}

export const NewButton: FC<INewButton> = ({ label = 'New', handleButtonNewCallback }) => {
    const { classes } = useStyles()

    return (
        <Box flexGrow={1} textAlign="right" alignSelf="center" maxWidth={'125px'}>
            <Button
                color="secondary"
                className={classes.buttonNew}
                sx={{ ml: 1 }}
                onClick={handleButtonNewCallback}>
                {label}
            </Button>
        </Box>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    buttonNew: {
        minWidth: '100px',
        height: '34px',
        borderRadius: '4px',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
            boxShadow: 'none'
        }
    }
}))
