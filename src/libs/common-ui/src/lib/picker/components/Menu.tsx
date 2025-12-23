import React from 'react'

import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt'
import { Grid, Typography, Divider, useTheme, Theme } from '@mui/material'

import { format, differenceInCalendarMonths } from 'date-fns'
import { makeStyles } from 'tss-react/mui'

import { DateRange, DefinedRange, Setter, NavigationAction, MARKERS } from '../types'
import DefinedRanges from './DefinedRanges'
import Month from './Month'

const useStyles = makeStyles()((theme: Theme) => ({
    header: {
        padding: '20px 70px'
    },
    typography: {
        fontSize: '0.9rem',
        fontWeight: 500,
        borderRadius: '4px'
    },
    headerItem: {
        flex: 1,
        textAlign: 'center'
    },
    divider: {
        borderLeft: `1px solid ${theme.palette.action.hover}`,
        marginBottom: 20
    }
}))

interface MenuProps {
    dateRange: DateRange
    ranges: DefinedRange[]
    minDate: Date
    maxDate: Date
    firstMonth: Date
    secondMonth: Date
    setFirstMonth: Setter<Date>
    setSecondMonth: Setter<Date>
    setDateRange: Setter<DateRange>
    cssDefinedRange?: any
    helpers: {
        inHoverRange: (day: Date) => boolean
    }
    handlers: {
        onDayClick: (day: Date) => void
        onDayHover: (day: Date) => void
        onMonthNavigate: (marker: symbol, action: NavigationAction) => void
    }
    shouldDisableDate: (date: Date) => boolean
}

const Menu: React.FunctionComponent<MenuProps> = (props: MenuProps) => {
    const { classes } = useStyles()

    const {
        ranges,
        dateRange,
        minDate,
        maxDate,
        firstMonth,
        setFirstMonth,
        secondMonth,
        setSecondMonth,
        setDateRange,
        helpers,
        handlers,
        cssDefinedRange,
        shouldDisableDate = date => false
    } = props

    const { startDate, endDate } = dateRange
    const canNavigateCloser = differenceInCalendarMonths(secondMonth, firstMonth) >= 2
    const commonProps = {
        dateRange,
        minDate,
        maxDate,
        helpers,
        handlers
    }
    const theme = useTheme()
    return (
        <Grid container direction="row" wrap="nowrap">
            <Grid>
                <Grid container className={classes.header} alignItems="center">
                    <Grid item className={classes.headerItem}>
                        <Typography
                            variant="subtitle1"
                            className={classes.typography}
                            style={{
                                backgroundColor: startDate
                                    ? theme.palette.secondary.main
                                    : '#EFEFEF',
                                color: startDate
                                    ? theme.palette.secondary.contrastText
                                    : theme.palette.text.primary
                            }}>
                            {startDate ? format(startDate, 'MMMM dd, yyyy') : 'Start Date'}
                        </Typography>
                    </Grid>
                    <Grid item className={classes.headerItem}>
                        <ArrowRightAlt color="action" />
                    </Grid>
                    <Grid item className={classes.headerItem}>
                        <Typography
                            variant="subtitle1"
                            className={classes.typography}
                            style={{
                                backgroundColor: endDate ? theme.palette.secondary.main : '#EFEFEF',
                                color: endDate
                                    ? theme.palette.secondary.contrastText
                                    : theme.palette.text.primary
                            }}>
                            {endDate ? format(endDate, 'MMMM dd, yyyy') : 'End Date'}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    wrap="nowrap"
                    boxShadow="none">
                    <Month
                        {...commonProps}
                        value={firstMonth}
                        setValue={setFirstMonth}
                        navState={[true, canNavigateCloser]}
                        marker={MARKERS.FIRST_MONTH}
                        shouldDisableDate={shouldDisableDate}
                    />
                    <div className={classes.divider} />
                    <Month
                        {...commonProps}
                        value={secondMonth}
                        setValue={setSecondMonth}
                        navState={[canNavigateCloser, true]}
                        marker={MARKERS.SECOND_MONTH}
                        shouldDisableDate={shouldDisableDate}
                    />
                </Grid>
            </Grid>
            <div className={classes.divider} />
            <Grid>
                <DefinedRanges
                    selectedRange={dateRange}
                    ranges={ranges}
                    setRange={setDateRange}
                    cssDefinedRange={cssDefinedRange}
                />
            </Grid>
        </Grid>
    )
}

export default Menu
