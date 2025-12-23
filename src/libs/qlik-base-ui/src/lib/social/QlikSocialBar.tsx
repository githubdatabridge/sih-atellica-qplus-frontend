import React, { useEffect, useState, useCallback, FC, Suspense, lazy } from 'react'

import { Box, Divider, CircularProgress } from '@mui/material'

import {
    QlikSocialReactionContext,
    CommentCount,
    commentCountDefaultValue,
    QlikSocialCommentContext,
    useQlikBaseSocialContext,
    useNotificationContext
} from '@libs/collaboration-providers'
import { reactionService, commentService } from '@libs/collaboration-services'
import { useAuthContext } from '@libs/common-providers'
import { ReactionLoader } from '@libs/common-ui'
import { useQlikApp } from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

// Lazy load collaboration-ui components to defer Draft.js loading
const CommentButton = lazy(() => import('@libs/collaboration-ui').then(m => ({ default: m.CommentButton })))
const ReactionSummary = lazy(() => import('@libs/collaboration-ui').then(m => ({ default: m.ReactionSummary })))
const ReactionButton = lazy(() => import('@libs/collaboration-ui').then(m => ({ default: m.ReactionButton })))

export interface IQlikSocialBarProps {
    /**
     * Overrides the qlikAppId (if left empty it's taken from the currentCompany)
     */
    qlikAppId?: string
}

/**
 * Component description
 */
export const QlikSocialBar: FC<IQlikSocialBarProps> = ({ qlikAppId }) => {
    const { customerId, appUser, appUserList } = useAuthContext()
    const qlikAppContext = useQlikApp(qlikAppId)
    const { qSelectionMap } = useQlikSelectionContext()
    const { visualizationId, visComponentId, reportId } = useQlikBaseSocialContext()
    const [showCommentBadge, setShowCommentBadge] = useState<boolean>(false)
    const [showSentimentBadge, setShowSentimentBadge] = useState<boolean>(false)
    const [commentCount, setCommentCount] = useState<CommentCount>(commentCountDefaultValue)
    const [matchingCommentCount, setMatchingCommentCount] = useState(0)
    const [reactionCount, setReactionCount] = useState(0)
    const [givenSentiments, setGivenSentiments] = useState<any[]>([])
    const [previousReaction] = useState<any>(null)
    const [matchedReactionCount, setMatchedReactionCount] = useState(0)
    const [isLoadingReactions, setIsLoadingReactions] = useState(false)
    const [reactionSelectionHashes, setReactionSelectionHashes] = useState<number[]>([])
    const { customerReactionCountChangedSubject, customerCommentCountChangedSubject } =
        useNotificationContext()

    const [isDisabled, setIsDisabled] = useState(false)

    const scope = `SOCIAL_${qlikAppContext.qAppId}`

    const syncReactions = useCallback(async () => {
        try {
            setIsLoadingReactions(true)

            const count = await reactionService.getReactionCountByHash({
                scope,
                targetId: Number(visualizationId)
            })

            setReactionCount(count.count)
            setReactionSelectionHashes(count.selectionHashes)
            setGivenSentiments(count.sentiments)
        } catch (error) {
            console.log('Qplus Error', error)
        } finally {
            setIsLoadingReactions(false)
        }
    }, [scope, visualizationId])

    useEffect(() => {
        const qSelection = qSelectionMap.get(qlikAppId)
        const matchedCount = reactionSelectionHashes.reduce(
            (total, hash) => (qSelection?.qSelectionHash === hash ? total + 1 : total),
            0
        )

        setMatchedReactionCount(matchedCount)
    }, [qSelectionMap, qlikAppId, reactionSelectionHashes])

    useEffect(() => {
        if (!visualizationId) return

        void (async () => {
            setIsDisabled(true)
            await Promise.all([syncReactions(), syncComments()])
            setIsDisabled(false)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visualizationId])

    const syncComments = useCallback(async () => {
        const commentCount = await commentService.getCommentCount(visualizationId as number)
        setCommentCount(commentCount)
    }, [visualizationId])

    const setSentimentBadgeVisibility = useCallback(
        (show: boolean) => {
            setShowSentimentBadge(show)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [visualizationId]
    )

    const setCommentBadgeVisibility = useCallback((show: boolean) => {
        setShowCommentBadge(show)
    }, [])

    useEffect(() => {
        if (!visualizationId) return
    }, [syncComments, visualizationId])

    useEffect(() => {
        const qSelection = qSelectionMap.get(qlikAppId)
        const matchedCount = commentCount.selectionHashes.reduce(
            (total: any, hash: any) => (qSelection?.qSelectionHash === hash ? total + 1 : total),
            0
        )
        setMatchingCommentCount(matchedCount)
    }, [commentCount.selectionHashes, qSelectionMap, qlikAppId])

    const [userMentionSuggestions, setUserMentionSuggestions] = useState<any[]>([])

    useEffect(() => {
        void (async () => {
            const filterMentionUsers = appUserList.filter(u => {
                return u.id !== appUser.appUserId
            })
            setUserMentionSuggestions(filterMentionUsers)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId, reportId, visualizationId])

    useEffect(() => {
        if (!visualizationId) return

        if (customerCommentCountChangedSubject) {
            customerCommentCountChangedSubject.attach(observer => {
                if (Number(observer.data?.visualizationId) === Number(visualizationId)) {
                    setTimeout(() => {
                        syncComments()
                    }, 2000)
                }
            })
        }

        return () => customerCommentCountChangedSubject?.detach(_observer => undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerCommentCountChangedSubject, visualizationId])

    useEffect(() => {
        if (!visualizationId) return

        if (customerReactionCountChangedSubject) {
            customerReactionCountChangedSubject.attach(observer => {
                if (Number(observer.data?.visualizationId) === Number(visualizationId)) {
                    syncReactions()
                }
            })
        }

        return () => customerReactionCountChangedSubject?.detach(_observer => undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerReactionCountChangedSubject, visualizationId])

    return (
        <QlikSocialCommentContext.Provider
            value={{
                commentCount,
                matchingCommentCount,
                userMentionSuggestions,
                showCommentBadge,
                showSentimentBadge,
                syncComments,
                setCommentBadgeVisibility,
                setSentimentBadgeVisibility
            }}>
            <QlikSocialReactionContext.Provider
                value={{
                    targetId: visualizationId,
                    reactionCount,
                    givenSentiments,
                    syncReactions,
                    previousReaction,
                    matchedReactionCount,
                    isLoadingReactions
                }}>
                <Box display="flex" flexDirection="column" position="relative">
                    <Box
                        display="flex"
                        position="absolute"
                        top={0}
                        left={0}
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                        style={{
                            background: '#fff',
                            zIndex: 100
                        }}>
                        <ReactionLoader />
                    </Box>
                    <Box alignItems="center" display="flex" flexWrap="nowrap">
                        <Suspense fallback={<CircularProgress size={16} />}>
                            <ReactionButton
                                targetId={Number(visualizationId)}
                                key={visComponentId}
                                isDisabled={isDisabled}
                            />
                            {reactionCount > 0 && (
                                <>
                                    <Divider orientation="vertical" flexItem />
                                    <ReactionSummary />
                                </>
                            )}
                            <Box flexGrow="1" />
                            <Divider orientation="vertical" flexItem />
                            <CommentButton />
                        </Suspense>
                    </Box>
                </Box>
            </QlikSocialReactionContext.Provider>
        </QlikSocialCommentContext.Provider>
    )
}

export default React.memo(QlikSocialBar)
