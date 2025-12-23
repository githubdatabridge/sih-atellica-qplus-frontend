export class Announcement {
    id: number
    customerId?: string
    titleLabelKey?: string
    descriptionLabelKey?: string
    footerLabelKey?: string
    type?: string
    bannerHeight?: number
    bannerWidth?: number
    direction?: string
    videoUrl?: string
    imageUrl?: string
    actionUrl?: string
    isForCustomerOwner?: boolean
    version?: string
    publishedAt?: string

    constructor(announcement) {
        this.id = announcement.id
        this.customerId = announcement.customerId
        this.titleLabelKey = announcement.titleLabelKey
        this.descriptionLabelKey = announcement.descriptionLabelKey
        this.footerLabelKey = announcement.footerLabelKey
        this.type = announcement.type
        this.bannerHeight = announcement.bannerHeight
        this.bannerWidth = announcement.bannerWidth
        this.direction = announcement.direction
        this.videoUrl = announcement.videoUrl
        this.imageUrl = announcement.imageUrl
        this.actionUrl = announcement.actionUrl
        this.isForCustomerOwner = announcement.isForCustomerOwner
        this.version = announcement.version
        this.publishedAt = announcement.publishedAt
    }
}
