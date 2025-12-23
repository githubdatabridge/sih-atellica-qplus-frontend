import React, { FC, useState } from 'react'

import { useMount } from 'react-use'

import { Box, MenuItem, FormControl, Select, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { strToObject, setObjectProperty, findByKey, mergeDeep } from '../../utils'

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

interface IReportingSelectProps {
    name: string
    values: any[]
    defaultValue?: any
    label: string
    identifier: string
    path: string
    delimiter?: string
}

const ReportingSelect: FC<IReportingSelectProps> = ({
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
    const { reportVizOptions, reportVisualization, setIsReportEditable, setReportVizOptions } =
        useQlikReportingContext()
    const [value, setValue] = useState<any>(null)
    const [open, setOpen] = useState(false)

    useMount(async () => {
        const strPath = path
        const obj = strToObject(strPath, delimiter)
        setObject(obj)
        const value = findByKey(reportVizOptions, path) || defaultValue || ''
        setValue(value)
    })

    const handleOpen = () => {
        setOpen(true)
    }

    const handleChange = (event: any) => {
        const value = event.target.value
        setValue(value)

        const obj = { ...object }
        setObjectProperty(identifier, value, obj)
        setObject(obj)

        const qOptions = mergeDeep(reportVizOptions, obj)
        reportVisualization.setOptions(qOptions)
        setReportVizOptions(qOptions || {})
        setIsReportEditable(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Box mb={2} mt={4}>
            <FormControl className={classes.formControl}>
                <Select
                    variant="standard"
                    name={name}
                    className={classes.select}
                    labelId="select-controlled-open-select-label"
                    id="select-controlled-open-select"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={value}
                    onChange={handleChange}
                    placeholder={label}>
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {values.map(v => {
                        return <MenuItem value={v}>{v}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </Box>
    )
}

export default ReportingSelect
