export class AnnouncementItem {
    id: number
    announcementId: number
    itemLabelKey?: string
    rank?: number

    constructor(announcementItem) {
        this.id = announcementItem.id
        this.announcementId = announcementItem.announcementId
        this.itemLabelKey = announcementItem.itemLabelKey
        this.rank = announcementItem.rank
    }
}
