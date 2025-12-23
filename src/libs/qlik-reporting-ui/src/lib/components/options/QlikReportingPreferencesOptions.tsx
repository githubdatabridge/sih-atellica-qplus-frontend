import React, { FC } from 'react'

import {
    PieChartOptions,
    BarChartOptions,
    LineChartOptions,
    ScatterChartOptions,
    KpiChartOptions,
    MapChartOptions,
    PivotChartOptions,
    TableChartOptions,
    TreemapChartOptions,
    ComboChartOptions,
    DistributionPlotChart
} from '../../charts'

interface IQlikReportingPreferencesOptionsProps {
    vizType: string
    color?: string
}

const QlikReportingPreferencesOptions: FC<IQlikReportingPreferencesOptionsProps> = React.memo(
    ({ vizType, color }) => {
        const renderChart = () => {
            switch (vizType) {
                case 'piechart':
                    return <PieChartOptions color={color} />
                case 'barchart':
                    return <BarChartOptions color={color} />
                case 'linechart':
                    return <LineChartOptions color={color} />
                case 'combochart':
                    return <ComboChartOptions color={color} />
                case 'scatterplot':
                    return <ScatterChartOptions color={color} />
                case 'kpi':
                    return <KpiChartOptions color={color} />
                case 'map':
                    return <MapChartOptions color={color} />
                case 'table':
                    return <TableChartOptions color={color} />
                case 'pivot-table':
                    return <PivotChartOptions color={color} />
                case 'treemap':
                    return <TreemapChartOptions color={color} />
                case 'distributionplot':
                    return <DistributionPlotChart color={color} />
                default:
                    return null
                    break
            }
        }

        return renderChart()
    }
)

export default QlikReportingPreferencesOptions
