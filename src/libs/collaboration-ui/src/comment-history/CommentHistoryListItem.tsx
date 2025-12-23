import React, { ReactNode, useMemo } from 'react'

import { Link } from 'react-router-dom'

import FilterListIcon from '@mui/icons-material/FilterList'
import { Box, Divider, IconButton, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { Comment } from '@libs/common-models'
import { CommentAvatar } from '@libs/common-ui'
import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import CommentInput from '../visualization-comments/input/CommentInput'

export interface ICommentHistoryListItemProps {
    comment: Comment
    children?: ReactNode
}

const CommentHistoryListItem = ({ comment }: ICommentHistoryListItemProps) => {
    const { classes } = useStyles()
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()
    const { qSelectionMap } = useQlikSelectionContext()

    const handleRestoreBookmark = async () => {
        const qApp = qAppMap.get(qAppId)
        await qApp?.qEnigmaApi?.applyBookmark(comment?.qlikState.qsBookmarkId)
    }

    const isMatchingSelection = useMemo(
        () => qSelectionMap?.get(qAppId).qSelectionHash === comment.qlikState?.qsSelectionHash,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [qSelectionMap, comment]
    )

    const restoreBookmarkIconStyle = useMemo(
        () => (isMatchingSelection ? { fill: '#9fdb92' } : {}),
        [isMatchingSelection]
    )

    return (
        <Box display="flex" flexDirection="column" mt={3}>
            <Box display="flex" alignItems="flex-start">
                <CommentAvatar>{comment?.user?.initials || ''}</CommentAvatar>
                <Box display="flex" flexDirection="column" flexGrow={1}>
                    <Typography className={classes.text}>
                        <span className={classes.name}>{comment.user.fullName}</span>
                    </Typography>
                    <CommentInput comment={comment} isDisabled />
                    <Typography className={classes.timeText}>{comment.relativeDate}</Typography>
                </Box>

                <IconButton
                    component={Link}
                    to={comment.commentLink}
                    onClick={handleRestoreBookmark}
                    size="small">
                    <FilterListIcon style={restoreBookmarkIconStyle} />
                </IconButton>
            </Box>
            <Box mt={2} />
            <Divider orientation="horizontal" flexItem style={{ height: 1 }} />
        </Box>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    name: {
        color: theme.palette.primary.main,
        fontWeight: 600
    },
    text: {
        fontSize: '0.9rem'
    },
    timeText: {
        color: '#376072',
        fontWeight: 700,
        fontSize: 10,
        opacity: 0.5
    }
}))

export default CommentHistoryListItem
