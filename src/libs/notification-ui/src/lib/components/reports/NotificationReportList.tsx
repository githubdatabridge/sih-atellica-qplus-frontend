import React, { FC } from 'react'

import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import { Box, Button, CircularProgress, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useReportMentionsState } from '@libs/collaboration-providers'
import { usePaginationContext } from '@libs/common-providers'
import { useI18n } from '@libs/common-providers'
import { LoadingContent } from '@libs/common-ui'

import translation from '../../constants/translation'
import NotificationReportListItem from './NotificationReportListItem'

interface INotificationReportListProp {
    handleReportRestoreCallback?: () => void
    color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

const NotificationReportList: FC<INotificationReportListProp> = ({
    handleReportRestoreCallback,
    color
}) => {
    const { classes } = useStyles()
    const { loadMore } = usePaginationContext()
    const { t } = useI18n()

    const { reportMentions, reportMentionsPagination, loading, loadingMore } =
        useReportMentionsState()

    if (loading) return <LoadingContent />

    if (reportMentions.length === 0)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                {loading ? (
                    <CircularProgress color="secondary" />
                ) : (
                    <>
                        <Box p={1}>
                            <NotificationsOffIcon
                                style={{ width: 40, height: 40 }}
                                color="primary"
                            />
                        </Box>
                        <Typography className={classes.empty}>
                            {t(translation.reportingMenuEmptyNotificationText)}
                        </Typography>
                    </>
                )}
            </Box>
        )

    return (
        <>
            {reportMentions.map(m => (
                <NotificationReportListItem
                    key={m.id}
                    mention={m}
                    handleReportItemRestoreCallback={handleReportRestoreCallback}
                    color={color}
                />
            ))}
            {reportMentionsPagination.hasMore && (
                <Box pt={3} pb={1} textAlign="center">
                    <Button onClick={loadMore} disabled={loadingMore} className={classes.button}>
                        {loadingMore ? (
                            <CircularProgress className={classes.progress} size={24} />
                        ) : (
                            t(translation.reportingListLoadMore)
                        )}
                    </Button>
                </Box>
            )}
        </>
    )
}

const useStyles = makeStyles()((theme: Theme & any) => ({
    empty: {
        fontSize: '0.825rem',
        color: theme.palette.text.primary
    },
    progress: {
        color: theme.palette.secondary.contrastText
    },
    button: {
        minWidth: '150px',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main
        }
    }
}))

export default NotificationReportList
