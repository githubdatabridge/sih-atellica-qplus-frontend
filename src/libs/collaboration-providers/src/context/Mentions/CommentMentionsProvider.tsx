import React, { useEffect, useReducer } from 'react'

import { useMount, useUpdateEffect } from 'react-use'

import { usePaginationContext } from '@libs/common-providers'

import { useNotificationContext } from '../Notifications/NotificationContext'
import {
    commentMentionsReducer,
    defaultCommentMentionState,
    CommentMentionsDispatchContext,
    CommentMentionsStateContext,
    fetchCommentMentions
} from './comment-mentions-context'

const CommentMentionsProvider: React.FC<any> = ({ children }) => {
    const [state, dispatch] = useReducer(commentMentionsReducer, defaultCommentMentionState)
    const {
        userTaggedInCommentSubject,
        userCommentRepliedSubject,
        userCommentCreatedSubject,
        userCreatedReactionCommentSubject
    } = useNotificationContext()
    const { page } = usePaginationContext()

    useMount(() => {
        fetchCommentMentions(dispatch)
    })

    useEffect(() => {
        if (userCommentCreatedSubject) {
            userCommentCreatedSubject.attach(_observer => {
                setTimeout(() => {
                    fetchCommentMentions(dispatch)
                }, 2500)
            })
        }

        return () => {
            userCommentCreatedSubject?.detach(_observer => undefined)
        }
    }, [])

    useEffect(() => {
        if (userTaggedInCommentSubject) {
            userTaggedInCommentSubject.attach(_observer => {
                setTimeout(() => {
                    fetchCommentMentions(dispatch)
                }, 2500)
            })
        }

        return () => {
            userTaggedInCommentSubject?.detach(_observer => undefined)
        }
    }, [])

    useEffect(() => {
        if (userCreatedReactionCommentSubject) {
            userCreatedReactionCommentSubject.attach(_observer => {
                setTimeout(() => {
                    fetchCommentMentions(dispatch)
                }, 2500)
            })
        }

        return () => {
            userTaggedInCommentSubject?.detach(_observer => undefined)
        }
    }, [])

    useUpdateEffect(() => {
        if (page > 1) {
            fetchCommentMentions(dispatch, page)
        }
    }, [page])

    useEffect(() => {
        if (userCommentRepliedSubject) {
            userCommentRepliedSubject.attach(_observer => {
                setTimeout(() => {
                    fetchCommentMentions(dispatch)
                }, 2500)
            })
        }

        return () => {
            userCommentRepliedSubject?.detach(_observer => undefined)
        }
    }, [])

    return (
        <CommentMentionsStateContext.Provider value={state}>
            <CommentMentionsDispatchContext.Provider value={dispatch}>
                {children}
            </CommentMentionsDispatchContext.Provider>
        </CommentMentionsStateContext.Provider>
    )
}

export default CommentMentionsProvider
