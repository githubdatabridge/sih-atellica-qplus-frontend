export class Dataset {
    id: number
    appUserId: string
    title: string
    description: string
    label: string
    type: string
    tags: any
    color: string
    createdAt: string
    updatedAt: string
    deletedAt: string

    constructor(dataset) {
        this.id = dataset.id
        this.appUserId = dataset.appUserId
        this.title = dataset.title
        this.description = dataset.description
        this.label = dataset.label
        this.type = dataset.type
        this.tags = dataset.tags?.length ? dataset.tags : []
        this.color = dataset.color
        this.createdAt = dataset.createdAt
        this.updatedAt = dataset.updatedAt
        this.deletedAt = dataset.deletedAt
    }
}
