import { format, formatDistance } from 'date-fns'

import { QlikState } from './QlikState'
import { Report } from './Report'
import { SocialUser } from './SocialUser'
import { Visualization } from './Visualization'

export class Comment {
    id: number
    /** Parent comment ID */
    commentId: number
    qlikStateId: number
    qlikState: QlikState
    visualizationId: number
    /** Format: domain\user, for example: DB-I-QS-DEV\insight */
    /*   qsUserId: string */
    appUserId?: string
    /** Stringified Draft.js EditorContent JSON  */
    content: string
    /** Application scope  */
    scope: string
    comments: Comment[]
    createdAt: Date
    updatedAt: Date
    user: SocialUser
    visualization: Visualization | null
    report: Report | null

    constructor(comment: any) {
        this.id = comment.id
        this.commentId = comment.commentId
        this.visualization = comment.visualization ? new Visualization(comment.visualization) : null
        this.visualizationId = comment.visualizationId
        this.qlikState = comment.qlikState
        this.qlikStateId = comment.qlikStateId
        this.content = comment.content
        this.appUserId = comment.appUserId
        this.scope = comment.scope
        this.createdAt = new Date(comment.createdAt)
        this.updatedAt = new Date(comment.updatedAt)
        this.comments =
            comment.comments && comment.comments.length > 0
                ? comment.comments.map((c: any) => new Comment(c))
                : []
        this.report = comment?.report
        this.user = new SocialUser(comment.user)
    }

    get commentLink(): string {
        const pageId = this.visualization
            ? this.visualization.pageId.replace(/_/g, '/')
            : this.report.pageId.replace(/_/g, '/')

        const params = new URLSearchParams({
            type: 'comments',
            activeCommentId: `${this.id}`,
            op: 'restore'
        })

        if (this.report) {
            params.append('reportId', this.report.id.toString())
        } else {
            params.append('visualizationId', this.visualization.id.toString())
            params.append('visComponentId', this.visualization.componentId.toString())
        }

        return `/${pageId}?${params.toString()}`
    }

    get userInitials(): string {
        try {
            const first = this.user.firstName[0]
            const last = this.user.lastName[0]
            return first + last
        } catch {
            return 'AU'
        }
    }

    get parsedContent(): string {
        const { blocks } = JSON.parse(this.content)
        const mappedBlocks = blocks.map(block => (!block.text.trim() && '\n') || block.text)
        return mappedBlocks.reduce((acc, block) => {
            let returned = acc
            if (block === '\n') returned += block
            else returned += `${block}\n`
            return returned
        }, '')
    }

    get hasLink(): boolean {
        return !!this.visualization || !!this.report
    }

    get createdDate(): string {
        return format(this.createdAt, 'dd/MM/yyyy, HH:mm')
    }

    get relativeDate(): string {
        return formatDistance(this.createdAt, new Date(), { addSuffix: true })
    }
}
