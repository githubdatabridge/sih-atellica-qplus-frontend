import { ReportFilters } from './ReportFilters'

interface PinWallLayout {
    padding?: number
    margin?: number
    isResponsive?: boolean
    height?: number
    offset?: number
}

interface PinWallMeta {
    layout?: PinWallLayout
}

interface PinWallContent {
    cellCount?: number
    filters?: ReportFilters[]
    cells?: PinWallCell[]
    meta?: PinWallMeta
}

interface PinWallCell {
    width: number
    height: number
    x: number
    y: number
    reportId?: number
    visualizationId?: string
}

export interface PinWallFiltersRaw {
    [key: string]: string[]
}

export interface PinWallFilters {
    qlikAppId: string
    filters: string[]
}

export class PinWall {
    id: number
    content: PinWallContent
    meta
    customerId: string
    title: string
    description: string

    constructor(pinWall) {
        this.id = pinWall.id
        this.content = pinWall.content
        this.customerId = pinWall.customerId
        this.title = pinWall.title
        this.description = pinWall.description
    }
}
