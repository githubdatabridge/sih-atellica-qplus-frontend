import React, { ReactNode, useReducer } from 'react'

import {
    commentsReducer,
    CommentsReplyDispatchContext,
    CommentsReplyStateContext,
    defaultCommentsState
} from './comments-context'

interface Props {
    isReply?: boolean
    children: ReactNode
}

const CommentsReplyProvider: React.FC<Props> = ({ isReply, children }) => {
    const [state, dispatch] = useReducer(commentsReducer, defaultCommentsState)

    return (
        <CommentsReplyStateContext.Provider value={state}>
            <CommentsReplyDispatchContext.Provider value={dispatch}>
                {children}
            </CommentsReplyDispatchContext.Provider>
        </CommentsReplyStateContext.Provider>
    )
}

export default CommentsReplyProvider
