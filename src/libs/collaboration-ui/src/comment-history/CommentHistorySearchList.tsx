import React from 'react'

import { Box, Typography } from '@mui/material'

import { Comment } from '@libs/common-models'
import { useI18n } from '@libs/common-providers'
import { LoadingContent, MyFacebookLoader } from '@libs/common-ui'

import translation from '../constants/translation'
import CommentHistoryListItem from './CommentHistoryListItem'

export interface ICommentHistorySearchListProps {
    comments: Comment[]
    loading?: boolean
}

const CommentHistorySearchList = ({ comments, loading }: ICommentHistorySearchListProps) => {
    const { t } = useI18n()
    if (loading) return <LoadingContent />

    if (comments.length === 0)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={2} minHeight="350px">
                {loading ? (
                    <MyFacebookLoader />
                ) : (
                    <Typography sx={{ fontSize: '0.925rem', fontStyle: 'oblique' }}>
                        {t(translation.collaborationEmptyComment)}
                    </Typography>
                )}
            </Box>
        )

    return (
        <>
            {comments.map(c => (
                <CommentHistoryListItem key={c.id} comment={c} />
            ))}
        </>
    )
}

export default CommentHistorySearchList
