import React, { FC, useEffect } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import DividerWithText from '../components/base/DividerWithText'
import Select from '../components/base/Select'
import Switch from '../components/base/Switcher'
import { useQlikVisualizationContext } from '../QlikVisualizationContext'

interface ITableChartProps {
    color?: string
}

const TableChart: FC<ITableChartProps> = React.memo(({ color }) => {
    const { visualizationOptions } = useQlikVisualizationContext()
    const theme = useTheme<Theme>()

    useEffect(() => {
        return () => {}
    }, [visualizationOptions])

    return (
        <Box pl={3} pr={3} mt={2}>
            <Box
                style={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    paddingBottom: '3px',
                    marginTop: '25px'
                }}>
                <Typography style={{ color: theme.palette.text.primary }}>Scrolling</Typography>
            </Box>

            <Switch
                defaultValue={false}
                path="scrolling.keepFirstColumnInView"
                identifier="keepFirstColumnInView"
                label="Freeze first column"
                name="keepFirstColumnInView"
            />
            <Switch
                defaultValue={false}
                path="scrolling.keepFirstColumnInViewTouch"
                identifier="keepFirstColumnInViewTouch"
                label="Keep first column in view touch (mobile)"
                name="keepFirstColumnInViewTouch"
            />
            {/* <Switch
            defaultValue={true}
            path="scrolling.horizontal"
            identifier="horizontal"
            label="Horizontal scrolling"
            name="horizontal"
        /> */}

            <DividerWithText color={color}>Totals</DividerWithText>

            <Switch
                defaultValue={true}
                path="totals.show"
                identifier="show"
                label="Show totals"
                name="showTotals"
            />

            <DividerWithText color={color}>Multiline</DividerWithText>

            <Switch
                defaultValue={true}
                path="multiline.wrapTextInHeaders"
                identifier="wrapTextInHeaders"
                label="Wrap text in header"
                name="wrapTextInHeaders"
            />
            <Switch
                defaultValue={false}
                path="multiline.wrapTextInCells"
                identifier="wrapTextInCells"
                label="Wrap text in cells"
                name="wrapTextInCells"
            />

            <DividerWithText color={color}>Scrollbar</DividerWithText>
            <Select
                values={['unset', 'small', 'medium', 'large']}
                defaultValue="unset"
                path="scrollbar.size"
                identifier="size"
                label="Size"
                name="scrollbarSize"
            />
        </Box>
    )
})

export default TableChart
