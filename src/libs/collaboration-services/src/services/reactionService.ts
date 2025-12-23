import { Reaction } from '@libs/collaboration-models'

import { SocialService } from './core'

interface ReactionPayload {
    commentId?: number
    visualizationId?: number
    score: number
    scope: string
    qlikState?: {
        qsBookmarkId: string
        qsSelectionHash: number
    }
}

interface EditReactionPayload {
    reaction: Partial<ReactionPayload>
    reactionId: number
}

interface GetReactionsPayload {
    scope: string
    targetId: number
    score: number
    content: 'visualization' | 'comment'
}

interface GetReactionCountPayload {
    scope: string
    targetId: number
    content?: 'visualization' | 'comment'
}

interface GetCommentSentiments {
    scope: string
    commentId: number
}
interface GetPreviousReaction {
    scope: string
    commentId: number
    userId: string
}

interface SentimentWithHashes {
    score: number
    selectionHashes: number[]
}

interface CountWithHashes {
    count: number
    selectionHashes: number[]
    sentiments: SentimentWithHashes[]
}

export class ReactionService {
    async addReaction(reaction: ReactionPayload): Promise<Reaction> {
        const { data: newReaction } = await SocialService.getApi().post('/reactions', reaction)

        return new Reaction(newReaction)
    }

    async editReaction({ reactionId, reaction }: EditReactionPayload): Promise<boolean> {
        const { data } = await SocialService.getApi().put(`/reactions/${reactionId}`, reaction)

        return Boolean(data.success)
    }

    async removeReaction(reactionId: number): Promise<boolean> {
        const { data } = await SocialService.getApi().delete(`/reactions/${reactionId}`)
        return data
    }

    async getReactionsBySentiment({
        scope,
        targetId,
        score,
        content = 'visualization'
    }: GetReactionsPayload): Promise<
        { /*qsUserId: string;*/ appUserId: string; reactions: Reaction[] }[]
    > {
        const { data: reactions } = await SocialService.getApi().getFull(
            `/reactions/${content}/${scope}/${targetId}/${score}`
        )

        return reactions
    }

    async getReactionCount({
        scope,
        targetId,
        content = 'visualization'
    }: GetReactionCountPayload): Promise<number> {
        const { data: count } = await SocialService.getApi().getFull(
            `/reactions/${content}/count/${scope}/${targetId}`
        )

        return count
    }

    async getSentiments(scope: string, visualizationId: number): Promise<number[]> {
        const sentiments = await SocialService.getApi().get(
            `/reactions/visualization/sentiment/${scope}/${visualizationId}`
        )

        return sentiments
    }

    async getReactionSentimentsByHash({
        scope,
        targetId
    }: GetReactionCountPayload): Promise<SentimentWithHashes[]> {
        try {
            const path = `/reactions/score/hash/${scope}/${targetId}`
            const { data: sentiments } = await SocialService.getApi().getFull(path)

            return sentiments
        } catch (error) {
            if (error && error.status !== 404) {
                throw error
            }

            return Promise.resolve([])
        }
    }

    async getReactionCountByHash({
        scope,
        targetId,
        content = 'visualization'
    }: GetReactionCountPayload): Promise<CountWithHashes> {
        const path =
            content === 'visualization'
                ? `/reactions/score/hash/${scope}/${targetId}`
                : `/comment/count/hash/${scope}/${targetId}`

        try {
            const { data } = await SocialService.getApi().getFull(path)

            const count = data.reduce((total: any, rc: any) => {
                return total + rc.selectionHashes.length
            }, 0)

            const selectionHashes: any[] = []

            data.forEach((element: any) => {
                element.selectionHashes.forEach((e: any) => selectionHashes.push(e))
            })

            return {
                count,
                selectionHashes,
                sentiments: data
            }
        } catch (error) {
            if (error && error?.status !== 404) {
                throw error
            }

            return Promise.resolve({
                count: 0,
                selectionHashes: [],
                sentiments: []
            })
        }
    }

    async getCommentSentiments({
        scope,
        commentId
    }: GetCommentSentiments): Promise<SentimentWithHashes[]> {
        try {
            const { data: sentiments } = await SocialService.getApi().getFull(
                `/reactions/score/comment/${scope}/${commentId}`
            )
            return sentiments
        } catch (error) {
            if (error.status !== 404) {
                throw error
            }
            return Promise.resolve([])
        }
    }

    async getPreviousReactionId({
        scope,
        commentId,
        userId
    }: GetPreviousReaction): Promise<number | null> {
        try {
            //const reaction = await SocialService.getApi().get(`/reactions/${commentId}/${userId}/${scope}`)
            const reaction = await SocialService.getApi().get(
                `/reactions?filter[appUserId][eq]=${userId}&filter[scope][eq]=${scope}&filter[commentId][eq]=${commentId}`
            )
            return reaction.id
        } catch (error) {
            if (error.status !== 404) {
                throw error
            }
            return Promise.resolve(null)
        }
    }
}

export const reactionService = new ReactionService()
