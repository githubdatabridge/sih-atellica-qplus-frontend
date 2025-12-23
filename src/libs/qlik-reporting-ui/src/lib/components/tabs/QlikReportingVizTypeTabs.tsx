import React, { FC, useState, useRef, useEffect, useCallback } from 'react'

import TreeMapChartIcon from '@mui/icons-material/AccountTree'
import CustomChartIcon from '@mui/icons-material/AutoFixHigh'
import BarChartIcon from '@mui/icons-material/BarChart'
import MapChartIcon from '@mui/icons-material/LocationOn'
import ComboChartIcon from '@mui/icons-material/MultilineChart'
import KpiChartIcon from '@mui/icons-material/Numbers'
import PieChartIcon from '@mui/icons-material/PieChart'
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot'
import LineChartIcon from '@mui/icons-material/ShowChart'
import DistributionPlotChartIcon from '@mui/icons-material/StackedBarChart'
import TableChartIcon from '@mui/icons-material/TableChart'
import PivotTableIcon from '@mui/icons-material/ViewQuilt'
import { Tabs, Tab, TabScrollButton, Theme } from '@mui/material'
import IconButton from '@mui/material/IconButton'

import { makeStyles, withStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { ReportVisualizations } from '@libs/core-models'

import translation from '../../constants/translations'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { useQlikReportingUiContext } from '../../contexts/QlikReportingUiContext'

type TQlikReportingVizTypeTabsClasses = {
    iconButtonActive: string
    iconButton: string
}
export interface IQlikReportingVizTypeTabsProps {
    onClickVizTypeHandler(type: string, isBaseChart: boolean): void
    charts: string[]
    isReportEnabled?: boolean
    height: number
    classNames?: Partial<TQlikReportingVizTypeTabsClasses>
}

const QlikReportingVizTypeTabs: FC<IQlikReportingVizTypeTabsProps> = React.memo(
    ({ onClickVizTypeHandler, charts = [], isReportEnabled = true, height, classNames }) => {
        const [isLoading, setIsLoading] = useState<boolean>(false)
        const [isScrollbar, setIsScrollbar] = useState<boolean>(false)
        const [toolbarHeight, setToolbarHeight] = useState<number>(height)
        const [chartHeight, setChartHeight] = useState<number>(50)
        const [datasetCharts, setDatasetCharts] = useState<ReportVisualizations[]>([])
        const {
            reportIsLoading,
            reportVizType,
            reportDataset,
            reportVisualizations,
            setReportVizOptions
        } = useQlikReportingContext()
        const {
            reportingChartPivotTableNode,
            reportingChartTableNode,
            reportingChartBarNode,
            reportingChartLineNode,
            reportingChartComboNode,
            reportingChartScatterNode,
            reportingChartMapNode,
            reportingChartDistributionPlotNode,
            reportingChartPieNode,
            reportingChartTreemapNode,
            reportingChartKpiNode,
            cssReportingChartButtonIcon,
            reportingChartCustomNode
        } = useQlikReportingUiContext()
        const [type, setType] = useState<string>('')
        const [isDisabled, setIsDisabled] = useState<boolean>(true)

        const targetRef = useRef<any>()
        const { classes } = useStyles()
        const { t } = useI18n()

        const chartsType = useCallback(
            (type: string) => {
                let chart: any = null
                switch (type) {
                    case 'table':
                        chart = {
                            title: t(translation.reportingTableChartTooltip),
                            icon: reportingChartTableNode || (
                                <TableChartIcon className={classes.iconSize} />
                            )
                        }
                        break
                    case 'pivot-table':
                        chart = {
                            title: t(translation.reportingPivotTableChartTooltip),
                            icon: reportingChartPivotTableNode || (
                                <PivotTableIcon className={classes.iconSize} />
                            )
                        }
                        break
                    case 'piechart':
                        chart = {
                            title: t(translation.reportingPieChartTooltip),
                            icon: reportingChartPieNode || (
                                <PieChartIcon className={classes.iconSize} />
                            )
                        }
                        break
                    case 'linechart':
                        chart = {
                            title: t(translation.reportingLineChartTooltip),
                            icon: reportingChartLineNode || (
                                <LineChartIcon className={classes.iconSize} />
                            )
                        }
                        break
                    case 'barchart':
                        chart = {
                            title: t(translation.reportingBarChartTooltip),
                            icon: reportingChartBarNode || (
                                <BarChartIcon className={classes.iconSize} />
                            )
                        }
                        break
                    case 'combochart':
                        chart = {
                            title: t(translation.reportingComboChartTableTooltip),
                            icon: reportingChartComboNode || (
                                <ComboChartIcon className={classes.iconSize} />
                            )
                        }
                        break
                    case 'map':
                        chart = {
                            title: t(translation.reportingGeoMapChartTableTooltip),
                            icon: reportingChartMapNode || (
                                <MapChartIcon className={classes.iconSize} />
                            )
                        }
                        break
                    case 'scatterplot':
                        chart = {
                            title: t(translation.reportingScatterChartTooltip),
                            icon: reportingChartScatterNode || (
                                <ScatterPlotIcon className={classes.iconSize} />
                            )
                        }
                        break
                    case 'distributionplot':
                        chart = {
                            title: t(translation.reportingDistributionPlotChartTooltip),
                            icon: reportingChartDistributionPlotNode || (
                                <DistributionPlotChartIcon className={classes.iconSize} />
                            )
                        }
                        break
                    case 'treemap':
                        chart = {
                            title: t(translation.reportingTreeMapChartTooltip),
                            icon: reportingChartTreemapNode || (
                                <TreeMapChartIcon className={classes.iconSize} />
                            )
                        }
                        break
                    case 'kpi':
                        chart = {
                            title: t(translation.reportingKpiChartTooltip),
                            icon: reportingChartKpiNode || (
                                <KpiChartIcon className={classes.iconSize} />
                            )
                        }
                        break
                    default:
                        chart = {
                            title: t(translation.reportingCustomChartTooltip),
                            icon: reportingChartCustomNode || (
                                <CustomChartIcon className={classes.iconSize} />
                            )
                        }
                        break
                }
                return chart
            },
            [t]
        )

        useEffect(() => {
            setIsLoading(reportIsLoading)
        }, [reportIsLoading])

        useEffect(() => {
            setIsLoading(true)
            if (reportVisualizations) {
                setDatasetCharts(reportVisualizations)
            }
            setIsLoading(false)
        }, [reportVisualizations])

        useEffect(() => {
            if (!reportDataset) {
                setType('')
                setDatasetCharts([])
            } else {
                setType(reportVizType)
            }
            setIsDisabled(!reportDataset ? true : false)
        }, [reportDataset, reportVizType])

        useEffect(() => {
            const vHeight = height / datasetCharts?.length - 1
            setIsScrollbar(vHeight < 50 ? true : false)
            setChartHeight(Math.floor(vHeight) < 50 ? vHeight : chartHeight)
            setToolbarHeight(height)
        }, [datasetCharts?.length, height])

        const onVizClickHandler = (chart: ReportVisualizations) => {
            setIsDisabled(true)
            onClickVizTypeHandler(chart.name, chart.isBaseChart)
            setReportVizOptions(chart?.properties || {})
            setIsDisabled(false)
        }

        const MyTabScrollButton = withStyles(TabScrollButton, (theme: Theme, props) => ({
            root: {
                '&.Mui-disabled': {
                    opacity: 1,
                    color: theme.palette.text.disabled
                }
            }
        }))

        return (
            <Tabs
                classes={{ root: classes.tabs }}
                ref={targetRef}
                onChange={() => undefined}
                variant="scrollable"
                scrollButtons={isScrollbar}
                allowScrollButtonsMobile={true}
                textColor="primary"
                aria-label="scrollable force tabs"
                orientation="vertical"
                style={{ height: toolbarHeight }}
                ScrollButtonComponent={MyTabScrollButton}
                value={false}>
                {!isLoading &&
                    datasetCharts?.length > 0 &&
                    datasetCharts?.map((chart, index) => (
                        <Tab
                            className={classes.tab}
                            icon={
                                <IconTooltip title={chart.name} placement="right">
                                    <IconButton
                                        color="primary"
                                        aria-label={chart.name}
                                        component="span"
                                        onClick={() =>
                                            isReportEnabled ? onVizClickHandler(chart) : null
                                        }
                                        classes={{
                                            disabled: classes.iconButtonDisabled
                                        }}
                                        className={
                                            type === chart.name
                                                ? `${classes.iconButtonActive} ${
                                                      classNames?.iconButtonActive || ''
                                                  }`
                                                : isReportEnabled
                                                ? `${classes.iconButton} ${
                                                      classNames?.iconButton || ''
                                                  }`
                                                : null
                                        }
                                        sx={{
                                            ...cssReportingChartButtonIcon
                                        }}
                                        disabled={
                                            isDisabled || (!isReportEnabled && type !== chart.name)
                                        }>
                                        {chartsType(chart.name).icon}
                                    </IconButton>
                                </IconTooltip>
                            }
                            iconPosition="start"
                            key={chart.name}></Tab>
                    ))}
            </Tabs>
        )
    }
)
export default QlikReportingVizTypeTabs

const useStyles = makeStyles()((theme: Theme) => ({
    tabs: {
        backgroundColor: theme.palette.background.default
    },
    tab: {
        padding: '0px',
        minWidth: '50px'
    },
    iconButton: {
        width: '58px',
        minHeight: '50px',
        borderRadius: '0px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
        '&:hover': {
            width: '58px',
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText
        }
    },
    iconButtonDisabled: {
        width: '58px',
        minHeight: '50px',
        borderRadius: '0px',
        cursor: 'not-allowed'
    },
    iconButtonActive: {
        // width: '100%',
        width: '58px',
        minHeight: '50px',
        borderRadius: '0px',
        cursor: 'pointer',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        '&:hover': {
            width: '58px',
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText
        }
    },
    iconSize: {
        width: '24px',
        height: '24px'
    }
}))
