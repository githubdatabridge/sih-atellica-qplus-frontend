import React, { FC, useEffect, useState } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import DividerWithText from '../components/base/DividerWithText'
import ReportingRadioCheckBox from '../components/base/RadioCheckBox'
import ReportingSelect from '../components/base/Select'
import ReportingSwitch from '../components/base/Switcher'
import { useQlikReportingContext } from '../contexts/QlikReportingContext'
import { findByKey } from '../utils'
import { BaseChart } from './BaseChart'
import { LegendChart } from './LegendChart'

interface ILineChartProps {
    color?: string
}

const LineChart: FC<ILineChartProps> = React.memo(({ color }) => {
    const [lineType, setLineType] = useState<string>('line')
    const [showDataPoint, setShowDataPoint] = useState<boolean>(false)
    const [isStackedArea, setIsStackedArea] = useState<boolean>(false)
    const [isGridLineAuto, setIsGridLineAuto] = useState<boolean>(true)
    const { reportVizOptions, reportVisualization, setReportVizOptions } = useQlikReportingContext()
    const theme = useTheme<Theme>()

    useEffect(() => {
        const stackedArea = findByKey(reportVizOptions, 'stackedArea')
        setIsStackedArea(stackedArea || false)
        const type = findByKey(reportVizOptions, 'lineType')
        setLineType(type || 'line')
        const gridLine = findByKey(reportVizOptions, 'gridLine.auto')
        setIsGridLineAuto(gridLine === undefined || gridLine === null ? true : gridLine)
        const showDataPoint = findByKey(reportVizOptions, 'dataPoint.show')
        setShowDataPoint(!!showDataPoint)
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
                defaultValue="line"
                path="lineType"
                identifier="lineType"
                label="Show as"
                name="lineType"
                values={[
                    { label: 'Line', value: 'line' },
                    { label: 'Area', value: 'area' }
                ]}
            />
            {isStackedArea ? (
                <ReportingSwitch
                    color={color}
                    defaultValue={false}
                    path="stackedArea"
                    identifier="stackedArea"
                    label="Stacked Area"
                    name="stackedArea"
                />
            ) : null}
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
            <DividerWithText color={color}>Grid Line</DividerWithText>
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
            <DividerWithText color={color}>Data Points</DividerWithText>
            <ReportingSwitch
                color={color}
                defaultValue={false}
                path="dataPoint.show"
                identifier="show"
                label="Show"
                name="show"
            />
            {showDataPoint ? (
                <ReportingSwitch
                    color={color}
                    defaultValue={false}
                    path="dataPoint.showLabels"
                    identifier="showLabels"
                    label="Show Labels"
                    name="showLabels"
                />
            ) : null}
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
        </Box>
    )
})

export default LineChart
