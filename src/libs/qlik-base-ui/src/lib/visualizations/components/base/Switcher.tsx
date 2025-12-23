import React, { FC, useState } from 'react'

import { useMount } from 'react-use'

import { Box, FormControlLabel, useTheme } from '@mui/material'

import { BaseSwitch } from '@libs/common-ui'

import { useQlikVisualizationContext } from '../../QlikVisualizationContext'
import { strToObject, setObjectProperty, findByKey, mergeDeep } from '../../utils/functions'

interface VisualizationSwitchProps {
    defaultValue: boolean
    path: string
    identifier: string
    label: string
    name: string
    delimiter?: string
}

const VisualizationSwitch: FC<VisualizationSwitchProps> = ({
    path,
    defaultValue,
    identifier,
    label,
    name,
    delimiter = '.'
}) => {
    const [object, setObject] = useState<any>(null)
    const [value, setValue] = useState<boolean>(defaultValue)
    const { visualizationObject, visualizationOptions, setVisualizationOptions } =
        useQlikVisualizationContext()

    useMount(async () => {
        const strPath = path
        const obj = strToObject(strPath, delimiter)
        setObject(obj)
        const value = findByKey(visualizationOptions, path)
        setValue(typeof value == 'boolean' ? value : defaultValue)
    })

    const handleIsChecked = event => {
        const value = event.target.checked
        setValue(value)

        const obj = { ...object }
        setObjectProperty(identifier, value, obj)
        setObject(obj)

        const qOptions = mergeDeep(visualizationOptions, obj)
        if (visualizationObject) (visualizationObject as any).setOptions(qOptions)
        setVisualizationOptions(qOptions || {})
    }

    const theme = useTheme()

    return (
        <Box mb={2} mt={4}>
            <FormControlLabel
                control={
                    <BaseSwitch
                        checked={value}
                        onChange={handleIsChecked}
                        name={name}
                        color="secondary"
                    />
                }
                label={label}
                sx={{ color: theme.palette.text.primary }}
            />
        </Box>
    )
}

export default VisualizationSwitch
