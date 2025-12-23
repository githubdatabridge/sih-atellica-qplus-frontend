import React, { FC, useCallback, useEffect, useRef, useState } from 'react'

import { useMount, useUnmount } from 'react-use'

import DateRangeIcon from '@mui/icons-material/DateRange'
import { ButtonBase, Menu, Paper, Theme, Typography } from '@mui/material'
import Box from '@mui/material/Box'

import { format, isSameDay, parse } from 'date-fns'
import { makeStyles } from 'tss-react/mui'

import { AppInfoIcon, DateRange, DateRangePicker } from '@libs/common-ui'
import {
    useQlikCreateList,
    useQlikFieldSelectMatch,
    useQlikFlattenListData,
    useQlikGetListObjectData
} from '@libs/qlik-capability-hooks'
import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

import { qDefCreateList } from './definitions/qDefCreateList'

export interface IQlikRangeDatePickerProps {
    qlikAppId?: string
    fieldName: string
    dateFormat: string
    qlikDateFormat: string
    width?: string
    height?: string
    labelDefault?: string
    css?: any
    cssButtonText?: any
    cssIconCalendar?: any
    cssIconBox?: any
    cssDefinedRange?: any
    iconCalendar?: React.ReactNode
    isDisabled?: boolean
    startDate?: Date
    endDate?: Date
    showAppWaterMark?: boolean
}

export const QlikDateRangePicker: FC<IQlikRangeDatePickerProps> = ({
    qlikAppId,
    fieldName,
    qlikDateFormat,
    dateFormat,
    width,
    height,
    labelDefault = 'Select a Date Range',
    css,
    cssButtonText,
    cssIconCalendar,
    cssDefinedRange,
    cssIconBox,
    iconCalendar,
    isDisabled = false,
    startDate,
    endDate,
    showAppWaterMark = true
}) => {
    const [qlikDates, setQlikDates] = useState<Date[]>([])
    const { qAppId } = useQlikApp(qlikAppId)

    const { setFieldSelectMatch } = useQlikFieldSelectMatch()
    const { setFlattenListData } = useQlikFlattenListData()
    const { setListObjectData } = useQlikGetListObjectData()
    const { setCreateList } = useQlikCreateList()

    const { qAppMap } = useQlikAppContext()

    const [minDate, setMinDate] = useState<Date>()
    const [maxDate, setMaxDate] = useState<Date>()
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate,
        endDate
    })
    const [model, setModel] = useState<any>(null)
    const [, setActiveDateList] = useState<any[]>([])
    const [, setIsLoading] = useState(false)

    let qModel = useRef<any>(null).current

    const onDateChange = async () => {
        const { startDate, endDate } = dateRange || {}
        if (!startDate || !endDate) return

        const dateRangeQuery = `>=${format(startDate, dateFormat)}<=${format(endDate, dateFormat)}`
        await setFieldSelectMatch(fieldName, dateRangeQuery, qAppId, true)
    }

    useEffect(() => {
        onDateChange()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange])

    const updateList = async () => {
        try {
            setIsLoading(true)
            if (!qModel) return

            const qLayout = await qModel.getLayout()
            if (!qLayout) return

            const qData = await setListObjectData(
                '/qListObjectDef',
                qModel,
                qLayout.qListObject.qSize,
                qAppId
            )
            const data = setFlattenListData(qData, qAppId)
            const activeDates = data.filter(d => d.qState === 'S').map(e => e.qText)

            setActiveDateList(activeDates)

            const qlikDates = data.map(d =>
                qlikDateFormat ? parse(d.qText, qlikDateFormat, new Date()) : d.qText
            )

            if (activeDates.length > 0) {
                setMinDate(new Date(activeDates[0]))
                setMaxDate(new Date(activeDates[activeDates.length - 1]))
            } else {
                setMinDate(null)
                setMaxDate(null)
                setDateRange({})
            }

            setQlikDates(qlikDates)
            setModel(qModel)
        } catch (error) {
            console.log('Qplus Error', error)
        } finally {
            setIsLoading(false)
        }
    }

    useMount(async () => {
        setIsLoading(true)
        const qDefList = qDefCreateList(fieldName)
        qModel = await setCreateList(qDefList, qAppId, updateList)
        await updateList()
        setIsLoading(false)
    })

    useUnmount(() => {
        const m = qModel || model
        if (m) {
            m.removeAllListeners()
            m.close()
        }
    })

    const menuButtonRef = useRef(null)
    const [datePickerMenu, setDatePickerMenu] = React.useState<null | HTMLElement>(null)

    const datePickerMenuClick = (event: React.MouseEvent<HTMLElement>) =>
        setDatePickerMenu(event.currentTarget)

    const userMenuClose = () => setDatePickerMenu(null)

    const buttonText = dateRange.startDate
        ? `${format(dateRange.startDate, dateFormat)} - ${format(dateRange.endDate, dateFormat)}`
        : labelDefault

    const disableDate = useCallback(date => !qlikDates.some(qd => isSameDay(qd, date)), [qlikDates])

    const { classes } = useStyles()

    return (
        <>
            <ButtonBase ref={menuButtonRef} onClick={datePickerMenuClick} disabled={isDisabled}>
                <Paper elevation={0} className={classes.paper} style={css}>
                    <Box
                        display="flex"
                        alignItems="center"
                        style={{
                            paddingTop: '3px',
                            paddingLeft: '2px',
                            paddingRight: '3px',
                            width: width || null,
                            height: height || null
                        }}>
                        {showAppWaterMark && (
                            <Box ml={1}>
                                <AppInfoIcon
                                    initials={qAppMap.get(qlikAppId)?.qMeta?.initials}
                                    title={qAppMap.get(qlikAppId)?.qTitle}
                                    text={qAppMap.get(qlikAppId)?.qDescription}
                                    backgroundColor={qAppMap.get(qlikAppId)?.qMeta?.backgroundColor}
                                    color={qAppMap.get(qlikAppId)?.qMeta?.color}
                                    fontSize="0.8rem"
                                    fontWeight={600}
                                    width={14}
                                    height={14}
                                />
                            </Box>
                        )}
                        <Box>
                            <Typography className={classes.buttonText} style={cssButtonText}>
                                {buttonText}
                            </Typography>
                        </Box>

                        <Box style={cssIconBox} flexGrow={1} textAlign="right">
                            {iconCalendar || <DateRangeIcon style={cssIconCalendar} />}
                        </Box>
                    </Box>
                </Paper>
            </ButtonBase>

            <Menu
                id="qlik-date-picker"
                anchorEl={datePickerMenu}
                keepMounted
                open={Boolean(datePickerMenu)}
                onClose={userMenuClose}
                sx={{ boxShadow: 7 }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 0,
                    horizontal: 'left'
                }}>
                <DateRangePicker
                    closeOnClickOutside
                    minDate={minDate}
                    maxDate={maxDate}
                    open={Boolean(datePickerMenu)}
                    shouldDisableDate={disableDate}
                    toggle={() => userMenuClose()}
                    onChange={range => setDateRange(range)}
                    cssDefinedRange={cssDefinedRange}
                />
            </Menu>
        </>
    )
}

export default QlikDateRangePicker

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        paddingRight: theme.spacing(6),
        paddingBottom: theme.spacing(1)
    },
    paper: {
        boxShadow: 'none',
        border: '1px solid #ebebeb',
        flexGrow: 1
    },
    keyboardIcon: {
        color: theme.palette.text.primary,
        width: '1em',
        height: '1em',
        display: 'inline-block',
        fontSize: '1.5rem',
        transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        flexShrink: 0,
        userSelect: 'none'
    },
    buttonText: {
        fontSize: '0.85rem',
        opacity: 0.7,
        marginTop: '-2px',
        marginBottom: '1px',
        fontWeight: 500,
        color: theme.palette.text.primary,
        width: '90%'
    },
    datePicker: {
        '& .MuiInputBase-input': {
            fontWeight: 500
        }
    }
}))
