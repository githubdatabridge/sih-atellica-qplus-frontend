import React, { FC, useEffect, useState } from 'react'

import { ReportMentionsProvider } from '@libs/collaboration-providers'
import {
    markReportMentionsAsRead,
    useReportMentionsDispatch,
    useReportMentionsState
} from '@libs/collaboration-providers'
import { PaginationProvider } from '@libs/common-providers'

import NotificationReportList from './reports/NotificationReportList'

interface NotificationCenterReportProps {
    markAsReadAll: number
    color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    handleReportCountCallback?: (count: number) => void
    handleReportListItemRestoreCallback?: () => void
}
const NotificationCenterReportList: FC<NotificationCenterReportProps> = ({
    markAsReadAll,
    handleReportCountCallback,
    handleReportListItemRestoreCallback,
    color
}) => {
    const [markAsReadTimestamp, setMarkAsReadTimestamp] = useState<number | null>(null)
    const dispatchReport = useReportMentionsDispatch()
    const { reportMentions, reportMentionsPagination } = useReportMentionsState()

    useEffect(() => {
        if (handleReportCountCallback) {
            handleReportCountCallback(reportMentionsPagination?.total || 0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportMentions])

    useEffect(() => {
        setMarkAsReadTimestamp(markAsReadAll)
        if (markAsReadAll && markAsReadAll !== markAsReadTimestamp) {
            markReportMentionsAsRead(
                dispatchReport,
                reportMentions,
                reportMentions,
                reportMentionsPagination,
                true
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markAsReadAll])

    return (
        <NotificationReportList
            handleReportRestoreCallback={handleReportListItemRestoreCallback}
            color={color}
        />
    )
}

const NotificationCenterReports: FC<NotificationCenterReportProps> = ({
    markAsReadAll,
    color,
    handleReportCountCallback,
    handleReportListItemRestoreCallback
}) => {
    return (
        <PaginationProvider>
            <ReportMentionsProvider>
                <NotificationCenterReportList
                    color={color}
                    markAsReadAll={markAsReadAll}
                    handleReportCountCallback={handleReportCountCallback}
                    handleReportListItemRestoreCallback={handleReportListItemRestoreCallback}
                />
            </ReportMentionsProvider>
        </PaginationProvider>
    )
}

export default React.memo(NotificationCenterReports)
