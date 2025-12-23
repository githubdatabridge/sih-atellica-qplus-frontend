import React, { FC, useEffect } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import { useQlikReportingContext } from '../contexts/QlikReportingContext'
import { BaseChart } from './BaseChart'

interface IMapChartProps {
    color?: string
}

const MapChart: FC<IMapChartProps> = React.memo(({ color }) => {
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
        </Box>
    )
})

export default MapChart
