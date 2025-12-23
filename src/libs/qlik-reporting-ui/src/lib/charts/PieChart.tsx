import React, { FC, useEffect, useState } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import DividerWithText from '../components/base/DividerWithText'
import ReportingSelect from '../components/base/Select'
import ReportingSlider from '../components/base/Slider'
import ReportingSwitch from '../components/base/Switcher'
import ReportingTextField from '../components/base/TextField'
import { useQlikReportingContext } from '../contexts/QlikReportingContext'
import { findByKey } from '../utils'
import { BaseChart } from './BaseChart'
import { LegendChart } from './LegendChart'

interface IPieChartProps {
    color?: string
}

const PieChart: FC<IPieChartProps> = React.memo(({ color }) => {
    const [isInnerRadiusStyle, setIsInnerRadiusStyle] = useState<boolean>(false)
    const [isLabelValuesModeAuto, setIsLabelValuesModeAuto] = useState<boolean>(true)
    const { reportVizOptions } = useQlikReportingContext()
    const theme = useTheme<Theme>()

    useEffect(() => {
        const isDonut = findByKey(reportVizOptions, 'donut.showAsDonut')
        setIsInnerRadiusStyle(isDonut || false)

        const isLabelModeAuto = findByKey(reportVizOptions, 'dataPoint.auto')
        if (isLabelModeAuto === null || isLabelModeAuto === undefined)
            setIsLabelValuesModeAuto(true)

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

            <ReportingSwitch
                color={color}
                defaultValue={false}
                path="donut.showAsDonut"
                identifier="showAsDonut"
                label="Show as donut"
                name="showAsDonut"
            />
            <ReportingSwitch
                color={color}
                defaultValue={true}
                path="dimensionTitle"
                identifier="dimensionTitle"
                label="Show dimension title"
                name="dimensionTitle"
            />
            <LegendChart color={color} />
            <DividerWithText color={color}>Values</DividerWithText>
            <ReportingSwitch
                color={color}
                defaultValue={true}
                path="dataPoint.auto"
                identifier="auto"
                label="Auto"
                name="auto"
            />
            {!isLabelValuesModeAuto ? (
                <ReportingSelect
                    values={['none', 'share', 'value', 'auto']}
                    defaultValue="auto"
                    path="dataPoint.labelMode"
                    identifier="labelMode"
                    label="Label Mode"
                    name="labelMode"
                />
            ) : null}

            {/*    <>
                {' '}
                <Box
                    style={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        paddingBottom: '3px',
                        marginTop: '25px'
                    }}>
                    <Typography style={{ color: theme.palette.text.primary }}>Style</Typography>
                </Box>
                <ReportingTextField
                    label="Color"
                    placeHolder="Please enter a hex code color"
                    path="style.strokeColor.color"
                    identifier="footnote"
                    color={color}
                />
                <ReportingSelect
                    values={['none', 'small', 'medium', 'large']}
                    defaultValue="small"
                    path="style.strokeWidth"
                    identifier="strokeWidth"
                    label="Stroke Width"
                    name="strokeWidth"
                />
                <ReportingSlider
                    label="Corner Radius"
                    path="style.cornerRadius"
                    identifier="cornerRadius"
                    name="cornerRadius"
                    isNumber={true}
                    minValue={0}
                    maxValue={40}
                    defaultValue={0}
                    color={color}
                    step={5}
                />{' '}
                {isInnerRadiusStyle ? (
                    <ReportingSlider
                        label="Inner Radius"
                        path="style.innerRadius"
                        identifier="innerRadius"
                        name="innerRadius"
                        isNumber={true}
                        minValue={0.05}
                        maxValue={0.75}
                        step={0.05}
                        defaultValue={0.55}
                        color={color}
                    />
                ) : null}
            </> */}
        </Box>
    )
})

export default PieChart
