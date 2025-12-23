import React from 'react'

import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-use'

import { Badge, Fab, Theme } from '@mui/material'

import './animation.css'

export interface ICHButtonProps {
    cssFab?: any
    cssBadge?: any
}
/**
 * Component description
 */
const CHButton: React.FC<ICHButtonProps> = ({ cssFab, cssBadge }) => {
    const { classes } = useStyles()
    const navigate = useNavigate()
    const queryParams = useQuery()

    const { total } = useCommentsState()

    const typeQuery = queryParams.get('type') || ''
    const { pathname: pageId } = useLocation()
    const queryString = querystring.stringify({
        type: 'commentHistory'
    })

    const onOpenDialog = () => {
        navigate(`${pageId}?${queryString}`)
    }

    return (
        <>
            <Fab onClick={onOpenDialog} className={classes.fab} style={cssFab}>
                <Badge
                    badgeContent={total}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                    classes={{ badge: classes.badge }}
                    style={cssBadge}
                    max={999}>
                    <SvgCommentHistory />
                </Badge>
            </Fab>
            {typeQuery === 'commentHistory' && <CommentHistoryDialog />}
        </>
    )
}

/**
 * Component description
 */
export const CommentHistoryButton: React.FC<ICHButtonProps> = ({ cssFab, cssBadge }) => {
    return (
        <PaginationProvider>
            <CommentsProvider isGeneral>
                <CHButton cssFab={cssFab} cssBadge={cssBadge} />
            </CommentsProvider>
        </PaginationProvider>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 800, //theme.zIndex.modal + 1,
        background: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main
        }
    },
    badge: {
        background: '#bbdc00',
        zIndex: 810, //theme.zIndex.modal + 2,
        fontWeight: 600,
        top: '-10px',
        left: '-10px',
        animation: 'cPulse 1.5s infinite'
    }
}))

export default CommentHistoryButton

import querystring from 'query-string'
import { makeStyles } from 'tss-react/mui'

import { CommentsProvider, useCommentsState } from '@libs/collaboration-providers'
import { useQuery } from '@libs/common-hooks'
import { PaginationProvider } from '@libs/common-providers'

import SvgCommentHistory from '../res/icons/SvgCommentHistory'
import CommentHistoryDialog from './CommentHistoryDialog'
