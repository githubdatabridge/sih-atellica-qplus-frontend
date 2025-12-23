/* eslint-disable jsx-a11y/no-static-element-interactions */

import * as React from 'react'

import { makeStyles } from 'tss-react/mui'

import { DateRange, DefinedRange } from '../types'
import DateRangePicker from './DateRangePicker'

const useStyles = makeStyles()(() => ({
    dateRangePickerContainer: {
        position: 'relative'
    },
    dateRangePicker: {
        position: 'relative',
        zIndex: 1
    },
    dateRangeBackdrop: {
        position: 'fixed',
        height: '100vh',
        width: '100vw',
        bottom: 0,
        zIndex: 0,
        right: 0,
        left: 0,
        top: 0
    }
}))

export interface DateRangePickerWrapperProps {
    open: boolean
    toggle: () => void
    initialDateRange?: DateRange
    definedRanges?: DefinedRange[]
    minDate?: Date | string
    maxDate?: Date | string
    onChange: (dateRange: DateRange) => void
    shouldDisableDate: (date: Date) => boolean
    closeOnClickOutside?: boolean
    wrapperClassName?: string
    cssDefinedRange?: any
}

const DateRangePickerWrapper: React.FunctionComponent<DateRangePickerWrapperProps> = (
    props: DateRangePickerWrapperProps
) => {
    const { classes } = useStyles()

    const { closeOnClickOutside, wrapperClassName, toggle, open } = props

    const handleToggle = () => {
        if (closeOnClickOutside === false) {
            return
        }

        toggle()
    }

    const handleKeyPress = (event: any) => event?.key === 'Escape' && handleToggle()

    return (
        <div className={classes.dateRangePickerContainer}>
            {open && (
                <div
                    className={classes.dateRangeBackdrop}
                    onKeyPress={handleKeyPress}
                    onClick={handleToggle}
                />
            )}

            <div className={`${wrapperClassName} ${classes.dateRangePicker}`}>
                <DateRangePicker {...props} />
            </div>
        </div>
    )
}

export default DateRangePickerWrapper
