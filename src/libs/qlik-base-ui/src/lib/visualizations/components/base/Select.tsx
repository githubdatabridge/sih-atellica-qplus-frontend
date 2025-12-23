import React, { FC, useState } from 'react'

import { useMount } from 'react-use'

import { Box, FormControl, InputLabel, MenuItem, Select, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useQlikVisualizationContext } from '../../QlikVisualizationContext'
import { findByKey, mergeDeep, setObjectProperty, strToObject } from '../../utils/functions'

const useStyles = makeStyles()((theme: Theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2)
    },
    formControl: {
        minWidth: '100%'
    },
    select: {
        '&:before': {
            borderBottom: '1px solid #e0e0e0'
        },
        '&:after': {
            borderBottom: '1px solid #e0e0e0'
        }
    }
}))

interface VisualizationSelectProps {
    name: string
    values: any[]
    defaultValue?: any
    label: string
    identifier: string
    path: string
    delimiter?: string
}

const VisualizationSelect: FC<VisualizationSelectProps> = ({
    name,
    defaultValue,
    values,
    label,
    path,
    delimiter = '.',
    identifier
}) => {
    const { classes } = useStyles()
    const [object, setObject] = useState<any>(null)
    const { visualizationObject, visualizationOptions, setVisualizationOptions } =
        useQlikVisualizationContext()

    const [value, setValue] = useState<any>(defaultValue || '')
    const [open, setOpen] = useState(false)

    useMount(async () => {
        const obj = strToObject(path, delimiter)
        setObject(obj)
        setValue(findByKey(visualizationOptions, path) || defaultValue || '')
    })

    const handleChange = (event: any) => {
        const value = event.target.value
        setValue(value)

        const obj = { ...object }
        setObjectProperty(identifier, value, obj)
        setObject(obj)

        const qOptions = mergeDeep(visualizationOptions, obj)
        if (visualizationObject) (visualizationObject as any).setOptions(qOptions)
        setVisualizationOptions(qOptions || {})
    }

    return (
        <Box mb={2} mt={4}>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">{label}</InputLabel>
                <Select
                    variant="standard"
                    name={name}
                    labelId="select-controlled-open-select-label"
                    id="select-controlled-open-select"
                    open={open}
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    value={value}
                    onChange={handleChange}>
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {values.map((v, index) => (
                        <MenuItem value={v} key={`menu-item-${v}-${index}`}>
                            {v}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}

export default VisualizationSelect
