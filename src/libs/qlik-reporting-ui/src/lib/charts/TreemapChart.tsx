import React, { FC, useEffect, useState } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import DividerWithText from '../components/base/DividerWithText'
import ReportingSwitch from '../components/base/Switcher'
import { useQlikReportingContext } from '../contexts/QlikReportingContext'
import { findByKey } from '../utils'
import { BaseChart } from './BaseChart'

interface ITreemapChartProps {
    color?: string
}

const TreemapChart: FC<ITreemapChartProps> = React.memo(({ color }) => {
    const [isAuto, setIsAuto] = useState<boolean>(true)
    const { reportVizOptions, setReportVizOptions } = useQlikReportingContext()
    const theme = useTheme<Theme>()

    useEffect(() => {
        const isAuto = findByKey(reportVizOptions, 'labels.auto')
        const auto = isAuto === null || isAuto === undefined || isAuto
        if (auto && Object.keys(reportVizOptions).length > 0) {
            setReportVizOptions({})
        }
        setIsAuto(auto)
        return () => {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <Typography style={{ color: theme.palette.text.primary }}>Labels</Typography>
            </Box>

            <ReportingSwitch
                color={color}
                defaultValue={true}
                path="labels.auto"
                identifier="auto"
                label="Auto"
                name="labelsAuto"
            />
            {!isAuto ? (
                <>
                    <DividerWithText color={color}>Label Options</DividerWithText>
                    <ReportingSwitch
                        color={color}
                        defaultValue={true}
                        path="labels.headers"
                        identifier="headers"
                        label="Headers"
                        name="labelsHeaders"
                    />
                    <ReportingSwitch
                        color={color}
                        defaultValue={true}
                        path="labels.overlay"
                        identifier="overlay"
                        label="Overlay"
                        name="labelsOverlay"
                    />

                    <ReportingSwitch
                        color={color}
                        defaultValue={true}
                        path="labels.leaves"
                        identifier="leaves"
                        label="Leaves"
                        name="labelsLeaves"
                    />
                    <ReportingSwitch
                        color={color}
                        defaultValue={false}
                        path="labels.values"
                        identifier="values"
                        label="Values"
                        name="labelsValues"
                    />
                </>
            ) : null}
        </Box>
    )
})

export default TreemapChart
