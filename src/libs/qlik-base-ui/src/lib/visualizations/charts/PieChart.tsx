import React, { FC, useEffect, useState } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import DividerWithText from '../components/base/DividerWithText'
import Select from '../components/base/Select'
import Switch from '../components/base/Switcher'
import { useQlikVisualizationContext } from '../QlikVisualizationContext'
import { findByKey } from '../utils'
import { LegendChart } from './LegendChart'

interface IPieChartProps {
    color?: string
}

const PieChart: FC<IPieChartProps> = React.memo(({ color }) => {
    const [, setIsInnerRadiusStyle] = useState<boolean>(false)
    const [isLabelValuesModeAuto, setIsLabelValuesModeAuto] = useState<boolean>(true)
    const { visualizationOptions } = useQlikVisualizationContext()
    const theme = useTheme<Theme>()

    useEffect(() => {
        const isDonut = findByKey(visualizationOptions, 'donut.showAsDonut')
        setIsInnerRadiusStyle(isDonut || false)

        const isLabelModeAuto = findByKey(visualizationOptions, 'dataPoint.auto')
        if (isLabelModeAuto === null || isLabelModeAuto === undefined)
            setIsLabelValuesModeAuto(true)

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
            <Switch
                defaultValue={false}
                path="donut.showAsDonut"
                identifier="showAsDonut"
                label="Show as donut"
                name="showAsDonut"
            />
            <Switch
                defaultValue={true}
                path="dimensionTitle"
                identifier="dimensionTitle"
                label="Show dimension title"
                name="dimensionTitle"
            />
            <LegendChart color={color} />
            <DividerWithText color={color}>Values</DividerWithText>
            <Switch
                defaultValue={true}
                path="dataPoint.auto"
                identifier="auto"
                label="Auto"
                name="auto"
            />
            {!isLabelValuesModeAuto ? (
                <Select
                    values={['none', 'share', 'value', 'auto']}
                    defaultValue="auto"
                    path="dataPoint.labelMode"
                    identifier="labelMode"
                    label="Label Mode"
                    name="labelMode"
                />
            ) : null}
        </Box>
    )
})

export default PieChart
