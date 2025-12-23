import { Action, Comment } from '@libs/common-models'

import { actionService } from './actionService'
import { SocialService } from './core'

interface PaginationData {
    hasMore: boolean
    page: number
    total: number
}

interface CommentPayload {
    commentId?: number | null
    visualizationId?: number
    reportId?: number
    //qsUserId: string
    appUserId?: string
    qlikState?:
        | {
              qsBookmarkId: string
              qsSelectionHash: number
          }
        | unknown
        | null
    scope: string
    content: any
}

interface EditCommentPayload {
    comment: Partial<CommentPayload>
    commentId: number
}

interface GetCommentsPayload {
    scope: string
    visualizationId?: number
}

interface GetReportCommentsPayload {
    reportId?: number
}

interface GetCommentNotificationsPayload {
    scope: string
    //userId: string
    appUserId: string
}

interface CommentWithActions extends Comment {
    Actions: Action[]
}

export class CommentService {
    async getParentComment(commentId: number): Promise<Comment> {
        const { data: response } = await SocialService.getApi().getFull(
            `/comments/${commentId}?getParent=true`
        )

        return new Comment(response)
    }

    async getAllComments(
        params?: any
    ): Promise<{ comments: Comment[]; pagination: PaginationData }> {
        const { data: response } = await SocialService.getApi().getFull('/comments', { params })

        const comments = response.data.map((comment: any) => new Comment(comment))
        const pagination = {
            page: response.pagination.currentPage,
            hasMore: response.pagination.lastPage > response.pagination.currentPage,
            total: response.pagination.total
        }

        return { comments, pagination }
    }

    async addComment(comment: CommentPayload): Promise<Comment> {
        const { data: newComment } = await SocialService.getApi().post('/comments', comment)

        return new Comment(newComment)
    }

    async removeComment(commentId: number): Promise<boolean> {
        const response = await SocialService.getApi().delete(`/comments/${commentId}`)
        return response?.status === 204
    }

    async editComment({ comment, commentId }: EditCommentPayload): Promise<Comment> {
        const { data } = await SocialService.getApi().patch(`/comments/${commentId}`, comment)

        return new Comment(data)
    }

    async getReportComments(
        { reportId }: GetReportCommentsPayload,
        page = 1
    ): Promise<{ comments: Comment[]; pagination: PaginationData }> {
        try {
            const { data: response } = await SocialService.getApi().getFull(
                `/reports/${reportId}/comments`,
                {
                    params: { page }
                }
            )

            const comments = response.data.map((comment: any) => new Comment(comment))
            const pagination = {
                page: response.pagination.currentPage,
                hasMore: response.pagination.lastPage > response.pagination.currentPage,
                total: response.pagination.total
            }

            return {
                comments,
                pagination
            }
        } catch (e) {
            return null
        }
    }

    async getComments(
        { scope, visualizationId }: GetCommentsPayload,
        page = 1
    ): Promise<{ comments: Comment[]; pagination: PaginationData }> {
        const { data: response } = await SocialService.getApi().getFull(
            `/comments/${scope}/${visualizationId}`,
            { params: { page } }
        )

        const comments = response.data.map((comment: any) => new Comment(comment))
        const pagination = {
            page: response.pagination.currentPage,
            hasMore: response.pagination.lastPage > response.pagination.currentPage,
            total: response.pagination.total
        }

        return {
            comments,
            pagination
        }
    }

    async getCommentCount(
        visualizationId: number
    ): Promise<{ count: number; selectionHashes: Array<number | null> }> {
        try {
            return await SocialService.getApi().get(
                `/comments/visualizations/count/${visualizationId}`
            )
        } catch (error) {
            if (error && error.status !== 404) {
                throw error
            }

            return Promise.resolve({ count: 0, selectionHashes: [] })
        }
    }

    async getReportCommentCount(
        reportId: number
    ): Promise<{ count: number; selectionHashes: Array<number | null> }> {
        try {
            return await SocialService.getApi().get(`/comments/reports/count/${reportId}`)
        } catch (error) {
            if (error && error.status !== 404) {
                throw error
            }

            return Promise.resolve({ count: 0, selectionHashes: [] })
        }
    }

    async getCommentNotifications({
        scope,
        appUserId
    }: GetCommentNotificationsPayload): Promise<CommentWithActions[]> {
        const response = await SocialService.getApi().get(
            `/comments/user/notification/${appUserId}/${scope}`
        )

        return response.data
    }

    async getMentionedComments(
        page = 1
    ): Promise<{ actions: Action[]; pagination: PaginationData }> {
        const response = await SocialService.getApi().get(
            `/actions/comments?filter[viewedAt][eq]=null&page=${page}`
            //actions/comments?filter[_reportId][not]=null&filter[viewedAt][eq]=null&page=${page}`
        )

        const actions = response.data.map((a: any) => new Action(a))

        const pagination = {
            total: response.pagination.total,
            page: response.pagination.currentPage,
            hasMore: response.pagination.lastPage > response.pagination.currentPage
        }

        return {
            actions,
            pagination
        }
    }

    async markCommentMentionsAsRead(mentions: Action[]): Promise<number[]> {
        const updatedMentionsRequests = mentions.map((a: Action) => {
            const actionPayload = {
                actionId: a.id,
                payload: { viewedAt: new Date() }
            }

            return actionService.editAction(actionPayload)
        })

        const updatedMentions = await Promise.all(updatedMentionsRequests)

        return updatedMentions.map((a: any) => a.id)
    }
}

export const commentService = new CommentService()
