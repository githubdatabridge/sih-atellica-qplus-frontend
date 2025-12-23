import React, { FC, useEffect, useState } from 'react'

import {
    CommentMentionsProvider,
    markCommentMentionsAsRead,
    useCommentMentionsDispatch,
    useCommentMentionsState
} from '@libs/collaboration-providers'
import { PaginationProvider } from '@libs/common-providers'

import NotificationCommentList from '../components/comments/NotificationCommentList'

interface INotificationCenterCommentsProps {
    markAsReadAll: number
    handleCommentCountCallback?: (count: number) => void
    handleCommentListItemRestoreCallback?: () => void
    color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}
const NotificationCenterCommentList: FC<INotificationCenterCommentsProps> = ({
    markAsReadAll,
    handleCommentCountCallback,
    handleCommentListItemRestoreCallback,
    color
}) => {
    const [markAsReadTimestamp, setMarkAsReadTimestamp] = useState<number | null>(null)
    const dispatchComment = useCommentMentionsDispatch()
    const { commentMentions, commentMentionsPagination } = useCommentMentionsState()

    useEffect(() => {
        if (handleCommentCountCallback) {
            handleCommentCountCallback(commentMentionsPagination?.total || 0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentMentions])

    useEffect(() => {
        setMarkAsReadTimestamp(markAsReadAll)
        if (markAsReadAll && markAsReadAll !== markAsReadTimestamp) {
            markCommentMentionsAsRead(
                dispatchComment,
                commentMentions,
                commentMentions,
                commentMentionsPagination,
                true
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markAsReadAll])

    return (
        <NotificationCommentList
            handleCommentRestoreCallback={handleCommentListItemRestoreCallback}
            color={color}
        />
    )
}

const NotificationCenterComments: FC<INotificationCenterCommentsProps> = ({
    markAsReadAll,
    handleCommentCountCallback,
    handleCommentListItemRestoreCallback,
    color
}) => {
    return (
        <PaginationProvider>
            <CommentMentionsProvider>
                <NotificationCenterCommentList
                    markAsReadAll={markAsReadAll}
                    handleCommentCountCallback={handleCommentCountCallback}
                    handleCommentListItemRestoreCallback={handleCommentListItemRestoreCallback}
                    color={color}
                />
            </CommentMentionsProvider>
        </PaginationProvider>
    )
}

export default React.memo(NotificationCenterComments)
