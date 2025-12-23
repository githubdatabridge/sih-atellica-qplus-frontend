import React, { FC, useState, useEffect } from 'react'

import { useMount } from 'react-use'

import { Grid, Typography, Slider, useTheme, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        width: '100%',
        paddingTop: '20px'
    },
    input: {
        width: 42
    },
    valueLabel: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText
    }
}))

interface Props {
    defaultValue?: number
    minValue?: number
    maxValue?: number
    label: string
    name: string
    step?: number
    color?: string
    isNumber?: boolean
    onSliderChangeCallback?: (value: number) => void
}

const PinWallSlider: FC<Props> = ({
    minValue = 0,
    maxValue = 50,
    defaultValue,
    label,
    name,
    step = 1,
    color = 'secondary',
    onSliderChangeCallback,
    isNumber = false
}) => {
    const [value, setValue] = useState<number>(defaultValue)

    useEffect(() => {
        setValue(defaultValue || 0)
    }, [defaultValue])

    const handleSliderChange = (event, newValue) => {
        setValue(isNumber ? Number(newValue) : newValue)
        onSliderChangeCallback(isNumber ? Number(newValue) : newValue)
    }

    const handleSliderChangeCommitted = (event, newValue) => {}

    const useSliderStyles = makeStyles()((theme: Theme) => ({
        color: {
            color: theme.palette.secondary.main
        }
    }))

    const { classes } = useStyles()
    const { classes: classesSlider } = useSliderStyles()

    return (
        <div className={classes.root}>
            <Typography
                id="input-slider"
                gutterBottom
                style={{ minWidth: '54px', fontSize: '0.825rem' }}>
                {label}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        value={typeof value === 'number' ? value : 0}
                        valueLabelDisplay={typeof value === 'number' && value > 0 ? 'on' : 'auto'}
                        onChange={handleSliderChange}
                        onChangeCommitted={handleSliderChangeCommitted}
                        aria-labelledby="input-slider"
                        max={maxValue}
                        min={minValue}
                        className={classesSlider.color}
                        classes={{
                            valueLabel: classes.valueLabel
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default PinWallSlider
