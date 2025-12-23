import { createContext, useContext } from 'react'

import { commentService } from '@libs/collaboration-services'
import { Comment } from '@libs/common-models'

interface PaginationData {
    hasMore: boolean
    page: number
    total: number
}

export const defaultCommentsState: CommentsState = {
    page: 1,
    hasMore: false,
    loading: false,
    loadingMore: false,
    comments: [],
    activeComment: null,
    total: 0
}

type CommentsDispatch = (action: CommentsAction) => void
type CommentsState = {
    page: number
    hasMore: boolean
    loading: boolean
    loadingMore: boolean
    comments: Comment[]
    activeComment: Comment | null
    total: number
}

/*----------  Actions  ----------*/

enum CommentsActionType {
    showLoading = '@comments/loading',
    showLoadingMore = '@comments/loadingMore',
    setComments = '@comments/setComments',
    fetchComments = '@comments/fetch',
    fetchMoreComments = '@comments/fetchMore',
    addComment = '@comments/addComment',
    removeComment = '@comments/removeComment',
    setActiveComment = '@comments/setActiveComment'
}

export const showLoading = (loading = true) =>
    ({ type: CommentsActionType.showLoading, loading } as const)

export const showLoadingMore = (loadingMore = true) =>
    ({ type: CommentsActionType.showLoadingMore, loadingMore } as const)

export const setComments = (comments: Comment[], pagination?: PaginationData) =>
    ({ type: CommentsActionType.setComments, comments, pagination } as const)

export const addComment = (comment: Comment) =>
    ({ type: CommentsActionType.addComment, comment } as const)

export const removeComment = (commentId: number) =>
    ({ type: CommentsActionType.removeComment, commentId } as const)

export const setActiveComment = (comment: Comment | null) =>
    ({ type: CommentsActionType.setActiveComment, comment } as const)

export const fetchActiveComment = async (
    dispatch: CommentsDispatch,
    newActiveCommentId: number | null,
    activeComment: Comment | null
) => {
    try {
        if (!newActiveCommentId) {
            dispatch(setActiveComment(null))
            return
        }

        if (activeComment?.id === newActiveCommentId) return

        const newActiveComment = await commentService.getParentComment(newActiveCommentId)

        dispatch(setActiveComment(newActiveComment))
    } catch (error) {
        console.log(error)
    }
}

export const fetchComments = async (dispatch: CommentsDispatch, params: any, page = 1) => {
    try {
        dispatch(showLoading(true))

        const { comments, pagination } = await (() => {
            if (params.visualizationId && params.scope) {
                return commentService.getComments(params, page)
            }

            return commentService.getReportComments(params, page)
        })()

        dispatch(setComments(comments, pagination))
    } catch (error) {}
}

export const fetchMoreComments = async (dispatch: CommentsDispatch, params: any, page = 1) => {
    try {
        dispatch(showLoadingMore())

        const { comments, pagination } = await (() => {
            if (params.visualizationId && params.scope) {
                return commentService.getComments(params, page)
            }

            return commentService.getReportComments(params, page)
        })()

        dispatch(setComments(comments, pagination))
    } catch (error) {}
}

export const fetchAllComments = async (dispatch: CommentsDispatch, page = 1) => {
    try {
        if (page === 1) {
            dispatch(showLoading(true))
        } else {
            dispatch(showLoadingMore(true))
        }

        const { comments, pagination } = await commentService.getAllComments({ page })

        dispatch(setComments(comments, pagination))
    } catch (error) {
        dispatch(showLoading(false))
    }
}

export type CommentsAction =
    | ReturnType<typeof showLoading>
    | ReturnType<typeof showLoadingMore>
    | ReturnType<typeof setComments>
    | ReturnType<typeof removeComment>
    | ReturnType<typeof addComment>
    | ReturnType<typeof setActiveComment>

/*----------  Reducer  ----------*/

export const commentsReducer = (state: CommentsState, action: CommentsAction): CommentsState => {
    switch (action.type) {
        case CommentsActionType.showLoading:
            return { ...state, loading: action.loading }
        case CommentsActionType.showLoadingMore:
            return { ...state, loadingMore: action.loadingMore }
        case CommentsActionType.setComments:
            if (state.page !== action?.pagination?.page) {
                return {
                    ...state,
                    ...action.pagination,
                    comments: [...state.comments, ...action.comments],
                    loading: false,
                    loadingMore: false
                }
            }

            return { ...state, comments: action.comments, ...action.pagination, loading: false }
        case CommentsActionType.addComment:
            return {
                ...state,
                comments: [action.comment, ...state.comments]
            }
        case CommentsActionType.removeComment:
            return {
                ...state,
                comments: state.comments.filter((c: any) => +c.id !== +action.commentId)
            }
        case CommentsActionType.setActiveComment:
            return {
                ...state,
                activeComment: action.comment
            }
        default:
            return state
    }
}

/*----------  Context  ----------*/

export const CommentsStateContext = createContext<CommentsState | undefined>(undefined)
export const CommentsDispatchContext = createContext<CommentsDispatch | undefined>(undefined)

export const CommentsReplyStateContext = createContext<CommentsState | undefined>(undefined)
export const CommentsReplyDispatchContext = createContext<CommentsDispatch | undefined>(undefined)

/*----------  Hooks  ----------*/

export const useCommentsState = () => {
    const context = useContext(CommentsStateContext)
    if (context === undefined) {
        throw new Error('useCommentsState must be used within a CommentsProvider')
    }
    return context
}

export const useCommentsDispatch = () => {
    const context = useContext(CommentsDispatchContext)
    if (context === undefined) {
        throw new Error('useCommentsDispatch must be used within a CommentsProvider')
    }
    return context
}

export const useCommentsReplyState = () => {
    const context = useContext(CommentsReplyStateContext)
    if (context === undefined) {
        throw new Error('useCommentsState must be used within a CommentsReplyProvider')
    }
    return context
}

export const useCommentsReplyDispatch = () => {
    const context = useContext(CommentsReplyDispatchContext)
    if (context === undefined) {
        throw new Error('useCommentsDispatch must be used within a CommentsReplyProvider')
    }
    return context
}
