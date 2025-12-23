import React, { useRef } from 'react'

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import { Badge, Box, IconButton, Menu, ButtonBase, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import {
    markCommentMentionsAsRead,
    useCommentMentionsDispatch,
    useCommentMentionsState,
    CommentMentionsProvider
} from '@libs/collaboration-providers'
import { useI18n, PaginationProvider } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import translation from '../../constants/translation'
import NotificationCommentList from './NotificationCommentList'

const NCButton = () => {
    const menuButtonRef = useRef(null)
    const dispatch = useCommentMentionsDispatch()

    const { classes } = useStyles()
    const { t } = useI18n()

    const [bookmarkMenu, setBookmarkMenu] = React.useState<null | HTMLElement>(null)

    const bookmarkMenuClick = () => {
        setBookmarkMenu(menuButtonRef.current)
    }

    const bookmarkMenuClose = () => {
        setBookmarkMenu(null)
    }
    const { commentMentionsPagination, commentMentions } = useCommentMentionsState()

    const markAllAsRead = () => {
        markCommentMentionsAsRead(
            dispatch,
            commentMentions,
            commentMentions,
            commentMentionsPagination,
            true
        )
    }

    return (
        <>
            <IconTooltip title={'Notifications'}>
                <ButtonBase
                    ref={menuButtonRef}
                    onClick={bookmarkMenuClick}
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    className={classes.button}>
                    <Badge
                        badgeContent={commentMentionsPagination.total}
                        classes={{ badge: classes.customBadge }}
                        max={99}>
                        <NotificationsNoneIcon className={classes.icon} />
                    </Badge>
                </ButtonBase>
            </IconTooltip>
            <Menu
                id="notification-menu"
                anchorEl={bookmarkMenu}
                keepMounted
                open={Boolean(bookmarkMenu)}
                onClose={bookmarkMenuClose}
                elevation={0}
                // getContentAnchorEl={null}
                PaperProps={{
                    style: {
                        minHeight: 100,
                        maxHeight: 500,
                        marginRight: 0,
                        marginLeft: '80% !important'
                    }
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 0,
                    horizontal: 'left'
                }}
                classes={{ paper: classes.menu }}>
                <Box display="flex" flexDirection="column" p={2}>
                    <Box display="flex" alignItems="center">
                        <Typography className={classes.menuTitle}>
                            {t(translation.commentMenuNotificationTitle)}
                        </Typography>
                        {commentMentions.length > 0 && (
                            <IconTooltip title={'Mark all as read'}>
                                <IconButton onClick={markAllAsRead} size="small">
                                    <PlaylistAddCheckIcon className={classes.readAllIcon} />
                                </IconButton>
                            </IconTooltip>
                        )}
                    </Box>
                    <Box mb={1} />
                    <NotificationCommentList />
                </Box>
            </Menu>
        </>
    )
}

const NotificationCommentButton = () => {
    return (
        <PaginationProvider>
            <CommentMentionsProvider>
                <NCButton />
            </CommentMentionsProvider>
        </PaginationProvider>
    )
}

const useStyles = makeStyles()((theme: Theme & any) => ({
    menuTitle: {
        fontWeight: 500,
        flexGrow: 1
    },
    listItem: {
        minWidth: '25px',
        padding: '0px'
    },
    customBadge: {
        backgroundColor: '#E87811',
        fontSize: '0.6rem',
        color: '#FFF'
    },
    listIcon: {
        color: theme.palette.common.white
    },
    button: {
        height: 60,
        width: 60,
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.primary,
        padding: theme.spacing(1),
        textAlign: theme.direction === 'ltr' ? 'left' : 'right',
        marginRight: '10px'
    },
    icon: {
        height: 28,
        width: 28
    },
    menu: {
        minWidth: 260,
        maxWidth: 340,
        color: theme.palette.primary.main,
        boxShadow: '0 2px 16px rgb(0 0 0 / 10%)'
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        fontSize: '0.85rem',
        width: '31px',
        height: '31px'
    },
    user: {
        fontSize: '0.75rem',
        fontWeight: 600
    },
    company: {
        fontSize: '0.625rem',
        fontWeight: 550,
        color: '#FFFFFF99'
    },
    readAllIcon: {
        fill: theme.palette.common.white
    }
}))

export default React.memo(NotificationCommentButton)
