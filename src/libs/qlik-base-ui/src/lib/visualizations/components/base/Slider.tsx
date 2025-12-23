import React, { FC, useState } from 'react'

import { useMount } from 'react-use'

import { Grid, Typography, Slider, useTheme, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useQlikVisualizationContext } from '../../QlikVisualizationContext'
import { strToObject, setObjectProperty, findByKey, mergeDeep } from '../../utils/functions'

const useStyles = makeStyles()({
    root: {
        width: '100%',
        paddingTop: '20px'
    },
    input: {
        width: 42
    }
})

interface VisualizationSliderProps {
    defaultValue?: number
    minValue?: number
    maxValue?: number
    label: string
    name: string
    path: string
    delimiter?: string
    identifier: string
    step?: number
    color?: string
    isNumber?: boolean
}

const VisualizationSlider: FC<VisualizationSliderProps> = ({
    minValue = 0,
    maxValue = 50,
    defaultValue,
    label,
    name,
    path,
    delimiter = '.',
    identifier,
    step = 1,
    color = 'secondary',
    isNumber = false
}) => {
    const [object, setObject] = useState<any>(null)
    const [value, setValue] = useState<number>(defaultValue)
    const { visualizationObject, visualizationOptions, setVisualizationOptions } =
        useQlikVisualizationContext()

    const { classes } = useStyles()
    const theme = useTheme<Theme>()

    useMount(async () => {
        const strPath = path
        const obj = strToObject(strPath, delimiter)
        setObject(obj)
        const value = findByKey(visualizationOptions, path) || defaultValue
        setValue(value)
    })

    const handleSliderChange = (event, newValue) => {
        setValue(isNumber ? Number(newValue) : newValue)
    }

    const handleSliderChangeCommitted = (event, newValue) => {
        const obj = { ...object }
        setObjectProperty(identifier, isNumber ? Number(newValue) : newValue, obj)
        setObject(obj)

        const qOptions = mergeDeep(visualizationOptions, object)
        if (visualizationObject) (visualizationObject as any).setOptions(qOptions)
        setVisualizationOptions(qOptions || {})
    }

    const useSliderStyles = makeStyles()((theme: Theme) => ({
        color: {
            color: theme.palette.secondary.main
        }
    }))

    const { classes: classesSlider } = useSliderStyles()
    return (
        <div className={classes.root}>
            <Typography id="input-slider" gutterBottom style={{ minWidth: '54px' }}>
                {label}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs style={{ padding: '10px' }}>
                    <Slider
                        value={typeof value === 'number' ? value : 0}
                        valueLabelDisplay="auto"
                        onChange={handleSliderChange}
                        onChangeCommitted={handleSliderChangeCommitted}
                        aria-labelledby="input-slider"
                        max={maxValue}
                        min={minValue}
                        className={classesSlider.color}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default VisualizationSlider
