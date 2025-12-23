import AccountTreeIcon from '@mui/icons-material/AccountTree'
import CustomChartIcon from '@mui/icons-material/AutoFixHigh'
import BarChartIcon from '@mui/icons-material/BarChart'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ComboChartIcon from '@mui/icons-material/MultilineChart'
import NumbersIcon from '@mui/icons-material/Numbers'
import PieChartIcon from '@mui/icons-material/PieChart'
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot'
import LineChartIcon from '@mui/icons-material/ShowChart'
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'
import TableChartIcon from '@mui/icons-material/TableChart'
import PivotTableIcon from '@mui/icons-material/ViewQuilt'

export const renderVizType = (vizType: string, color?: string) => {
    switch (vizType) {
        case 'table':
            return (
                <TableChartIcon
                    style={{
                        color: color || 'black'
                    }}
                />
            )
        case 'pivot-table':
            return <PivotTableIcon style={{ color: color }} />
        case 'linechart':
            return <LineChartIcon style={{ color: color }} />
        case 'barchart':
            return <BarChartIcon style={{ color: color }} />
        case 'combochart':
            return <ComboChartIcon style={{ color: color }} />
        case 'scatterplot':
            return <ScatterPlotIcon style={{ color: color }} />
        case 'map':
            return <LocationOnIcon style={{ color: color }} />
        case 'distibutionplot':
            return <StackedBarChartIcon style={{ color: color }} />
        case 'piechart':
            return <PieChartIcon style={{ color: color }} />
        case 'treemap':
            return <AccountTreeIcon style={{ color: color }} />
        case 'kpi':
            return <NumbersIcon style={{ color: color }} />
        default:
            return <CustomChartIcon style={{ color: color }} />
    }
}
