import React, { useEffect } from 'react'

import { useLocation } from 'react-use'

import { Typography, Button } from '@mui/material'
import Box from '@mui/material/Box'

import {
    useCommentsState,
    fetchActiveComment,
    useCommentsDispatch,
    CommentsReplyProvider
} from '@libs/collaboration-providers'
import { useQuery } from '@libs/common-hooks'
import { usePaginationContext, useI18n } from '@libs/common-providers'
import { MyFacebookLoader } from '@libs/common-ui'

import translation from '../constants/translation'
import CommentListItem from './item/CommentListItem'

const CommentsList = () => {
    const { t } = useI18n()
    const { search } = useLocation()
    const queryParams = useQuery()
    const {
        comments,
        loading: commentsLoading,
        loadingMore,
        hasMore,
        activeComment
    } = useCommentsState()
    const { loadMore } = usePaginationContext()
    const commentDispatch = useCommentsDispatch()

    useEffect(() => {
        const activeCommentIdQuery = Number(queryParams.get('activeCommentId')) || null
        fetchActiveComment(commentDispatch, activeCommentIdQuery, activeComment)
    }, [search])

    if (comments.length === 0 && commentsLoading)
        return (
            <Box
                justifyContent="center"
                alignItems="center"
                p={2}
                minHeight="400px"
                style={{ marginTop: '-50px' }}>
                <MyFacebookLoader />
                <MyFacebookLoader />
            </Box>
        )

    if (comments.length === 0)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={2} minHeight="400px">
                {commentsLoading ? (
                    <MyFacebookLoader />
                ) : (
                    <Typography sx={{ fontSize: '0.925rem', fontStyle: 'oblique' }}>
                        {t(translation.collaborationEmptyComment)}
                    </Typography>
                )}
            </Box>
        )

    return (
        <Box display="flex" flexDirection="column" padding="16px" minHeight="400px">
            {commentsLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                    <MyFacebookLoader />
                </Box>
            )}
            {activeComment && (
                <CommentsReplyProvider key={`active-comment-${activeComment.id}`}>
                    <CommentListItem comment={activeComment} isActive />
                </CommentsReplyProvider>
            )}
            {comments.map(comment => (
                <CommentsReplyProvider key={comment.id}>
                    <CommentListItem comment={comment} />
                </CommentsReplyProvider>
            ))}
            {hasMore && (
                <Button onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? <MyFacebookLoader /> : t(translation.collaborationListMore)}
                </Button>
            )}
        </Box>
    )
}

export default CommentsList
