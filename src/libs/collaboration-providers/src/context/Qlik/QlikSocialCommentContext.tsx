import { createContext, useContext } from 'react'

export type CommentCount = {
    count: number
    selectionHashes: Array<number | null>
}

export type QlikSocialCommentContextType = {
    commentCount?: CommentCount
    matchingCommentCount?: number
    syncComments?: () => void
    userMentionSuggestions: any[]
    showCommentBadge?: boolean
    setCommentBadgeVisibility?: (show: boolean) => void
    showSentimentBadge?: boolean
    setSentimentBadgeVisibility?: (show: boolean) => void
}

export const commentCountDefaultValue = {
    count: 0,
    selectionHashes: []
}

const contextValue = {
    commentCount: commentCountDefaultValue,
    matchingCommentCount: 0,
    showCommentBadge: false,
    showSentimentBadge: false,
    userMentionSuggestions: []
}

export const QlikSocialCommentContext = createContext<QlikSocialCommentContextType>(contextValue)

export const useQlikSocialContext = () => useContext(QlikSocialCommentContext)
