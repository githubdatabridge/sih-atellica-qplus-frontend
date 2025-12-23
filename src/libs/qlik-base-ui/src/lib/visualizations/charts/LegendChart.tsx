import { Box, Typography, useTheme, Theme } from '@mui/material'

import { BaseSwitch } from '@libs/common-ui'

import Select from '../components/base/Select'
import Switch from '../components/base/Switcher'

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
            <Switch
                defaultValue={true}
                path="legend.show"
                identifier="show"
                label="Show legend"
                name="showLegend"
            />
            <Switch
                defaultValue={true}
                path="legend.showTitle"
                identifier="showTitle"
                label="Show legend title"
                name="showLegendTitle"
            />
            <Select
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
