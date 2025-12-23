import { SocialUser, Visualization } from '@libs/common-models'

import { QlikState } from './QlikState'

export class Reaction {
    id: number
    // qsUserId: string
    appUserId: string
    qlikState: QlikState
    qlikStateId: number
    scope: string
    score: number
    visualizationId: number | null
    visualization: Visualization | null
    commentId: number | null
    comment: Comment | null
    /** Format: domain\user, for example: DB-I-QS-DEV\insight */
    createdAt: Date
    updatedAt: Date
    user: SocialUser

    constructor(reaction: any) {
        this.id = reaction.id
        /*  this.qsUserId = reaction.qsUserId */
        this.appUserId = reaction.appUserId
        this.qlikState = reaction.qlikState
        this.qlikStateId = reaction.qlikStateId
        this.scope = reaction.scope
        this.score = reaction.score
        this.visualizationId = reaction.visualizationId
        this.visualization = reaction.visualization
            ? new Visualization(reaction.visualization)
            : null
        this.commentId = reaction.commentId
        this.comment = new Comment(reaction.comment)
        this.createdAt = new Date(reaction.createdAt)
        this.updatedAt = new Date(reaction.updatedAt)
        this.user = new SocialUser(reaction.user)
    }
}
