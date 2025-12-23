export class Dataset {
    id: number
    qlikAppId?: string
    appUserId: string
    customerId?: any
    tenantId?: any
    appId?: any
    title: string
    description: string
    label: string
    type: string
    tags: any
    color: string
    filters?: any
    dimensions?: any
    measures?: any
    visualizations?: any
    createdAt: string
    updatedAt: string
    deletedAt: string

    constructor(dataset) {
        this.id = dataset.id
        this.qlikAppId = dataset.qlikAppId
        this.appUserId = dataset.appUserId
        this.tenantId = dataset.tenantId
        this.customerId = dataset.customerId
        this.appId = dataset.appId
        this.title = dataset.title
        this.description = dataset.description
        this.label = dataset.label
        this.type = dataset.type
        this.tags = dataset.tags?.length ? dataset.tags : []
        this.color = dataset.color
        this.filters = dataset.filters
        this.dimensions = dataset.dimensions
        this.measures = dataset.measures
        this.visualizations = dataset.visualizations
        this.createdAt = dataset.createdAt
        this.updatedAt = dataset.updatedAt
        this.deletedAt = dataset.deletedAt
    }
}
