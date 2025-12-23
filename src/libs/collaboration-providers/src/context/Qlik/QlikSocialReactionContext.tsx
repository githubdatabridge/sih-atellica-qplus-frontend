import React, { useContext } from 'react'

type QlikSocialReactionContextType = {
    targetId: number | null
    givenSentiments: any[]
    reactionCount: number
    matchedReactionCount: number
    syncReactions: () => void
    previousReaction: any
    setPreviousReaction?: (reactionid: number | null) => void
    isLoadingReactions: boolean
}

export const QlikSocialReactionContext = React.createContext<QlikSocialReactionContextType>({
    targetId: null,
    givenSentiments: [],
    reactionCount: 0,
    matchedReactionCount: 0,
    previousReaction: null,
    setPreviousReaction: (_reactionId: number | null) => undefined,
    syncReactions: () => {
        throw new Error('syncReactions must be used within a QlikReactionProvider')
    },
    isLoadingReactions: false
})

export const useQlikReactionContext = () => {
    const context = useContext(QlikSocialReactionContext)
    return context
}
