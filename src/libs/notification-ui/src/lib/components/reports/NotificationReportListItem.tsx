import React, { FC, useState } from 'react'

import { Link } from 'react-router-dom'

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
    markReportMentionsAsRead,
    useReportMentionsDispatch,
    useReportMentionsState
} from '@libs/collaboration-providers'
import { Action } from '@libs/common-models'
import { useI18n } from '@libs/common-providers'
import { IconTooltip, renderVizType } from '@libs/common-ui'
import { useQlikLoaderContext } from '@libs/qlik-providers'

import translation from '../../constants/translation'

interface INotificationReportListItemProps {
    mention: Action
    handleReportItemRestoreCallback?: () => void
    color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

const NotificationReportListItem: FC<INotificationReportListItemProps> = ({
    mention,
    handleReportItemRestoreCallback,
    color
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { report, relativeDate } = mention
    const { classes } = useStyles()
    const { isQlikMasterItemLoading } = useQlikLoaderContext()
    const dispatch = useReportMentionsDispatch()
    const { reportMentions, reportMentionsPagination } = useReportMentionsState()
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

    const handleRestoreReportClick = async () => {
        setIsLoading(true)
        await markReportMentionsAsRead(
            dispatch,
            [mention],
            reportMentions,
            reportMentionsPagination
        )
        setIsLoading(false)
        if (handleReportItemRestoreCallback) handleReportItemRestoreCallback()
    }

    const UserAvatar = () => <Avatar className={classes.avatar}>{report?.user?.initials}</Avatar>

    const UserInfo = () => (
        <Box display="flex" flexDirection="column" flexGrow={1}>
            <Typography className={classes.text}>
                <span className={classes.role}>{translateRoleHelper(report?.user?.role)}</span>
                <span className={classes.name}> {report?.user?.fullName}</span> {t(mention.type)}:
            </Typography>
            <Typography className={classes.reportText}>{`"${report?.title}"`}</Typography>
            <Typography
                className={classes.timeText}
                style={{ color: theme.palette.text.secondary }}>
                {relativeDate}
            </Typography>
        </Box>
    )

    const ReportIconButton = () => (
        <IconTooltip title={t(translation.restoreReportTooltip)}>
            <IconButton
                component={Link}
                to={(report?.reportLink || '').replace(/^\/+/, '/')}
                onClick={handleRestoreReportClick}
                size="small"
                className={classes.iconButton}>
                {renderVizType(report?.visualizationType || '', theme.palette.text.primary)}
            </IconButton>
        </IconTooltip>
    )

    return (
        <Box display="flex" flexDirection="column" mt={3}>
            <Box display="flex" alignItems="flex-start">
                <UserAvatar />
                <UserInfo />
                {isQlikMasterItemLoading || isLoading ? (
                    <CircularProgress color={color} className={classes.progress} size={24} />
                ) : (
                    <ReportIconButton />
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
    progress: {
        marginRight: theme.spacing(3)
    },
    divider: {
        backgroundColor: theme.palette.divider,
        height: 1
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
    timeText: {
        color: theme.palette.text.secondary,
        fontWeight: 500,
        fontSize: '0.8rem',
        opacity: 0.8
    },
    reportText: {
        color: theme.palette.text.primary,
        fontStyle: 'italic',
        fontWeight: 500,
        fontSize: '0.82rem',
        opacity: 0.5
    },
    iconButton: {
        marginRight: theme.spacing(3)
    }
}))

export default NotificationReportListItem
