/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import * as React from 'react'

import { IconButton, Typography, useTheme, Theme } from '@mui/material'
import { alpha } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import { combine } from '../utils'

const useStyles = makeStyles()((theme: Theme) => ({
    leftBorderRadius: {
        borderRadius: '50% 0 0 50%'
    },
    rightBorderRadius: {
        borderRadius: '0 50% 50% 0'
    },
    buttonContainer: {
        display: 'flex'
    },
    button: {
        height: 36,
        width: 36,
        padding: 0
    },
    buttonText: {
        lineHeight: 1.6,
        fontSize: '0.725rem'
    },
    outlined: {
        border: `1px solid ${theme.palette.secondary.main}`,
        backgroundColor: theme.palette.background.default
    },
    filled: {
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText
        },
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText
    },
    highlighted: {
        backgroundColor: alpha(theme.palette.text.primary, 0.1),
        color: theme.palette.text.primary
    },
    contrast: {
        color: theme.palette.primary.contrastText
    }
}))

interface DayProps {
    filled?: boolean
    outlined?: boolean
    highlighted?: boolean
    disabled?: boolean
    startOfRange?: boolean
    endOfRange?: boolean
    onClick?: () => void
    onHover?: () => void
    value: number | string
}

const Day: React.FunctionComponent<DayProps> = ({
    startOfRange,
    endOfRange,
    disabled,
    highlighted,
    outlined,
    filled,
    onClick,
    onHover,
    value
}: DayProps) => {
    const { classes } = useStyles()
    const theme = useTheme()
    return (
        <div
            className={combine(
                classes.buttonContainer,
                startOfRange && classes.leftBorderRadius,
                endOfRange && classes.rightBorderRadius,
                !disabled && highlighted && classes.highlighted
            )}>
            <IconButton
                className={combine(
                    classes.button,
                    !disabled && outlined && classes.outlined,
                    !disabled && filled && classes.filled
                )}
                disabled={disabled}
                onClick={onClick}
                onMouseOver={onHover}
                size="large">
                <Typography
                    sx={{
                        color:
                            !disabled && highlighted && (!startOfRange || !endOfRange)
                                ? theme.palette.secondary.contrastText
                                : null,
                        opacity: !outlined && disabled && !filled ? 0.6 : 1,
                        fontWeight: !outlined ? 500 : 600
                    }}
                    className={combine(classes.buttonText, !disabled && filled && classes.contrast)}
                    variant="body2">
                    {value}
                </Typography>
            </IconButton>
        </div>
    )
}

export default Day
