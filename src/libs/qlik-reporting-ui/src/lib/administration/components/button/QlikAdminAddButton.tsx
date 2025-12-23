import React, { useState } from 'react'

import { Add } from '@mui/icons-material'
import { CircularProgress, Button, Theme, darken } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import translation from '../../constants/translations'

export interface IQlikAdminAddButtonProps {
    disabled?: boolean
    handleOnClickCallback?: () => void
}

const QlikAdminAddButton = ({
    disabled = false,
    handleOnClickCallback
}: IQlikAdminAddButtonProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { classes } = useStyles()
    const { t } = useI18n()

    return (
        <IconTooltip title={t(translation.datasetNew)}>
            <Button
                onClick={handleOnClickCallback}
                disabled={disabled || isLoading}
                className={`${classes.buttonAction} ${
                    disabled || isLoading ? classes.buttonDisabled : ''
                }`}
                startIcon={!isLoading && <Add />}>
                {isLoading ? (
                    <CircularProgress color="inherit" size={24} />
                ) : (
                    t(translation.datasetNew)
                )}
            </Button>
        </IconTooltip>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    buttonAction: {
        margin: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        textTransform: 'capitalize',
        borderRadius: '25px',
        minWidth: '115px',
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
        // Additional styling can go here
    },
    buttonDisabled: {
        color: theme.palette.text.primary,
        backgroundColor: `${theme.palette.action.disabledBackground} !important`, // Overrides the default disabled background
        textTransform: 'capitalize',
        '& .MuiButton-startIcon': {
            color: darken(theme.palette.text.disabled, 0.4) // Applies the disabled text color to the icon as well
        }
    }
    // Adjust or remove other styles that are no longer needed
}))

export default QlikAdminAddButton
