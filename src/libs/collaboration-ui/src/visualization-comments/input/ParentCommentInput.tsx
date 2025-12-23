import React, { memo } from 'react'

import Box from '@mui/material/Box'

import { addComment, useCommentsDispatch } from '@libs/collaboration-providers'
import { Comment } from '@libs/common-models'
import { useI18n } from '@libs/common-providers'

import translation from '../../constants/translation'
import CommentInput from './CommentInput'

const ParentCommentInput = () => {
    const { t } = useI18n()
    const commentsDispatch = useCommentsDispatch()

    const handleAddComment = (comment: Comment) => {
        commentsDispatch(addComment(comment))
    }

    return (
        <Box display="flex" alignItems="start" flexDirection="row" p={2}>
            <CommentInput
                isInput
                placeholder={t(translation.collaborationPlaceHolderWriteComment)}
                onAddComment={handleAddComment}
            />
        </Box>
    )
}

export default memo(ParentCommentInput)
