import React, { FC } from 'react'

import { PieChartOptions, BarChartOptions, LineChartOptions, TableChartOptions } from './charts'

export interface IQlikVisualizationPreferencesProps {
    vizType: string
    color?: string
}

const QlikVisualizationPreferences: FC<IQlikVisualizationPreferencesProps> = React.memo(
    ({ vizType, color }) => {
        const renderChart = () => {
            switch (vizType) {
                case 'piechart':
                    return <PieChartOptions color={color} />
                case 'barchart':
                    return <BarChartOptions color={color} />
                case 'linechart':
                    return <LineChartOptions color={color} />
                case 'table':
                    return <TableChartOptions color={color} />
                default:
                    return null
                    break
            }
        }

        return renderChart()
    }
)

export default QlikVisualizationPreferences
