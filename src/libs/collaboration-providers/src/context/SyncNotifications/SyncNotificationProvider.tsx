import { FC, ReactNode, useState } from 'react'

import {
    SyncNotificationContext,
    SyncNotificationContextType,
    SyncType
} from './SyncNotificationContext'

type SyncNotificationProviderProps = {
    children: ReactNode
}

export const SyncNotificationProvider: FC<SyncNotificationProviderProps> = ({ children }) => {
    const [syncType, setSyncType] = useState<SyncType | null>(null)

    const notify = (type: SyncType | null) => {
        setSyncType(type)

        setTimeout(() => {
            setSyncType(null)
        }, 1000)
    }

    const providerValues: SyncNotificationContextType = {
        type: syncType,
        notify
    }

    return (
        <SyncNotificationContext.Provider value={providerValues}>
            {children}
        </SyncNotificationContext.Provider>
    )
}

export default SyncNotificationProvider
