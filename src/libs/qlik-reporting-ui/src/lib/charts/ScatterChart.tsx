import React, { FC, useEffect, useState } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import ReportingRadioCheckBox from '../components/base/RadioCheckBox'
import ReportingSlider from '../components/base/Slider'
import ReportingSwitch from '../components/base/Switcher'
import { useQlikReportingContext } from '../contexts/QlikReportingContext'
import { findByKey } from '../utils'
import { BaseChart } from './BaseChart'

interface IScatterChartProps {
    color?: string
}

const ScatterChart: FC<IScatterChartProps> = React.memo(({ color }) => {
    const [isGridLineAuto, setIsGridLineAuto] = useState<boolean>(true)
    const { reportVizOptions } = useQlikReportingContext()
    const theme = useTheme<Theme>()

    useEffect(() => {
        const gridLine = findByKey(reportVizOptions, 'gridLine.auto')
        setIsGridLineAuto(gridLine === undefined || gridLine === null ? true : gridLine)
        return () => {}
    }, [reportVizOptions])

    return (
        <Box pl={3} pr={3} mt={2}>
            <Box
                style={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    paddingBottom: '3px'
                }}>
                <Typography style={{ color: theme.palette.text.primary }}>General</Typography>
            </Box>
            <BaseChart color={color} />
            <Box
                style={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    paddingBottom: '3px',
                    marginTop: '25px'
                }}>
                <Typography style={{ color: theme.palette.text.primary }}>Grid Line</Typography>
            </Box>
            <ReportingSwitch
                color={color}
                defaultValue={true}
                path="gridLine.auto"
                identifier="auto"
                label="Auto"
                name="gridLinesAuto"
            />
            {!isGridLineAuto ? (
                <ReportingRadioCheckBox
                    color={color}
                    defaultValue="2"
                    path="gridLine.spacing"
                    identifier="spacing"
                    label="Spacing"
                    name="gridLinesSpacing"
                    isNumber={true}
                    values={[
                        { label: 'No lines', value: '0' },
                        { label: 'Wide', value: '1' },
                        { label: 'Medium', value: '2' },
                        { label: 'Narrow', value: '3' }
                    ]}
                />
            ) : null}
            <ReportingRadioCheckBox
                color={color}
                defaultValue="1"
                path="labels.mode"
                identifier="mode"
                label="Labels"
                name="label"
                isNumber={true}
                values={[
                    { label: 'Hide labels', value: '0' },
                    { label: 'Auto', value: '1' },
                    { label: 'Show labels', value: '2' }
                ]}
            />
            <ReportingSlider
                label="Bubble Size"
                path="dataPoint.bubbleSizes"
                identifier="bubbleSizes"
                name="bubbleSizes"
                minValue={1}
                maxValue={20}
                defaultValue={5}
                color={color}
                step={1}
            />{' '}
        </Box>
    )
})

export default ScatterChart
