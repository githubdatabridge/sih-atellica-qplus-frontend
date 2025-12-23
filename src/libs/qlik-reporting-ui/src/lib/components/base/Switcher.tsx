import React, { FC, useState, useEffect } from 'react'

import { useMount } from 'react-use'

import { Box, FormControlLabel, useTheme, Theme } from '@mui/material'

import { BaseSwitch } from '@libs/common-ui'

import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { strToObject, setObjectProperty, findByKey, mergeDeep } from '../../utils/functions'

interface IReportingSwitchProps {
    defaultValue: boolean
    path: string
    identifier: string
    label: string
    name: string
    delimiter?: string
    color?: any
    handleToggleCallback?: (value: boolean) => void
}

const ReportingSwitch: FC<IReportingSwitchProps> = ({
    path,
    defaultValue,
    identifier,
    label,
    name,
    delimiter = '.',
    color = 'secondary',
    handleToggleCallback
}) => {
    const [object, setObject] = useState<any>(null)
    const [value, setValue] = useState<boolean>(null)
    const { reportVizOptions, reportVisualization, setReportVizOptions, setIsReportEditable } =
        useQlikReportingContext()

    useMount(async () => {
        const strPath = path
        const obj = strToObject(strPath, delimiter)
        setObject(obj)
        const value = findByKey(reportVizOptions, path)
        setValue(typeof value == 'boolean' ? value : defaultValue)
    })

    useEffect(() => {
        const strPath = path
        const obj = strToObject(strPath, delimiter)
        setObject(obj)
        const value = findByKey(reportVizOptions, path)
        if (value) setValue(value)

        return () => {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportVizOptions])

    const handleIsChecked = event => {
        const value = event.target.checked
        setValue(value)

        const obj = { ...object }
        setObjectProperty(identifier, value, obj)
        setObject(obj)

        const qOptions = mergeDeep(reportVizOptions, obj)
        reportVisualization.setOptions(qOptions)
        setReportVizOptions(qOptions)
        setIsReportEditable(true)
        if (handleToggleCallback) {
            handleToggleCallback(value)
        }
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
                        color={color}
                    />
                }
                sx={{ color: theme.palette.text.primary }}
                label={label}
            />
        </Box>
    )
}

export default ReportingSwitch
