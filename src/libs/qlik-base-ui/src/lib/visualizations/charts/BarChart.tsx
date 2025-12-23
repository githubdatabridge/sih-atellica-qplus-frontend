import React, { FC, useEffect, useState } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import DividerWithText from '../components/base/DividerWithText'
import RadioCheckBox from '../components/base/RadioCheckBox'
import Select from '../components/base/Select'
import Switch from '../components/base/Switcher'
import { useQlikVisualizationContext } from '../QlikVisualizationContext'
import { findByKey } from '../utils'
import { LegendChart } from './LegendChart'

interface IBarChartProps {
    color?: string
}

const BarChart: FC<IBarChartProps> = React.memo(({ color }) => {
    const [showLabels, setShowLabels] = useState<boolean>(false)
    const [barGrouping, setIsBarGrouping] = useState<string>('grouped')
    const [isGridLineAuto, setIsGridLineAuto] = useState<boolean>(true)
    const { visualizationOptions } = useQlikVisualizationContext()
    const theme = useTheme<Theme>()

    useEffect(() => {
        const barType = findByKey(visualizationOptions, 'barGrouping')
        setIsBarGrouping(barType || 'grouped')
        const gridLine = findByKey(visualizationOptions, 'gridLine.auto')
        setIsGridLineAuto(gridLine === undefined || gridLine === null ? true : gridLine)
        const showLabels = findByKey(visualizationOptions, 'dataPoint.showLabels')
        setShowLabels(showLabels)
        return () => {}
    }, [visualizationOptions])

    return (
        <Box pl={3} pr={3} mt={2}>
            <Box
                style={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    paddingBottom: '3px'
                }}>
                <Typography style={{ color: theme.palette.text.primary }}>General</Typography>
            </Box>
            <DividerWithText color={color}>Options</DividerWithText>
            <RadioCheckBox
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
            <RadioCheckBox
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
            <RadioCheckBox
                defaultValue="0"
                path="scrollStartPos"
                identifier="scrollStartPos"
                label="Scroll start position"
                name="scrollStartPos"
                values={[
                    { label: 'Left/Top', value: '0' },
                    { label: 'Right/Bottom', value: '1' }
                ]}
            />
            <DividerWithText color={color}>Grid Line</DividerWithText>
            <Switch
                defaultValue={true}
                path="gridLine.auto"
                identifier="auto"
                label="Auto"
                name="gridLinesAuto"
            />
            {!isGridLineAuto ? (
                <RadioCheckBox
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
            <Switch
                defaultValue={false}
                path="dataPoint.showLabels"
                identifier="showLabels"
                label="Show Labels"
                name="showLabels"
            />{' '}
            {barGrouping === 'stacked' && showLabels ? (
                <>
                    <Switch
                        defaultValue={false}
                        path="dataPoint.showSegmentLabels"
                        identifier="showSegmentLabels"
                        label="Show labels on segments"
                        name="showSegmentLabels"
                    />
                    <Switch
                        defaultValue={false}
                        path="dataPoint.showTotalLabels"
                        identifier="showTotalLabels"
                        label="Show total labels"
                        name="showTotalLabels"
                    />
                </>
            ) : null}
            <LegendChart color={color} />
            <DividerWithText color={color}>Dimension Axis</DividerWithText>
            <Select
                values={['all', 'labels', 'title', 'none']}
                defaultValue="all"
                path="dimensionAxis.show"
                identifier="show"
                label="Show labels and titles"
                name="show"
            />
            <RadioCheckBox
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
            <RadioCheckBox
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
            <Select
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

export default BarChart
