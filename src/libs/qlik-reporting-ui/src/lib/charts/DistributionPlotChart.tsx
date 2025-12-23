import React, { FC, useEffect, useState } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import DividerWithText from '../components/base/DividerWithText'
import ReportingRadioCheckBox from '../components/base/RadioCheckBox'
import ReportingSelect from '../components/base/Select'
import ReportingSlider from '../components/base/Slider'
import ReportingSwitch from '../components/base/Switcher'
import { useQlikReportingContext } from '../contexts/QlikReportingContext'
import { findByKey } from '../utils'
import { BaseChart } from './BaseChart'

interface IDistributionPlotChartProps {
    color?: string
}

const DistributionPlotChart: FC<IDistributionPlotChartProps> = React.memo(({ color }) => {
    const [isGridLineAuto, setIsGridLineAuto] = useState<boolean>(true)
    const { reportVizOptions, reportVisualization, setReportVizOptions } = useQlikReportingContext()
    const theme = useTheme<Theme>()

    useEffect(() => {
        const gridLine = findByKey(reportVizOptions, 'gridlines.auto')
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
            <DividerWithText color={color}>Options</DividerWithText>
            <ReportingRadioCheckBox
                color={color}
                defaultValue="horizontal"
                path="orientation"
                identifier="orientation"
                label="Orientation"
                name="orientation"
                values={[
                    { label: 'Horizontal', value: 'horizontal' },
                    { label: 'Vertical', value: 'vertical' }
                ]}
            />
            <ReportingRadioCheckBox
                color={color}
                defaultValue="points_box"
                path="orientation"
                identifier="orientation"
                label="Points and Box"
                name="orientation"
                values={[
                    { label: 'Points', value: 'points' },
                    { label: 'Box', value: 'box' },
                    { label: 'Points and Box', value: 'points_box' }
                ]}
            />
            <DividerWithText color={color}>Data points</DividerWithText>

            <ReportingSlider
                label="Inner Radius"
                path="dataPoint.bubbleScales"
                identifier="bubbleScales"
                name="bubbleScales"
                isNumber={true}
                minValue={20}
                maxValue={100}
                step={5}
                defaultValue={100}
                color={color}
            />
            <ReportingSelect
                values={['none', 'none', 'jitter']}
                defaultValue="none"
                path="dataPoint.displacement"
                identifier="displacement"
                label="Displacement"
                name="show"
            />

            <DividerWithText color={color}>Grid Line</DividerWithText>
            <ReportingSwitch
                color={color}
                defaultValue={true}
                path="gridlines.auto"
                identifier="auto"
                label="Auto"
                name="gridLineAuto"
            />
            {!isGridLineAuto ? (
                <ReportingRadioCheckBox
                    color={color}
                    defaultValue="2"
                    path="gridlines.spacing"
                    identifier="spacing"
                    label="Spacing"
                    name="gridLineSpacing"
                    isNumber={true}
                    values={[
                        { label: 'No lines', value: '0' },
                        { label: 'Wide', value: '1' },
                        { label: 'Medium', value: '2' },
                        { label: 'Narrow', value: '3' }
                    ]}
                />
            ) : null}
        </Box>
    )
})

export default DistributionPlotChart
