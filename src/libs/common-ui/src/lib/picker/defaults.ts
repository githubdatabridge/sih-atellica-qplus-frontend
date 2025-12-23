/* eslint-disable import/prefer-default-export */

import {
    addDays,
    startOfWeek,
    endOfWeek,
    addWeeks,
    startOfMonth,
    startOfYear,
    endOfYear,
    endOfMonth,
    addMonths,
    addYears
} from 'date-fns'

import { DefinedRange } from './types'

// eslint-disable-next-line no-unused-vars
const getDefaultRanges = (date: Date): DefinedRange[] => {
    return [
        /*  {
            label: 'Today',
            startDate: date,
            endDate: date
        }, */
        {
            label: 'Yesterday',
            startDate: addDays(date, -1),
            endDate: addDays(date, -1)
        },
        {
            label: 'This Week',
            startDate: startOfWeek(date),
            endDate: endOfWeek(date)
        },
        {
            label: 'Last Week',
            startDate: startOfWeek(addWeeks(date, -1)),
            endDate: endOfWeek(addWeeks(date, -1))
        },
        {
            label: 'Last 7 Days',
            startDate: addWeeks(date, -1),
            endDate: date
        },
        {
            label: 'This Month',
            startDate: startOfMonth(date),
            endDate: endOfMonth(date)
        },
        {
            label: 'Last Month',
            startDate: startOfMonth(addMonths(date, -1)),
            endDate: endOfMonth(addMonths(date, -1))
        },
        /* {
        label: 'This Quarter',
        startDate: startOfQuarter(date),
        endDate: endOfQuarter(date)
    },
      {
        label: 'Last Quarter',
        startDate: startOfQuarter(addQuarters(date, -1)),
        endDate: endOfQuarter(addQuarters(date, -1))
    }*/ {
            label: 'This Year',
            startDate: startOfYear(date),
            endDate: endOfYear(date)
        },
        {
            label: 'Last Year',
            startDate: startOfYear(addYears(date, -1)),
            endDate: endOfYear(addYears(date, -1))
        }
    ]
}

export const defaultRanges = getDefaultRanges(new Date())
