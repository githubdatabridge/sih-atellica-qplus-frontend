import React, { useContext } from 'react'

export enum SyncType {
    NOTES = 'notes',
    NOTES_OVERDUE = 'notesOverdue',
    COMMENTS_MENTIONS = 'commentsMentions',
    COMMENTS_ALL = 'commentsAll'
}

export type SyncNotificationContextType = {
    type: SyncType | null
    notify: (type: SyncType | null) => void
}

export const SyncNotificationContext = React.createContext<SyncNotificationContextType>({
    type: null,
    notify: () => {
        throw new Error('notify() not implemented')
    }
})

export const useSyncNotificationContext = (): SyncNotificationContextType => {
    return useContext(SyncNotificationContext)
}
