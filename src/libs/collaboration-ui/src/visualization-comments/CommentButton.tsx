import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { Box, IconButton, Typography, useTheme, Theme } from '@mui/material'

import querystring from 'query-string'
import { makeStyles } from 'tss-react/mui'

import { useQlikBaseSocialContext, useQlikSocialContext } from '@libs/collaboration-providers'
import { useQuery } from '@libs/common-hooks'
import { Badge, IconTooltip } from '@libs/common-ui'

import SvgChat from '../res/icons/SvgChat'
import CommentsDialog from './CommentsDialog'

const CommentButton = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const queryParams = useQuery()

    const { visualizationId, visComponentId, pageId } = useQlikBaseSocialContext()
    const { commentCount, matchingCommentCount, showCommentBadge } = useQlikSocialContext()

    let visualizationIdQuery = queryParams.get('visualizationId') || ''
    useEffect(() => {
        visualizationIdQuery = queryParams.get('visualizationId') || ''
    }, [navigate])
    const typeQuery = queryParams.get('type') || ''
    const queryString = querystring.stringify({
        visualizationId,
        visComponentId,
        type: 'comments'
    })

    const onOpenDialog = () => navigate(`${pageId}?${queryString}`)

    const { classes } = useStyles()

    return (
        <>
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                style={{ padding: '12px', paddingLeft: '16px' }}>
                <Box display="flex" alignItems="center">
                    <IconTooltip title="translate_comments">
                        <IconButton onClick={onOpenDialog} size="small">
                            {showCommentBadge ? (
                                <Badge badgeContent={matchingCommentCount} max={99}>
                                    {/* FIXME: Optimize styles */}
                                    <SvgChat
                                        fill={theme.palette.text.primary}
                                        className={classes.commentIcon}
                                    />
                                    ?
                                </Badge>
                            ) : (
                                <SvgChat
                                    fill={theme.palette.text.primary}
                                    className={classes.commentIcon}
                                />
                            )}
                        </IconButton>
                    </IconTooltip>
                    {commentCount.count > 0 && (
                        <>
                            <Box ml={1} />
                            <Typography
                                className={
                                    classes.text
                                }>{`${matchingCommentCount} of ${commentCount.count}`}</Typography>
                        </>
                    )}
                </Box>
            </Box>
            {visualizationIdQuery === String(visualizationId) && typeQuery === 'comments' && (
                <CommentsDialog />
            )}
        </>
    )
}

export default React.memo(CommentButton)

const useStyles = makeStyles()((theme: Theme) => ({
    text: {
        fontSize: '0.75rem'
    },
    commentIcon: {
        height: '22px',
        width: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7
    }
}))
