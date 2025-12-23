import * as React from 'react'

import { Paper, Grid, Typography } from '@mui/material'

import { getDate, isSameMonth, isToday, format, isWithinInterval } from 'date-fns'
import { makeStyles } from 'tss-react/mui'

import { NavigationAction, DateRange } from '../types'
import {
    chunks,
    getDaysInMonth,
    isStartOfRange,
    isEndOfRange,
    inDateRange,
    isRangeSameDay
} from '../utils'
import Day from './Day'
import Header from './Header'

// eslint-disable-next-line no-unused-vars
const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const useStyles = makeStyles()(() => ({
    root: {
        width: 290,
        fontSize: '0.825rem',
        boxShadow: 'none'
    },
    weekDaysContainer: {
        marginTop: 10,
        paddingLeft: 30,
        paddingRight: 30
    },
    daysContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 15,
        marginBottom: 20
    }
}))

interface MonthProps {
    value: Date
    marker: symbol
    dateRange: DateRange
    minDate: Date
    maxDate: Date
    navState: [boolean, boolean]
    setValue: (date: Date) => void
    helpers: {
        inHoverRange: (day: Date) => boolean
    }
    handlers: {
        onDayClick: (day: Date) => void
        onDayHover: (day: Date) => void
        onMonthNavigate: (marker: symbol, action: NavigationAction) => void
    }
    disabledDates?: Date[]
    shouldDisableDate?: (date: Date) => boolean
}

const Month: React.FunctionComponent<MonthProps> = (props: MonthProps) => {
    const { classes } = useStyles()

    const {
        helpers,
        handlers,
        value: date,
        dateRange,
        marker,
        setValue: setDate,
        minDate,
        maxDate,
        disabledDates = [],
        shouldDisableDate = date => false
    } = props

    // eslint-disable-next-line react/destructuring-assignment
    const [back, forward] = props.navState

    return (
        <Paper square elevation={0} className={classes.root}>
            <Grid container>
                <Header
                    date={date}
                    setDate={setDate}
                    nextDisabled={!forward}
                    prevDisabled={!back}
                    onClickPrevious={() =>
                        handlers.onMonthNavigate(marker, NavigationAction.Previous)
                    }
                    onClickNext={() => handlers.onMonthNavigate(marker, NavigationAction.Next)}
                />

                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-between"
                    className={classes.weekDaysContainer}>
                    {WEEK_DAYS.map(day => (
                        <Typography color="secondary" key={day} variant="caption">
                            {day}
                        </Typography>
                    ))}
                </Grid>

                <Grid
                    item
                    container
                    direction="column"
                    justifyContent="space-between"
                    className={classes.daysContainer}>
                    {chunks(getDaysInMonth(date), 7).map((week, idx) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Grid key={idx} container direction="row" justifyContent="center">
                            {week.map(day => {
                                const isStart = isStartOfRange(dateRange, day)
                                const isEnd = isEndOfRange(dateRange, day)
                                const isRangeOneDay = isRangeSameDay(dateRange)
                                const highlighted =
                                    inDateRange(dateRange, day) || helpers.inHoverRange(day)

                                return (
                                    <Day
                                        key={format(day, 'MM-dd-yyyy')}
                                        filled={isStart || isEnd}
                                        outlined={isToday(day)}
                                        highlighted={highlighted && !isRangeOneDay}
                                        disabled={
                                            // disabledDates.find(d => isSameDay(day, d)) ||
                                            shouldDisableDate(day) ||
                                            !isSameMonth(date, day) ||
                                            !isWithinInterval(day, { start: minDate, end: maxDate })
                                        }
                                        startOfRange={isStart && !isRangeOneDay}
                                        endOfRange={isEnd && !isRangeOneDay}
                                        onClick={() => handlers.onDayClick(day)}
                                        onHover={() => handlers.onDayHover(day)}
                                        value={getDate(day)}
                                    />
                                )
                            })}
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Month
