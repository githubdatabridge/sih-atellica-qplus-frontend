import { FC, useState } from 'react'

import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'

import CommentIcon from '@mui/icons-material/Comment'
import {
    Avatar,
    Box,
    CircularProgress,
    Divider,
    IconButton,
    Theme,
    Typography,
    useTheme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import {
    markCommentMentionsAsRead,
    useCommentMentionsDispatch,
    useCommentMentionsState
} from '@libs/collaboration-providers'
import { Action } from '@libs/common-models'
import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { useQlikApp, useQlikLoaderContext } from '@libs/qlik-providers'

import translation from '../../constants/translation'

interface INotificationCommentListItemProps {
    mention: Action
    handleCommentItemRestoreCallback?: () => void
    color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

const NotificationCommentListItem: FC<INotificationCommentListItemProps> = ({
    mention,
    handleCommentItemRestoreCallback,
    color
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { comment, relativeDate } = mention
    const { classes } = useStyles()
    const { qEnigmaApi } = useQlikApp()
    const { isQlikMasterItemLoading } = useQlikLoaderContext()
    const dispatch = useCommentMentionsDispatch()
    const { commentMentions, commentMentionsPagination } = useCommentMentionsState()
    const { t } = useI18n()
    const theme = useTheme()

    const translateRoleHelper = (role: string) => {
        let mappedRole = ''
        switch (role) {
            case 'SysAdmin':
                mappedRole = t(translation.roleSysAdmin)
                break
            case 'ContentAdmin':
                mappedRole = t(translation.roleContentAdmin)
                break

            default:
                mappedRole = t(translation.roleUser)
                break
        }
        return mappedRole
    }

    const handleRestoreBookmark = async () => {
        setIsLoading(true)
        await markCommentMentionsAsRead(
            dispatch,
            [mention],
            commentMentions,
            commentMentionsPagination
        )
        if (comment?.qlikState?.qsBookmarkId)
            await qEnigmaApi?.applyBookmark(comment?.qlikState.qsBookmarkId)
        setIsLoading(false)
        if (handleCommentItemRestoreCallback) handleCommentItemRestoreCallback()
    }

    const renderContent = comment?.report
        ? `${t(translation.commentTypeReport)} "<b>${comment?.report?.title}</b>"`
        : `<b>${t(translation.commentTypeVisualization)}</b> ${t(translation.commentMsgFollowing)}:`

    const truncatedContent =
        comment?.parsedContent?.length > 200
            ? `${comment?.parsedContent?.slice(0, 200 - 1)}…`
            : comment?.parsedContent

    const UserAvatar = () => <Avatar className={classes.avatar}>{comment?.user?.initials}</Avatar>

    const UserInfo = () => (
        <Box display="flex" flexDirection="column" flexGrow={1}>
            <Typography className={classes.text}>
                <span className={classes.role}>{translateRoleHelper(comment?.user?.role)}</span>{' '}
                <span className={classes.name}>{comment?.user?.fullName}</span> {t(mention.type)}
                {ReactHtmlParser(renderContent)}
            </Typography>
            <Typography className={classes.commentText}>{`"${truncatedContent}"`}</Typography>
            <Typography
                className={classes.timeText}
                style={{ color: theme.palette.text.secondary }}>
                {relativeDate}
            </Typography>
        </Box>
    )

    const CommentIconButton = () => (
        <IconTooltip title={translation.restoreReportTooltip}>
            <IconButton
                component={Link}
                to={(comment?.commentLink || '').replace(/^\/+/, '/')}
                onClick={handleRestoreBookmark}
                size="small"
                className={classes.iconButton}>
                <CommentIcon className={classes.icon} />
            </IconButton>
        </IconTooltip>
    )

    return (
        <Box display="flex" flexDirection="column" mt={3}>
            <Box display="flex" alignItems="flex-start">
                <UserAvatar />
                <UserInfo />
                {isLoading || isQlikMasterItemLoading ? (
                    <CircularProgress color={color} className={classes.progress} size={24} />
                ) : (
                    <CommentIconButton />
                )}
            </Box>
            <Box mt={2} />
            <Divider orientation="horizontal" flexItem className={classes.divider} />
        </Box>
    )
}

const useStyles = makeStyles()((theme: Theme & any) => ({
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        fontSize: 14,
        fontWeight: 600,
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        opacity: 0.7
    },
    divider: {
        backgroundColor: theme.palette.divider,
        height: 1
    },
    progress: {
        marginRight: theme.spacing(3)
    },
    role: {
        color: theme.palette.text.primary,
        fontWeight: 500,
        opacity: 0.9
    },
    name: {
        color: theme.palette.text.primary,
        fontWeight: 600,
        opacity: 0.9
    },
    text: {
        fontSize: '0.825rem'
    },
    icon: {
        fill: theme.palette.text.primary
    },
    timeText: {
        color: theme.palette.text.secondary,
        fontWeight: 500,
        fontSize: '0.8rem',
        opacity: 0.8
    },
    commentText: {
        color: theme.palette.text.primary,
        fontStyle: 'italic',
        fontWeight: 500,
        fontSize: '0.82rem',
        opacity: 0.5
    },
    iconButton: {
        marginRight: theme.spacing(3),
        marginLeft: theme.spacing(2)
    }
}))

export default NotificationCommentListItem
