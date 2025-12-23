import { Box, Typography, useTheme, Theme } from '@mui/material'

import ReportingSelect from '../components/base/Select'
import ReportingSwitch from '../components/base/Switcher'

export const LegendChart = ({ color }) => {
    const theme = useTheme<Theme>()
    return (
        <>
            <Box
                style={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    paddingBottom: '3px'
                }}>
                <Typography style={{ color: theme.palette.text.primary }}>Legend</Typography>
            </Box>
            <ReportingSwitch
                color={color}
                defaultValue={true}
                path="legend.show"
                identifier="show"
                label="Show legend"
                name="showLegend"
            />
            <ReportingSwitch
                color={color}
                defaultValue={true}
                path="legend.showTitle"
                identifier="showTitle"
                label="Show legend title"
                name="showLegendTitle"
            />
            <ReportingSelect
                values={['auto', 'right', 'left', 'bottom', 'top']}
                defaultValue="auto"
                path="legend.dock"
                identifier="dock"
                label="Dock legend"
                name="dock"
            />
        </>
    )
}
