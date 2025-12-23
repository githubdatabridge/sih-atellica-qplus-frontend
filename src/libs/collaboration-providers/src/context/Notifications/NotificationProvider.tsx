import { useCallback, useRef } from 'react'

import { useMount } from 'react-use'

import { Subject, socketService } from '@libs/collaboration-services'
import { storage, KEYS } from '@libs/common-utils'

import {
    NotificationContext,
    Notification,
    userCommentRepliedData,
    userCreatedReactionVisualizationData,
    userCreatedReactionCommentData,
    userTaggedInCommentData,
    userDataLoadedData,
    NotificationType,
    customerCommentCountChangedData,
    customerReactionCountChangedData,
    customerDataLoadedData,
    systemReportCreatedData,
    userReportSharedData,
    userCommentCreatedData,
    reportCommentCountChangedData,
    userBookmarkSharedData
} from './NotificationContext'

export const NotificationProvider = ({ children }) => {
    const userCommentCreatedSubject = useRef(
        new Subject<Notification<userCommentCreatedData>>()
    ).current
    const userTaggedInCommentSubject = useRef(
        new Subject<Notification<userTaggedInCommentData>>()
    ).current
    const userCommentRepliedSubject = useRef(
        new Subject<Notification<userCommentRepliedData>>()
    ).current
    const userCreatedReactionVisualizationSubject = useRef(
        new Subject<Notification<userCreatedReactionVisualizationData>>()
    ).current
    const userCreatedReactionCommentSubject = useRef(
        new Subject<Notification<userCreatedReactionCommentData>>()
    ).current
    const userDataLoadedSubject = useRef(new Subject<Notification<userDataLoadedData>>()).current

    const customerCommentCountChangedSubject = useRef(
        new Subject<Notification<customerCommentCountChangedData>>()
    ).current
    const customerReactionCountChangedSubject = useRef(
        new Subject<Notification<customerReactionCountChangedData>>()
    ).current
    const customerDataLoadedSubject = useRef(
        new Subject<Notification<customerDataLoadedData>>()
    ).current

    const userReportSharedSubject = useRef(
        new Subject<Notification<userReportSharedData>>()
    ).current

    const userBookmarkSharedSubject = useRef(
        new Subject<Notification<userBookmarkSharedData>>()
    ).current

    const systemReportCreatedSubject = useRef(
        new Subject<Notification<systemReportCreatedData>>()
    ).current
    const reportCommentCountChangedSubject = useRef(
        new Subject<Notification<reportCommentCountChangedData>>()
    ).current

    useMount(async () => {
        const url: string = storage.load(KEYS.QPLUS_API_URL) || ''
        const path: string = storage.load(KEYS.QPLUS_GATEWAY) || ''
        const query = {
            'x-vp': storage.load(KEYS.QPLUS_VIRTUAL_PROXY) || '',
            'x-tenant-id': storage.load(KEYS.QPLUS_TENANT_ID) || '',
            'x-customer-id': storage.load(KEYS.QPLUS_CUSTOMER_ID) || '',
            'x-app-name': storage.load(KEYS.QPLUS_MASHUP_APP_ID) || '',
            token: storage.load(KEYS.QPLUS_SAAS_TOKEN) || ''
        }
        connect(url, path, query)
    })

    const onNotification = useCallback((data: Notification<any>) => {
        switch (data.type) {
            case NotificationType.UserCommentCreated:
                userCommentCreatedSubject.notify(data)
                break

            case NotificationType.UserCommentReplied:
                userCommentRepliedSubject.notify(data)
                break

            case NotificationType.UserCreatedReactionOnVisualization:
                userCreatedReactionVisualizationSubject.notify(data)
                break

            case NotificationType.UserCreatedReactionOnComment:
                userCreatedReactionCommentSubject.notify(data)
                break

            case NotificationType.UserTaggedInComment:
                userTaggedInCommentSubject.notify(data)
                break

            case NotificationType.CustomerCommentCountChanged:
                customerCommentCountChangedSubject.notify(data)
                break

            case NotificationType.CustomerReactionCountChanged:
                customerReactionCountChangedSubject.notify(data)
                break
            case NotificationType.UserDataLoaded:
                userDataLoadedSubject.notify(data)
                break
            case NotificationType.SystemReportCreated:
                systemReportCreatedSubject.notify(data)
                break
            case NotificationType.UserReportShared:
                userReportSharedSubject.notify(data)
                break
            case NotificationType.UserBookmarkShared:
                userBookmarkSharedSubject.notify(data)
                break
            case NotificationType.ReportCommentCountChanged:
                reportCommentCountChangedSubject.notify(data)
                break
        }
    }, [])

    const connect = useCallback(
        (url: string, path: string, query: any) => {
            try {
                socketService.connect(url, path, query)
                socketService.setNotificationCallback(onNotification)
            } catch (error) {
                console.log('DEBUG Notification Connect', error)
            }
        },
        [onNotification]
    )

    const disconnect = useCallback(() => {
        socketService.disconnect()
    }, [])

    const notificationProviderValues = {
        connect,
        disconnect,
        userCommentCreatedSubject,
        userTaggedInCommentSubject,
        userCommentRepliedSubject,
        userCreatedReactionVisualizationSubject,
        userCreatedReactionCommentSubject,
        userDataLoadedSubject,
        customerCommentCountChangedSubject,
        customerReactionCountChangedSubject,
        customerDataLoadedSubject,
        systemReportCreatedSubject,
        userReportSharedSubject,
        userBookmarkSharedSubject,
        reportCommentCountChangedSubject
    }

    return (
        <NotificationContext.Provider value={notificationProviderValues}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider
