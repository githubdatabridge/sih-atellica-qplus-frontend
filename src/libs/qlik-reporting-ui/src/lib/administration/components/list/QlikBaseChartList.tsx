import React, { FC, useState, useEffect, useCallback } from 'react'

import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    darken,
    Theme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { BaseSwitch } from '@libs/common-ui'
import { ReportDimensions, ReportMeasures } from '@libs/core-models'

import translation from '../../constants/translations'

interface IQlikBaseChartListProps {
    checkedCharts: string[]
    charts: string[]
    selectedDimensions: ReportDimensions[]
    selectedMeasures: ReportMeasures[]
    handleBaseChartsCallback: (name: string[]) => void
}

export const QlikBaseChartList: FC<IQlikBaseChartListProps> = React.memo(
    ({
        charts,
        checkedCharts = [],
        selectedDimensions = [],
        selectedMeasures = [],
        handleBaseChartsCallback
    }) => {
        const [baseCharts, setBaseCharts] = useState<string[]>(checkedCharts)
        const [selectAllBaseCharts, setSelectAllBaseCharts] = useState<boolean>(false)
        const { t } = useI18n()

        useEffect(() => {
            setBaseCharts(checkedCharts)

            return () => {
                setBaseCharts([])
            }
        }, [checkedCharts])

        const handleBaseChartToggleAll = useCallback(() => {
            setBaseCharts(selectAllBaseCharts ? [] : charts)
            handleBaseChartsCallback(selectAllBaseCharts ? [] : charts)
            setSelectAllBaseCharts(!selectAllBaseCharts)
        }, [selectAllBaseCharts, charts, handleBaseChartsCallback])

        const handleBaseChartToggle = useCallback(
            value => {
                const currentIndex = baseCharts.indexOf(value)
                const newChecked = [...baseCharts]

                if (currentIndex === -1) {
                    newChecked.push(value)
                } else {
                    newChecked.splice(currentIndex, 1)
                }
                setBaseCharts(newChecked)
                setSelectAllBaseCharts(charts.length === newChecked.length)
                handleBaseChartsCallback(newChecked)
            },
            [baseCharts, charts.length, handleBaseChartsCallback]
        )

        const { classes } = useStyles()

        const isDisabled = selectedDimensions.length === 0 && selectedMeasures.length === 0

        return (
            <Box width="100%">
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="left">
                        <Typography className={classes.primaryText}>
                            {t(translation.datasetBaseChart)}
                        </Typography>
                    </Box>
                    <Box textAlign="right" flexGrow={1} style={{ marginRight: '-10px' }}>
                        <BaseSwitch
                            onClick={handleBaseChartToggleAll}
                            checked={selectAllBaseCharts}
                            disabled={isDisabled}
                            disableRipple
                            color="secondary"
                            inputProps={{
                                'aria-labelledby': 'baseChartAll'
                            }}
                        />
                    </Box>
                </Box>
                <Box className={classes.listBaseChartsContainer}>
                    <List>
                        {charts?.map((chart, index) => {
                            return (
                                <ListItem
                                    key={chart}
                                    role={undefined}
                                    dense
                                    button
                                    className={classes.listItem}>
                                    <Checkbox
                                        classes={{
                                            checked: classes.checked
                                        }}
                                        edge="start"
                                        onClick={() => handleBaseChartToggle(chart)}
                                        className={classes.listItemCheckbox}
                                        checked={baseCharts.includes(chart)}
                                        tabIndex={-1}
                                        disableRipple
                                        disabled={isDisabled}
                                        inputProps={{
                                            'aria-labelledby': chart
                                        }}
                                    />
                                    <ListItemText
                                        id={chart}
                                        primary={chart}
                                        classes={{
                                            primary: classes.listItemText
                                        }}
                                    />
                                </ListItem>
                            )
                        })}
                    </List>
                </Box>
            </Box>
        )
    }
)

const useStyles = makeStyles()((theme: Theme) => ({
    primaryText: {
        color: theme.palette.text.primary,
        fontWeight: 600,
        fontSize: '14px'
    },
    listBaseChartsContainer: {
        height: '175px',
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        overflowY: 'scroll',
        backgroundColor: darken(theme.palette.background.default, 0.025)
    },
    listItemText: {
        color: theme.palette.text.primary,
        fontSize: '0.875rem'
    },
    listItemCheckbox: {
        marginRight: '10px',
        width: '20px',
        height: '20px',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    listItem: {
        paddingTop: '2px',
        paddingBottom: '2px',
        fontSize: '0.82rem',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    checked: {
        color: `${theme.palette.secondary.main} !important`,
        backgroundColor: `${theme.palette.secondary.contrastText} !important`
    },
    switch_thumb: {
        backgroundColor: theme.palette.secondary.main
    },
    switch_base: {
        color: '#f50057',
        '&.Mui-disabled': {
            color: '#e886a9',
            backgroundColor: 'black'
        },
        '&.Mui-checked': {
            color: theme.palette.secondary.main
        },
        '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: theme.palette.secondary.main
        }
    },
    switch_primary: {
        '&.Mui-checked': {
            color: theme.palette.secondary.main
        },
        '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: theme.palette.secondary.main
        }
    },
    switch_disabled: {
        backgroundColor: 'transparent',
        '&.Mui-checked': {
            color: theme.palette.text.disabled,
            backgroundColor: 'transparent'
        },
        '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: theme.palette.text.disabled
        }
    }
}))
