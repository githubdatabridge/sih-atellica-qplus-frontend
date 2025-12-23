import React, { FC, useState } from 'react'

import { useMount } from 'react-use'

import { Grid, Typography, Slider, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { strToObject, setObjectProperty, findByKey, mergeDeep } from '../../utils'

const useStyles = makeStyles()({
    root: {
        width: '100%',
        paddingTop: '20px'
    },
    input: {
        width: 42
    }
})

interface IReportingSliderProps {
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

const ReportingSlider: FC<IReportingSliderProps> = ({
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
    const [value, setValue] = useState<number>(null)
    const { reportVizOptions, reportVisualization, setReportVizOptions, setIsReportEditable } =
        useQlikReportingContext()

    const { classes } = useStyles()

    useMount(async () => {
        const strPath = path
        const obj = strToObject(strPath, delimiter)
        setObject(obj)
        const value = findByKey(reportVizOptions, path) || defaultValue
        setValue(value)
    })

    const handleSliderChange = (event, newValue) => {
        setValue(isNumber ? Number(newValue) : newValue)
    }

    const handleSliderChangeCommitted = (event, newValue) => {
        const obj = { ...object }
        setObjectProperty(identifier, isNumber ? Number(newValue) : newValue, obj)
        setObject(obj)

        const qOptions = mergeDeep(reportVizOptions, object)
        reportVisualization.setOptions(qOptions)
        setReportVizOptions(qOptions)
        setIsReportEditable(true)
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

export default ReportingSlider
