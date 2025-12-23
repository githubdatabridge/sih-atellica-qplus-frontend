import React, { FC, useEffect } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import DividerWithText from '../components/base/DividerWithText'
import ReportingRadioCheckBox from '../components/base/RadioCheckBox'
import ReportingSelect from '../components/base/Select'
import ReportingSwitch from '../components/base/Switcher'
import { useQlikReportingContext } from '../contexts/QlikReportingContext'
import { BaseChart } from './BaseChart'
import { LegendChart } from './LegendChart'

interface IComboChartProps {
    color?: string
}

const ComboChart: FC<IComboChartProps> = React.memo(({ color }) => {
    const { reportVizOptions, reportVisualization, setReportVizOptions } = useQlikReportingContext()
    const theme = useTheme<Theme>()

    useEffect(() => {
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
                defaultValue="grouped"
                path="barGrouping"
                identifier="barGrouping"
                label="Show as"
                name="barGrouping"
                values={[
                    { label: 'Grouped', value: 'grouped' },
                    { label: 'Stacked', value: 'stacked' }
                ]}
            />
            <ReportingRadioCheckBox
                defaultValue="vertical"
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
                defaultValue="0"
                path="scrollStartPos"
                identifier="scrollStartPos"
                label="Scroll start position"
                name="scrollStartPos"
                isNumber={true}
                values={[
                    { label: 'Left/Top', value: '0' },
                    { label: 'Right/Bottom', value: '1' }
                ]}
            />
            <DividerWithText color={color}>Data Points</DividerWithText>

            <ReportingSwitch
                color={color}
                defaultValue={false}
                path="dataPoint.show"
                identifier="show"
                label="Show data point"
                name="showLineDataPoint"
            />
            <ReportingSwitch
                color={color}
                defaultValue={false}
                path="dataPoint.showBarLabels"
                identifier="showBarLabels"
                label="Show bar labels"
                name="showBarLabels"
            />
            <ReportingSwitch
                color={color}
                defaultValue={false}
                path="dataPoint.showLabels"
                identifier="showLabels"
                label="Show labels"
                name="showLabels"
            />
            <ReportingSwitch
                color={color}
                defaultValue={false}
                path="dataPoint.showLineLabels"
                identifier="showLineLabels"
                label="Show line labels"
                name="showLineLabels"
            />

            <LegendChart color={color} />
            <DividerWithText color={color}>Dimension Axis</DividerWithText>
            <ReportingSelect
                values={['all', 'labels', 'title', 'none']}
                defaultValue="all"
                path="dimensionAxis.show"
                identifier="show"
                label="Show labels and titles"
                name="show"
            />
            <ReportingRadioCheckBox
                color={color}
                defaultValue="auto"
                path="dimensionAxis.label"
                identifier="label"
                label="Label orientation"
                name="label"
                values={[
                    { label: 'Auto', value: 'auto' },
                    { label: 'Horizontal', value: 'horizontal' },
                    { label: 'Tilted', value: 'tilted' }
                ]}
            />
            <ReportingRadioCheckBox
                color={color}
                defaultValue="near"
                path="dimensionAxis.dock"
                identifier="dock"
                label="Docking position"
                name="dock"
                values={[
                    { label: 'Near', value: 'near' },
                    { label: 'Far', value: 'far' }
                ]}
            />
            <DividerWithText color={color}>Measure Axis</DividerWithText>
            <ReportingSelect
                values={['all', 'labels', 'title', 'none']}
                defaultValue="all"
                path="measureAxis.show"
                identifier="show"
                label="Show labels and titles"
                name="measureAxisShow"
            />
        </Box>
    )
})

export default ComboChart
