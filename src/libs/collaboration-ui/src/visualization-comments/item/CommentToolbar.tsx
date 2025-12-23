import React, { FC, memo } from 'react'

import ReplyIcon from '@mui/icons-material/Reply'
import { Button, Divider, Typography } from '@mui/material'
import Box from '@mui/material/Box'

import { makeStyles } from 'tss-react/mui'

import { useQlikReactionContext } from '@libs/collaboration-providers'
import { useI18n } from '@libs/common-providers'

import translation from '../../constants/translation'
import ReactionButton from '../../visualization-reactions/ReactionButton/ReactionButton'
import ReactionSummary from '../../visualization-reactions/ReactionSummary/ReactionSummary'

interface Props {
    commentId: number
    isEditing: boolean
    hasReactions: boolean
    onToggleEdit: () => void
    onShowReply: () => void
}

const CommentToolbar: FC<Props> = ({ commentId, hasReactions, isEditing, onShowReply }) => {
    const { t } = useI18n()
    const { classes } = useStyles()
    const { syncReactions } = useQlikReactionContext()

    return (
        <Box display="flex" alignItems="center" my={1}>
            {isEditing ? null : (
                <Box display="flex" alignItems="center" flexGrow="1">
                    <Box display="flex" alignItems="center" flexGrow={1}>
                        <ReactionButton isForComments targetId={commentId} />
                        {hasReactions && (
                            <>
                                <Box display="flex" alignItems="center" mx={1} height="24px">
                                    <Divider flexItem orientation="vertical" />
                                </Box>
                                <ReactionSummary
                                    isForComments
                                    handleSyncRemoveCallback={syncReactions}
                                />
                            </>
                        )}
                        <Divider flexItem orientation="vertical" />
                    </Box>
                    <Button
                        onClick={onShowReply}
                        startIcon={<ReplyIcon fontSize="small" color="action" />}>
                        <Typography className={classes.text}>
                            {t(translation.collaborationAddReply)}
                        </Typography>
                    </Button>
                </Box>
            )}
        </Box>
    )
}

export default memo(CommentToolbar)

const useStyles = makeStyles()(() => ({
    text: {
        fontSize: '0.85rem'
    }
}))
