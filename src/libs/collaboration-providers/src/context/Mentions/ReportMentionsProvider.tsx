import React, { useEffect, useReducer } from 'react'

import { useMount, useUpdateEffect } from 'react-use'

import { usePaginationContext } from '@libs/common-providers'

import { useNotificationContext } from '../Notifications/NotificationContext'
import {
    reportMentionsReducer,
    defaultReportMentionState,
    ReportMentionsDispatchContext,
    ReportMentionsStateContext,
    fetchReportMentions
} from './report-mentions-context'

const ReportMentionsProvider: React.FC<any> = ({ children }) => {
    const [state, dispatch] = useReducer(reportMentionsReducer, defaultReportMentionState)
    const { userReportSharedSubject, systemReportCreatedSubject } = useNotificationContext()
    const { page } = usePaginationContext()

    useMount(() => {
        fetchReportMentions(dispatch)
    })

    useUpdateEffect(() => {
        if (page > 1) {
            fetchReportMentions(dispatch, page)
        }
    }, [page])

    useEffect(() => {
        if (userReportSharedSubject) {
            userReportSharedSubject.attach(_observer => {
                setTimeout(() => {
                    fetchReportMentions(dispatch)
                }, 2500)
            })
        }

        return () => {
            userReportSharedSubject?.detach(_observer => undefined)
        }
    }, [])

    useEffect(() => {
        if (systemReportCreatedSubject) {
            systemReportCreatedSubject.attach(_observer => {
                setTimeout(() => {
                    fetchReportMentions(dispatch)
                }, 2500)
            })
        }

        return () => {
            systemReportCreatedSubject?.detach(_observer => undefined)
        }
    }, [])

    return (
        <ReportMentionsStateContext.Provider value={state}>
            <ReportMentionsDispatchContext.Provider value={dispatch}>
                {children}
            </ReportMentionsDispatchContext.Provider>
        </ReportMentionsStateContext.Provider>
    )
}

export default ReportMentionsProvider
