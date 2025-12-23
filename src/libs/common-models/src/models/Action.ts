import { format, formatDistance } from 'date-fns'

import { Comment } from './Comment'
import { Report } from './Report'

export class Action {
    id: number
    appUserId: string
    type: string
    viewedAt?: Date | null
    reportId?: number
    commentId?: number
    report?: Report
    comment?: Comment
    createdAt: Date
    updatedAt: Date
    deletedAt: Date

    constructor(action: any) {
        this.id = action.id
        this.appUserId = action.appUserId
        this.type = action.type
        this.viewedAt = action.viewedAt || null
        this.reportId = action.reportId
        this.report = action.reportId ? new Report(action.report, action.createdAt) : null
        this.commentId = action.commentId
        this.comment = action.commentId ? new Comment(action.comment) : null
        this.createdAt = new Date(action.createdAt)
        this.updatedAt = new Date(action.updatedAt)
        this.deletedAt = new Date(action.deletedAt)
    }

    get createdDate(): string {
        return format(this.createdAt, 'dd/MM/yyyy, HH:mm')
    }

    get relativeDate(): string {
        return formatDistance(this.createdAt, new Date(), { addSuffix: true })
    }
}
