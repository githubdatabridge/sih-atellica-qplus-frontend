import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'

import { usePromise } from 'react-use'

import { Divider, Theme, Typography } from '@mui/material'
import Box from '@mui/material/Box'

import { makeStyles } from 'tss-react/mui'

import {
    addComment,
    QlikSocialReactionContext,
    removeComment,
    setComments,
    useCommentsDispatch,
    useCommentsReplyDispatch,
    useCommentsReplyState,
    useQlikBaseSocialContext,
    useQlikSocialContext
} from '@libs/collaboration-providers'
import { commentService, reactionService } from '@libs/collaboration-services'
import { Comment } from '@libs/common-models'
import { useAuthContext, useI18n } from '@libs/common-providers'
import { CommentAvatar, CommentBox } from '@libs/common-ui'
import { useQlikAppContext, useQlikSelectionContext } from '@libs/qlik-providers'

import translation from '../../constants/translation'
import CommentInput from '../input/CommentInput'
import CommentItemHeader from './CommentItemHeader'
import CommentToolbar from './CommentToolbar'

interface QlikCommentListItemProps {
    comment: Comment
    isReply?: boolean
    isActive?: boolean
}

const CommentListItem: FC<QlikCommentListItemProps> = ({
    comment,
    isReply = false,
    isActive = false
}) => {
    const mounted = usePromise()
    const { classes } = useStyles()
    const { t } = useI18n()
    const { appUser } = useAuthContext()
    const { scope, qlikAppId } = useQlikBaseSocialContext()

    const { qAppMap } = useQlikAppContext()
    const { qSelectionMap } = useQlikSelectionContext()

    const { comments: collaborationReplies } = useCommentsReplyState()
    const replyDispatch = useCommentsReplyDispatch()
    const commentsDispatch = useCommentsDispatch()
    const { syncComments } = useQlikSocialContext()

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isShowingReplies, setIsShowingReplies] = useState<boolean>(false)
    const [reactionCount, setReactionCount] = useState<number>(0)
    const [matchedReactionCount] = useState<number>(0)
    const [givenSentiments, setGivenSentiments] = useState<any[]>([])
    const [previousReaction, setPreviousReaction] = useState<number | null>(null)

    const [isLoadingReactions, setIsLoadingReactions] = useState(false)

    const isMatchingSelection = useMemo(
        () => qSelectionMap?.get(qlikAppId)?.qSelectionHash === comment.qlikState?.qsSelectionHash,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [qSelectionMap, comment]
    )

    useEffect(() => {
        replyDispatch(setComments(comment.comments))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment.comments])

    const toggleIsEditing = useCallback(() => {
        setIsEditing(prev => !prev)
    }, [])

    const syncReactions = useCallback(async () => {
        try {
            setIsLoadingReactions(true)
            const sentimentsRequest = reactionService.getCommentSentiments({
                scope,
                commentId: comment.id
            })
            const sentiments = await mounted(sentimentsRequest)

            setGivenSentiments(sentiments)
            setReactionCount(sentiments?.length || 0)

            const previousReactionRequest = reactionService.getPreviousReactionId({
                scope,
                commentId: comment.id,
                userId: encodeURIComponent(encodeURIComponent(appUser?.appUserId as string))
            })

            const previousReaction = await mounted(previousReactionRequest)
            setPreviousReaction(previousReaction)
        } catch (error) {
            console.log('Qplus Error', error)
        } finally {
            setIsLoadingReactions(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scope, comment.id, appUser])

    useEffect(() => {
        syncReactions()
    }, [syncReactions])

    const handleOnShowReply = async () => {
        setIsShowingReplies(true)
    }

    const handleRestoreBookmark = async () => {
        const qApp = qAppMap.get(qlikAppId)
        await qApp?.qEnigmaApi?.applyBookmark(comment?.qlikState?.qsBookmarkId)
    }

    const handleRemoveComment = async () => {
        try {
            const isRemoved = await mounted(commentService.removeComment(comment.id))

            if (isRemoved) {
                // We have to use this dispatcher to sync comments after deletion
                comment?.commentId
                    ? replyDispatch(removeComment(comment.id))
                    : commentsDispatch(removeComment(comment.id))
            }
            syncComments()
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }

    const handleAddReply = (comment: Comment) => replyDispatch(addComment(comment))

    return (
        <QlikSocialReactionContext.Provider
            value={{
                syncReactions,
                reactionCount,
                givenSentiments,
                previousReaction,
                isLoadingReactions,
                setPreviousReaction,
                matchedReactionCount,
                targetId: comment.id
            }}>
            <Box display="flex" alignItems="flex-start" mb={2}>
                <CommentAvatar isMatchingSelection={isMatchingSelection} isHighlighted={isActive}>
                    {comment?.user?.initials || ''}
                </CommentAvatar>
                <CommentBox isMatchingSelection={isMatchingSelection} isHighlighted={isActive}>
                    <CommentItemHeader
                        comment={comment}
                        isMatchingSelection={isMatchingSelection}
                        onRemoveComment={handleRemoveComment}
                        onRestoreBookmark={handleRestoreBookmark}
                        toggleEditing={toggleIsEditing}
                    />
                    <CommentInput
                        comment={comment}
                        isDisabled={!isEditing}
                        isEditing={isEditing}
                        toggleEditing={toggleIsEditing}
                    />
                    <CommentToolbar
                        commentId={comment.id}
                        hasReactions={reactionCount > 0}
                        isEditing={isEditing}
                        onToggleEdit={toggleIsEditing}
                        onShowReply={handleOnShowReply}
                    />
                    <Divider />
                    {!isReply && !isShowingReplies && collaborationReplies.length > 0 && (
                        <Typography
                            onClick={handleOnShowReply}
                            style={{ cursor: 'pointer' }}
                            className={classes.text}>
                            {t(translation.collaborationViewComment)} {collaborationReplies.length}{' '}
                            {t(translation.collaborationRepliesComment)}
                        </Typography>
                    )}
                    {!isReply && isShowingReplies && (
                        <Box display="flex" flexDirection="column" mt={2} mb={1}>
                            {collaborationReplies.map((reply: Comment) => (
                                <CommentListItem
                                    isReply
                                    comment={reply}
                                    key={`comment-reply-${reply.id}`}
                                />
                            ))}
                            <CommentInput
                                parentComment={comment}
                                parentId={comment.commentId || comment.id}
                                placeholder={t(translation.collaborationPlaceHolderWriteReply)}
                                onAddReply={handleAddReply}
                                isInput
                            />
                        </Box>
                    )}
                </CommentBox>
            </Box>
        </QlikSocialReactionContext.Provider>
    )
}

export default memo(CommentListItem)

const useStyles = makeStyles()((theme: Theme) => ({
    text: {
        fontSize: '0.85rem'
    }
}))
