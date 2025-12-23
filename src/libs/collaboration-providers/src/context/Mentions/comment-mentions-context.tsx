import React, { useContext } from 'react'

import { commentService } from '@libs/collaboration-services'
import { Action } from '@libs/common-models'

const defaultPagination = { hasMore: false, page: 1, total: 0 }

interface PaginationData {
    hasMore: boolean
    page: number
    total: number
}

export const defaultCommentMentionState: CommentMentionsState = {
    loading: false,
    loadingMore: false,
    commentMentions: [],
    commentMentionsPagination: defaultPagination
}

type CommentMentionsDispatch = (action: CommentMentionsAction) => void
type CommentMentionsState = {
    loading: boolean
    loadingMore: boolean
    commentMentions: Action[]
    commentMentionsPagination: PaginationData
}

/**********************************************/
/*            Actions
/**********************************************/

enum CommentMentionsActionType {
    /*----------  loading  ----------*/
    showCommentLoading = '@mentions/loading',
    showCommentLoadingMore = '@mentions/loadingMore',
    /*----------  mentions  ----------*/
    fetchCommentMentions = '@mentions/fetchCommentMentions',
    setCommentMentions = '@mentions/setCommentMentions'
}

export const showCommentLoading = (loading = true) =>
    ({ type: CommentMentionsActionType.showCommentLoading, loading } as const)

export const showCommentLoadingMore = (loadingMore = true) =>
    ({ type: CommentMentionsActionType.showCommentLoadingMore, loadingMore } as const)

/*----------  Mentions  ----------*/

export const setCommentMentions = (
    mentions: Action[],
    pagination: PaginationData = defaultPagination
) => {
    return { type: CommentMentionsActionType.setCommentMentions, mentions, pagination } as const
}

export const fetchCommentMentions = async (dispatch: CommentMentionsDispatch, page = 1) => {
    try {
        if (page === 1) {
            dispatch(showCommentLoading(true))
        } else {
            dispatch(showCommentLoadingMore(true))
        }

        const { actions: mentions, pagination } = await commentService.getMentionedComments(page)

        dispatch(setCommentMentions(mentions, pagination))
    } catch (error) {
        console.log('Qplus error', error)
    } finally {
        dispatch(showCommentLoading(false))
    }
}

export const markCommentMentionsAsRead = async (
    dispatch: CommentMentionsDispatch,
    mentions: Action[],
    allMentions: Action[],
    commentMentionsPagination: PaginationData,
    markAll = false
) => {
    try {
        const unreadMentionsIds = await commentService.markCommentMentionsAsRead(mentions)

        const updatedMentions = allMentions.filter(m => !unreadMentionsIds.includes(m.id))

        dispatch(
            setCommentMentions(updatedMentions, {
                ...commentMentionsPagination,
                total: !markAll ? commentMentionsPagination.total - 1 : 0
            })
        )
    } catch (error) {
        dispatch(showCommentLoading(false))
    }
}

/*----------  CommentMentionsAction type  ----------*/

export type CommentMentionsAction =
    | ReturnType<typeof showCommentLoading>
    | ReturnType<typeof showCommentLoadingMore>
    | ReturnType<typeof setCommentMentions>

/*----------  Reducer  ----------*/

export const commentMentionsReducer = (
    state: CommentMentionsState,
    action: CommentMentionsAction
): CommentMentionsState => {
    switch (action.type) {
        case CommentMentionsActionType.showCommentLoading:
            return { ...state, loading: action.loading }
        case CommentMentionsActionType.showCommentLoadingMore:
            return { ...state, loadingMore: action.loadingMore }

        case CommentMentionsActionType.setCommentMentions:
            if (state.commentMentionsPagination.page !== action.pagination.page) {
                return {
                    ...state,
                    commentMentions: [...state.commentMentions, ...action.mentions],
                    commentMentionsPagination: action.pagination,
                    loadingMore: false
                }
            }

            return {
                ...state,
                commentMentions: action.mentions,
                commentMentionsPagination: action.pagination,
                loading: false
            }
        default:
            return state
    }
}

/*----------  Context  ----------*/

export const CommentMentionsStateContext = React.createContext<CommentMentionsState | undefined>(
    undefined
)
export const CommentMentionsDispatchContext = React.createContext<
    CommentMentionsDispatch | undefined
>(undefined)

/*----------  Hooks  ----------*/

export const useCommentMentionsState = () => {
    const context = React.useContext(CommentMentionsStateContext)
    if (context === undefined) {
        throw new Error('useCommentMentionsState must be used within a CommentMentionsProvider')
    }
    return context
}

export const useCommentMentionsDispatch = () => {
    const context = useContext(CommentMentionsDispatchContext)
    if (context === undefined) {
        throw new Error('useCommentMentionsDispatch must be used within a CommentMentionsProvider')
    }
    return context
}
