import { QMasterVisualization } from '@libs/qlik-models'

export interface ReportDataset extends QMasterVisualization {
    id: number
    qlikAppId?: string
    color?: string
    dimensions?: any
    measures?: any
    visualizations?: any
    filters?: any
}
