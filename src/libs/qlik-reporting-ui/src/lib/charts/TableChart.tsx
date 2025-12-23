import React, { FC, useEffect } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import DividerWithText from '../components/base/DividerWithText'
import ReportingSwitch from '../components/base/Switcher'
import { useQlikReportingContext } from '../contexts/QlikReportingContext'
import { BaseChart } from './BaseChart'

interface ITableChartProps {
    color?: string
}

const TableChart: FC<ITableChartProps> = React.memo(({ color }) => {
    const { reportVizOptions } = useQlikReportingContext()
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
            <DividerWithText color={color}>Options</DividerWithText>

            <ReportingSwitch
                color={color}
                defaultValue={false}
                path="scrolling.keepFirstColumnInView"
                identifier="keepFirstColumnInView"
                label="Freeze first column"
                name="keepFirstColumnInView"
            />
            <ReportingSwitch
                color={color}
                defaultValue={false}
                path="scrolling.keepFirstColumnInViewTouch"
                identifier="keepFirstColumnInViewTouch"
                label="Keep first column in view touch (mobile)"
                name="keepFirstColumnInViewTouch"
            />
            {/*   <ReportingSwitch
                defaultValue={true}
                path="scrolling.horizontal"
                identifier="horizontal"
                label="Horizontal scrolling"
                name="horizontal"
            /> */}

            <DividerWithText color={color}>Totals</DividerWithText>

            <ReportingSwitch
                color={color}
                defaultValue={true}
                path="totals.show"
                identifier="show"
                label="Show totals"
                name="showTotals"
            />

            <DividerWithText color={color}>Multiline</DividerWithText>

            <ReportingSwitch
                color={color}
                defaultValue={true}
                path="multiline.wrapTextInHeaders"
                identifier="wrapTextInHeaders"
                label="Wrap text in header"
                name="wrapTextInHeaders"
            />
            <ReportingSwitch
                color={color}
                defaultValue={false}
                path="multiline.wrapTextInCells"
                identifier="wrapTextInCells"
                label="Wrap text in cells"
                name="wrapTextInCells"
            />

            {/*     <DividerWithText color={color}>Scrollbar</DividerWithText>
            <ReportingSelect
                values={['unset', 'small', 'medium', 'large']}
                defaultValue="unset"
                path="scrollbar.size"
                identifier="size"
                label="Size"
                name="scrollbarSize"
            /> */}
        </Box>
    )
})

export default TableChart
