import React, { FC, useCallback, useEffect, useState } from 'react'

import { Box, TextField, Theme } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

import moment from 'moment'
import { makeStyles } from 'tss-react/mui'

import { useQlikFieldSelect, useQlikGetFieldValues } from '@libs/qlik-capability-hooks'
import { useQlikApp } from '@libs/qlik-providers'

import { qDefCreateList } from './definitions/qDefCreateList'

export interface IQlikSingleDatePickerProps {
    qlikAppId: string
    fieldName: string
    fieldTitle: string
    format?: string
    mode?: string
    width?: string
}

export const QlikSingleDatePicker: FC<IQlikSingleDatePickerProps> = ({
    qlikAppId,
    fieldName,
    fieldTitle,
    format = null,
    mode = 'inline',
    width
}) => {
    const { classes } = useStyles()
    const [qlikMomentDates, setQlikMomentDates] = useState<any>(null)
    const [qlikDates, setQlikDates] = useState<any>(null)
    const { qAppId } = useQlikApp(qlikAppId)
    const { setFieldValues } = useQlikGetFieldValues()
    const { setFieldSelect } = useQlikFieldSelect()

    const [selectedDate, setDate] = useState(moment())

    const setData = useCallback(async (format: string) => {
        const qFieldData = (await setFieldValues(qDefCreateList(fieldName), qAppId)) as any[]
        const result = qFieldData.map(f =>
            format ? moment(moment(f.qText).format(format), format) : moment(f.qText)
        )
        await setFieldSelect(fieldName, [qFieldData[0].qElemNumber], qAppId)
        setDate(result[0])
        setQlikMomentDates(result)
        setQlikDates(qFieldData)
    }, [])

    useEffect(() => {
        setData(format)
    }, [format, setData])

    const onDateChange = async (date, value) => {
        const result = qlikDates.filter(v => {
            return moment(v.qText).format(format) === value
        })
        await setFieldSelect(fieldName, [result[0].qElemNumber], qAppId)
        const md = moment(moment(result[0].qText).format(format), format)
        setDate(md)
    }

    const shouldDisableDate = (date: any) => {
        return !qlikMomentDates.some(qDate => date.isSame(qDate))
    }

    if (!format) return null

    return (
        <Box className={classes.root} style={{ width: width }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    shouldDisableDate={shouldDisableDate}
                    format={format}
                    label={fieldTitle}
                    value={selectedDate}
                    onChange={onDateChange}
                    sx={{ '.MuiPaper-root': { className: classes.datePicker } }}
                />
            </LocalizationProvider>
        </Box>
    )
}

export default QlikSingleDatePicker

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        paddingRight: theme.spacing(6),
        paddingBottom: theme.spacing(1)
    },
    keyboardIcon: {
        color: theme.palette.primary.dark,
        width: '1em',
        height: '1em',
        display: 'inline-block',
        fontSize: '1.5rem',
        transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        flexShrink: 0,
        userSelect: 'none'
    },
    datePicker: {
        '& .MuiInputBase-input': {
            fontWeight: 500
        }
    }
}))
