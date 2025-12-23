import { FC, useState } from 'react'

import DoneAllIcon from '@mui/icons-material/DoneAll'
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Menu,
    Toolbar,
    Typography
} from '@mui/material'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import translation from '../../constants/translation'
import { NotificationType, TNotificationCenterUIClasses } from '../../NotificationCenterUi'
import NotificationCenterComments from '../NotificationCenterComments'
import NotificationCenterReports from '../NotificationCenterReports'
import { createStyles } from './menuStyles'

interface Props {
    notificationMenu: HTMLElement | null
    commentMentionCount: number
    reportMentionCount: number
    views: string[]
    isLoading: boolean
    bookmarkMenuClose: () => void
    handleCommentCount: (count: number) => void
    handleReportCount: (count: number) => void
    handleRestore: () => void
    color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    classNames?: TNotificationCenterUIClasses
}

const NotificationCenterMenu: FC<Props> = ({
    notificationMenu,
    commentMentionCount,
    reportMentionCount,
    views,
    isLoading,
    bookmarkMenuClose,
    handleCommentCount,
    handleReportCount,
    handleRestore,
    color,
    classNames
}): JSX.Element => {
    const { t } = useI18n()

    const [isCommentLoading, setIsCommentLoading] = useState<boolean>(false)
    const [isReportLoading, setIsReportLoading] = useState<boolean>(false)
    const [markAsReadTimestamp, setMarkAsReadTimestamp] = useState<number>(0)
    const [view, setView] = useState<number>(
        views[0] === 'comments'
            ? NotificationType.NOTIFICATION_TYPE_COMMENT
            : NotificationType.NOTIFICATION_TYPE_REPORT
    )

    const useStyles = createStyles(color)
    const { classes } = useStyles()

    const handleNotificationView = (notificationView: number) => {
        setView(notificationView)
    }

    const handleMarkAsRead = () => {
        setIsCommentLoading(true)
        setIsReportLoading(true)
        setMarkAsReadTimestamp(new Date().getMilliseconds())
    }

    const _handleCommentCount = (count: number) => {
        handleCommentCount(count)
        setIsCommentLoading(false)
    }

    const _handleReportCount = (count: number) => {
        handleReportCount(count)
        setIsReportLoading(false)
    }

    return (
        <Menu
            id="notification-menu"
            anchorEl={notificationMenu}
            keepMounted
            open={Boolean(notificationMenu)}
            onClose={bookmarkMenuClose}
            elevation={0}
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
            classes={{
                paper: classes.menuPaper,
                list: classes.menuList
            }}>
            <Box display="flex" flexDirection="column">
                <AppBar
                    position="sticky"
                    classes={{
                        root: `${classes.appBar} ${classNames?.appBar}`
                    }}
                    elevation={0}>
                    <Toolbar className={`${classes.toolbar} ${classNames?.toolbar || ''}`}>
                        <Box display="flex" alignItems="center" width="100%">
                            <Box width="100%" display="flex" alignItems="center">
                                <Box
                                    pl={3}
                                    pt={0}
                                    className={`${classes.menuTitleContainer} ${
                                        classNames?.menuTitleContainer || ''
                                    }`}>
                                    <Typography
                                        className={`${classes.menuTitle} ${
                                            classNames?.menuTitle || ''
                                        }`}>
                                        {t(translation.notificationTitle)}
                                    </Typography>
                                </Box>
                                <Box pr={2} width="100%" textAlign="right">
                                    <Box display="flex" width="100%">
                                        <Box flexGrow={1} />
                                        <Box>
                                            {isCommentLoading || isReportLoading ? (
                                                <CircularProgress
                                                    className={`${classes.progressMarkReadAll} ${
                                                        classNames?.progressMarkReadAll || ''
                                                    }`}
                                                    size={16}
                                                />
                                            ) : (
                                                <IconTooltip
                                                    title={t(
                                                        translation.notificationTooltipMarkAllAsRead
                                                    )}>
                                                    <IconButton
                                                        onClick={handleMarkAsRead}
                                                        size="small">
                                                        <DoneAllIcon
                                                            className={`${classes.readAllIcon} ${
                                                                classNames?.readAllIcon || ''
                                                            }`}
                                                        />
                                                    </IconButton>
                                                </IconTooltip>
                                            )}
                                        </Box>
                                        <Box pr={1} pl={1} alignSelf="center">
                                            <Typography className={classes.markRead}>
                                                {t(translation.notificationMarkAllAsRead)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box>
                    <Box mt={3} display="flex" justifyContent="center">
                        <Box display="flex" justifyContent="center">
                            {views?.includes('comments') && views?.length > 1 && (
                                <Box className={classes.commentChip}>
                                    <Button
                                        className={
                                            view === NotificationType.NOTIFICATION_TYPE_COMMENT
                                                ? classes.buttonActive
                                                : classes.buttonInactive
                                        }
                                        onClick={() =>
                                            handleNotificationView(
                                                NotificationType.NOTIFICATION_TYPE_COMMENT
                                            )
                                        }>
                                        {`${t(
                                            translation.notificationTypeComments
                                        )} (${commentMentionCount})`}
                                    </Button>
                                </Box>
                            )}
                            {views?.includes('reports') && views?.length > 1 && (
                                <Box>
                                    <Button
                                        className={
                                            view === NotificationType.NOTIFICATION_TYPE_REPORT
                                                ? classes.buttonActive
                                                : classes.buttonInactive
                                        }
                                        onClick={() =>
                                            handleNotificationView(
                                                NotificationType.NOTIFICATION_TYPE_REPORT
                                            )
                                        }>
                                        {t(translation.notificationTypeReports)}
                                        {` (${reportMentionCount})`}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {views?.length > 1 && <Box mb={1} />}
                    {views?.includes('comments') && (
                        <div
                            style={
                                view === NotificationType.NOTIFICATION_TYPE_COMMENT
                                    ? { display: 'block' }
                                    : { display: 'none' }
                            }>
                            <NotificationCenterComments
                                markAsReadAll={markAsReadTimestamp}
                                handleCommentCountCallback={_handleCommentCount}
                                handleCommentListItemRestoreCallback={handleRestore}
                                color={color}
                            />
                        </div>
                    )}
                    {views?.includes('reports') && (
                        <div
                            style={
                                view === NotificationType.NOTIFICATION_TYPE_REPORT
                                    ? { display: 'block' }
                                    : { display: 'none' }
                            }>
                            <NotificationCenterReports
                                markAsReadAll={markAsReadTimestamp}
                                handleReportCountCallback={_handleReportCount}
                                handleReportListItemRestoreCallback={handleRestore}
                                color={color}
                            />
                        </div>
                    )}
                </Box>
                <Box mb={1} />
            </Box>
        </Menu>
    )
}

export default NotificationCenterMenu
