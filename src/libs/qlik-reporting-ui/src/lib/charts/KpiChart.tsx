import React, { FC, useEffect } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import ReportingRadioCheckBox from '../components/base/RadioCheckBox'
import ReportingSwitch from '../components/base/Switcher'
import { useQlikReportingContext } from '../contexts/QlikReportingContext'
import { BaseChart } from './BaseChart'

interface IKpiChartProps {
    color?: string
}

const KpiChart: FC<IKpiChartProps> = React.memo(({ color }) => {
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
            <Box
                style={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    paddingBottom: '3px',
                    marginTop: '25px'
                }}>
                <Typography style={{ color: theme.palette.text.primary }}>Chart</Typography>
            </Box>
            <ReportingSwitch
                color={color}
                defaultValue={true}
                path="showMeasureTitle"
                identifier="showMeasureTitle"
                label="Show measure title"
                name="showMeasureTitle"
            />

            <ReportingRadioCheckBox
                color={color}
                defaultValue="center"
                path="textAlign"
                identifier="textAlign"
                label="Text alignemnt"
                name="textAlign"
                values={[
                    { label: 'Left', value: 'left' },
                    { label: 'Center', value: 'center' },
                    { label: 'Right', value: 'right' }
                ]}
            />
            <ReportingRadioCheckBox
                color={color}
                defaultValue="fixed"
                path="layoutBehaviour"
                identifier="layoutBehaviour"
                label="Layout behaviour"
                name="layout"
                values={[
                    { label: 'Fixed', value: 'fixed' },
                    { label: 'Fluid', value: 'fluid' },
                    { label: 'Responsive', value: 'responsive' }
                ]}
            />
            <ReportingRadioCheckBox
                color={color}
                defaultValue="M"
                path="fontSize"
                identifier="fontSize"
                label="Font size"
                name="fontSize"
                values={[
                    { label: 'Small', value: 'S' },
                    { label: 'Medium', value: 'M' },
                    { label: 'Large', value: 'L' }
                ]}
            />
        </Box>
    )
})

export default KpiChart
