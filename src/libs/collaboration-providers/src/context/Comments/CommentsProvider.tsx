import React, { FC, ReactNode, useEffect, useReducer } from 'react'

import { useUpdateEffect } from 'react-use'

import { usePaginationContext } from '@libs/common-providers'

import { useNotificationContext } from '../Notifications/NotificationContext'
import { useQlikBaseSocialContext } from '../Qlik/QlikBaseSocialContext'
import {
    CommentsDispatchContext,
    commentsReducer,
    CommentsStateContext,
    defaultCommentsState,
    fetchAllComments,
    fetchComments,
    fetchMoreComments
} from './comments-context'

interface Props {
    isGeneral?: boolean
    children: ReactNode
}

export const CommentsProvider: FC<Props> = ({ children, isGeneral }: Props) => {
    const { customerCommentCountChangedSubject } = useNotificationContext()

    const { scope, visualizationId, reportId } = useQlikBaseSocialContext()

    const { page } = usePaginationContext()
    const [state, dispatch] = useReducer(commentsReducer, defaultCommentsState)

    useEffect(() => {
        if (isGeneral) {
            fetchAllComments(dispatch, page)
            return
        }

        const params = {
            scope,
            visualizationId,
            reportId
        }

        if (reportId || visualizationId > 0) fetchComments(dispatch, params)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportId, visualizationId, scope])

    useUpdateEffect(() => {
        if (isGeneral) {
            fetchAllComments(dispatch, page)
            return
        }

        const params = {
            scope,
            visualizationId,
            reportId
        }

        fetchMoreComments(dispatch, params, page)
    }, [page])

    useEffect(() => {
        if (!isGeneral) return

        if (customerCommentCountChangedSubject) {
            customerCommentCountChangedSubject.attach(_observer => {
                setTimeout(() => fetchAllComments(dispatch, 1), 500)
            })
        }

        return () => customerCommentCountChangedSubject?.detach(_observer => undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <CommentsStateContext.Provider value={state}>
            <CommentsDispatchContext.Provider value={dispatch}>
                {children}
            </CommentsDispatchContext.Provider>
        </CommentsStateContext.Provider>
    )
}

export default CommentsProvider
