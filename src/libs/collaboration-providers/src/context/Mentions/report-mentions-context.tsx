import React, { useContext } from 'react'

import { Action } from '@libs/common-models'
import { reportService } from '@libs/core-services'

const defaultPagination = { hasMore: false, page: 1, total: 0 }

export const defaultReportMentionState: ReportMentionsState = {
    loading: false,
    loadingMore: false,
    reportMentions: [],
    reportMentionsPagination: defaultPagination
}

interface PaginationData {
    hasMore: boolean
    page: number
    total: number
}

type ReportMentionsDispatch = (action: ReportMentionsAction) => void
type ReportMentionsState = {
    loading: boolean
    loadingMore: boolean
    reportMentions: Action[]
    reportMentionsPagination: PaginationData
}

/**********************************************/
/*            Actions
/**********************************************/

enum ReportMentionsActionType {
    /*----------  loading  ----------*/
    showReportLoading = '@mentions/loading',
    showReportLoadingMore = '@mentions/loadingMore',
    /*----------  mentions  ----------*/
    fetchReportMentions = '@mentions/fetchReportMentions',
    setReportMentions = '@mentions/setReportMentions'
}

export const showReportLoading = (loading = true) =>
    ({ type: ReportMentionsActionType.showReportLoading, loading } as const)

export const showReportLoadingMore = (loadingMore = true) =>
    ({ type: ReportMentionsActionType.showReportLoadingMore, loadingMore } as const)

/*----------  Mentions  ----------*/

export const setReportMentions = (
    mentions: Action[],
    pagination: PaginationData = defaultPagination
) => {
    return { type: ReportMentionsActionType.setReportMentions, mentions, pagination } as const
}

export const fetchReportMentions = async (dispatch: ReportMentionsDispatch, page = 1) => {
    try {
        if (page === 1) {
            dispatch(showReportLoading(true))
        } else {
            dispatch(showReportLoadingMore(true))
        }

        const { actions: mentions, pagination } = await reportService.getMentionedReports(page)

        dispatch(setReportMentions(mentions, pagination))
    } catch (error) {
        console.log('Qplus error', error)
    } finally {
        dispatch(showReportLoading(false))
    }
}

export const markReportMentionsAsRead = async (
    dispatch: ReportMentionsDispatch,
    mentions: Action[],
    allMentions: Action[],
    reportMentionsPagination: PaginationData,
    markAll = false
) => {
    try {
        const unreadMentionsIds = await reportService.markReportMentionsAsRead(mentions)

        const updatedMentions = allMentions.filter(m => !unreadMentionsIds.includes(m.id))

        dispatch(
            setReportMentions(updatedMentions, {
                ...reportMentionsPagination,
                total: !markAll ? reportMentionsPagination.total - 1 : 0
            })
        )
    } catch (error) {
        console.log('Qplus error', error)
    } finally {
        dispatch(showReportLoading(false))
    }
}

/*----------  ReportMentionsAction type  ----------*/

export type ReportMentionsAction =
    | ReturnType<typeof showReportLoading>
    | ReturnType<typeof showReportLoadingMore>
    | ReturnType<typeof setReportMentions>

/*----------  Reducer  ----------*/

export const reportMentionsReducer = (
    state: ReportMentionsState,
    action: ReportMentionsAction
): ReportMentionsState => {
    switch (action.type) {
        case ReportMentionsActionType.showReportLoading:
            return { ...state, loading: action.loading }
        case ReportMentionsActionType.showReportLoadingMore:
            return { ...state, loadingMore: action.loadingMore }

        case ReportMentionsActionType.setReportMentions:
            if (state.reportMentionsPagination.page !== action.pagination.page) {
                return {
                    ...state,
                    reportMentions: [...state.reportMentions, ...action.mentions],
                    reportMentionsPagination: action.pagination,
                    loadingMore: false
                }
            }

            return {
                ...state,
                reportMentions: action.mentions,
                reportMentionsPagination: action.pagination,
                loading: false
            }
        default:
            return state
    }
}

/*----------  Context  ----------*/

export const ReportMentionsStateContext = React.createContext<ReportMentionsState | undefined>(
    undefined
)
export const ReportMentionsDispatchContext = React.createContext<
    ReportMentionsDispatch | undefined
>(undefined)

/*----------  Hooks  ----------*/

export const useReportMentionsState = () => {
    const context = React.useContext(ReportMentionsStateContext)
    if (context === undefined) {
        throw new Error('useReportMentionsState must be used within a ReportMentionsProvider')
    }
    return context
}

export const useReportMentionsDispatch = () => {
    const context = useContext(ReportMentionsDispatchContext)
    if (context === undefined) {
        throw new Error('useReportMentionsDispatch must be used within a ReportMentionsProvider')
    }
    return context
}
