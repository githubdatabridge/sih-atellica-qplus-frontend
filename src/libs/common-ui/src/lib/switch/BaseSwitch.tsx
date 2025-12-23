import React from 'react'

import { Switch } from '@mui/material'

import { withStyles } from 'tss-react/mui'

export const BaseSwitch = withStyles(Switch, theme => ({
    switchBase: {
        color: theme.palette.secondary.main,
        opacity: 0.8,
        '&$checked': {
            color: theme.palette.secondary.main,
            background: theme.palette.secondary.main,
            opacity: 1
        },
        '&$checked + $track': {
            backgroundColor: theme.palette.primary.main,
            opacity: 1
        },
        '&.MuiSwitch-colorSecondary.Mui-disabled + MuiSwitch-checked. + .MuiSwitch-track': {
            backgroundColor: theme.palette.primary.main
        }
    },
    checked: {},
    track: {
        background: theme.palette.text.disabled
    },
    disabled: {}
}))
