import React, { FC } from 'react'

import InfoIcon from '@mui/icons-material/Info'
import { IconButton, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

interface IQlikReportingInfoIconButtonProps {
    isOpen?: boolean
    isCreated?: boolean
}

const QlikReportingInfoIconButton: FC<IQlikReportingInfoIconButtonProps> = ({
    isOpen = true,
    isCreated = false
}) => {
    const { classes } = useStyles()

    return (
        <IconButton
            color="primary"
            aria-label="locker"
            component="span"
            classes={{
                root: isOpen && !isCreated ? classes.iconButton : classes.iconButtonLocked
            }}>
            <InfoIcon />
        </IconButton>
    )
}

export default QlikReportingInfoIconButton

const useStyles = makeStyles()((theme: Theme) => ({
    iconText: {
        fontSize: '0.9rem'
    },
    infoIcon: {
        width: '15px',
        height: '15px'
    },
    iconButton: {
        width: '20px',
        height: '20px',
        '&:hover': {
            backgroundColor: 'transparent'
        },
        '&:hover $icon': {
            color: 'rgba(0, 0, 0, 0.9) !important'
        }
    },
    iconButtonLocked: {
        width: '20px',
        height: '20px',
        backgroundColor: 'transparent',
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.primary.contrastText
        },
        '&:hover $icon': {
            color: theme.palette.primary.contrastText
        }
    },
    icon: {
        minWidth: '40px'
    }
}))
