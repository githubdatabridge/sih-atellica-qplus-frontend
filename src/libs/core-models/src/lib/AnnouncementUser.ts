export class AnnouncementUser {
    id: number
    appUserId?: string
    announcementId?: number
    viewedAt?: Date
    customerId?: string

    constructor(announcementUser) {
        this.id = announcementUser.id
        this.appUserId = announcementUser.appUserId
        this.announcementId = announcementUser.announcementId
        this.customerId = announcementUser.customerId
        this.viewedAt = announcementUser.viewedAt
    }
}
