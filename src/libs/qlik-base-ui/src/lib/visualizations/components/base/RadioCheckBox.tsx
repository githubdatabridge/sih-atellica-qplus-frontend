import React, { FC, useState } from 'react'

import { useMount } from 'react-use'

import {
    Radio,
    RadioGroup,
    Box,
    FormControl,
    FormLabel,
    FormControlLabel,
    useTheme,
    Theme
} from '@mui/material'

import { useQlikVisualizationContext } from '../../QlikVisualizationContext'
import { strToObject, setObjectProperty, findByKey, mergeDeep } from '../../utils/functions'

export type RadioCheck = {
    label: string
    value: any
}

interface RadioCheckBoxProps {
    values: RadioCheck[]
    defaultValue?: any
    label: string
    identifier: string
    path: string
    delimiter?: string
    name?: string
    isNumber?: boolean
}

const VisualizationRadioCheckBox: FC<RadioCheckBoxProps> = ({
    name,
    defaultValue,
    values,
    label,
    path,
    delimiter = '.',
    identifier,
    isNumber = false
}) => {
    const [object, setObject] = useState<any>(null)
    const { visualizationObject, visualizationOptions, setVisualizationOptions } =
        useQlikVisualizationContext()
    const [value, setValue] = useState<any>(defaultValue)
    const theme = useTheme<Theme>()

    useMount(async () => {
        const strPath = path
        const obj = strToObject(strPath, delimiter)
        setObject(obj)
        const value = findByKey(visualizationOptions, path)
        setValue(typeof value == 'boolean' ? value : defaultValue)
    })

    const handleChange = event => {
        const value = event.target.value
        setValue(value)

        const obj = { ...object }
        setObjectProperty(identifier, isNumber ? Number(value) : value, obj)
        setObject(obj)

        const qOptions = mergeDeep(visualizationOptions, obj)
        if (visualizationObject) (visualizationObject as any).setOptions(qOptions)
        setVisualizationOptions(qOptions || {})
    }

    return (
        <Box mb={2} mt={4}>
            <FormControl component="fieldset" style={{ width: '100%' }}>
                <FormLabel
                    component="legend"
                    style={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        paddingBottom: '10px',
                        color: theme.palette.text.primary,
                        marginBottom: '15px',
                        width: '100%'
                    }}>
                    {label}
                </FormLabel>
                <RadioGroup aria-label="gender" name={name} value={value} onChange={handleChange}>
                    {values.map(v => {
                        return (
                            <FormControlLabel
                                key={v.label}
                                value={v.value}
                                control={<Radio />}
                                label={v.label}
                                style={{ color: theme.palette.text.primary }}
                            />
                        )
                    })}
                </RadioGroup>
            </FormControl>
        </Box>
    )
}

export default VisualizationRadioCheckBox
