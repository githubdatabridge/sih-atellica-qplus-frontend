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

import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { strToObject, setObjectProperty, findByKey, mergeDeep } from '../../utils'

export type TRadioCheck = {
    label: string
    value: any
}

interface IRadioCheckBoxProps {
    values: TRadioCheck[]
    defaultValue?: any
    label: string
    identifier: string
    path: string
    delimiter?: string
    name?: string
    isNumber?: boolean
    color?: any
}

const ReportingRadioCheckBox: FC<IRadioCheckBoxProps> = ({
    name,
    defaultValue,
    values,
    label,
    path,
    delimiter = '.',
    identifier,
    isNumber = false,
    color = 'secondary'
}) => {
    const [object, setObject] = useState<any>(null)
    const { reportVizOptions, reportVisualization, setReportVizOptions, setIsReportEditable } =
        useQlikReportingContext()
    const [value, setValue] = useState<any>(null)
    const theme = useTheme<Theme>()

    useMount(async () => {
        const strPath = path
        const obj = strToObject(strPath, delimiter)
        setObject(obj)
        const value = findByKey(reportVizOptions, path)
        setValue(typeof value == 'boolean' ? value : defaultValue)
    })

    const handleChange = event => {
        const value = event.target.value
        setValue(value)

        const obj = { ...object }
        setObjectProperty(identifier, isNumber ? Number(value) : value, obj)
        setObject(obj)

        const qOptions = mergeDeep(reportVizOptions, obj)
        reportVisualization.setOptions(qOptions)
        setReportVizOptions(qOptions)
        setIsReportEditable(true)
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
                                value={v.value}
                                control={<Radio color={color} />}
                                label={v.label}
                                sx={{ color: theme.palette.text.primary }}
                            />
                        )
                    })}
                </RadioGroup>
            </FormControl>
        </Box>
    )
}

export default ReportingRadioCheckBox
