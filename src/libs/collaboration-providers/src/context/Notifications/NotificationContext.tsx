import { useContext, createContext } from 'react'

import { Subject } from '@libs/collaboration-services'
import { BasicUserInfo } from '@libs/common-models'

export enum NotificationType {
    UserCreatedReactionOnVisualization = 'user.reaction.visualization',
    UserCreatedReactionOnComment = 'user.reaction.comment',
    UserTaggedInComment = 'user.tag.comment',
    UserCommentReplied = 'user.comment.replied',
    UserCommentCreated = 'user.comment.created',
    UserDataLoaded = 'user.qlik.data.loaded',
    CustomerReactionCountChanged = 'customer.reaction.count.changed',
    CustomerCommentCountChanged = 'customer.comment.count.changed',
    ReportCommentCountChanged = 'report.comment.count.changed',
    CustomerDataLoaded = 'customer.qlik.data.loaded',
    SystemReportCreated = 'system.report.created',
    UserReportShared = 'user.shared.report',
    UserBookmarkShared = 'user.shared.bookmark'
}

export interface Notification<T> {
    type?: NotificationType
    appUserId?: string
    customerId?: string
    data?: T
}

export interface userCreatedReactionVisualizationData {
    type?: NotificationType.UserCreatedReactionOnVisualization
    commentId?: number
    reactionId?: number
    visualizationId?: number
    reactedBy?: string
    firstName?: string
    sentiment?: string
    initials?: string
    email?: string
    user?: BasicUserInfo
}

export interface userCreatedReactionCommentData {
    type?: NotificationType.UserCreatedReactionOnVisualization
    commentId?: number
    reactionId?: number
    reactedBy?: string
    firstName?: string
    sentiment?: string
    initials?: string
    email?: string
    user?: BasicUserInfo
}

export interface userCommentRepliedData {
    visualizationId?: number
    commentId?: number
    replyCommentId?: number
    firstName?: string
    repliedBy?: string
    content?: string
    initials?: string
    email?: string
    url?: string
    user?: BasicUserInfo
}

export interface userTaggedInCommentData {
    visualizationId?: number
    commentId?: number
    firstName?: string
    taggedBy?: string
    content?: string
    initials?: string
    email?: string
    url?: string
    user?: BasicUserInfo
}

export interface userCommentCreatedData {
    visualizationId?: number
    reportId?: number
    commentId?: number
    firstName?: string
    content?: string
    initials?: string
    email?: string
    url?: string
    user?: BasicUserInfo
}

export interface customerCommentCountChangedData {
    visualizationId?: number
    reportId?: number
    count: number
}

export interface reportCommentCountChangedData {
    reportId?: number
    count: number
}

export interface userDataLoadedData {
    jobId: number
    status: string
    lastReloadDate?: string
}

export interface customerDataLoadedData {
    triggeredBy?: string
    lastReloadDate?: string
    status: string
    jobId: number
}

export interface customerReactionCountChangedData {
    visualizationId?: number
    count: number
}

export interface systemReportCreatedData {
    initials: string
    firstName: string
    reportId: number
    title: string
    visualizationType: string
    system: boolean
    user?: BasicUserInfo
}

export interface userReportSharedData {
    initials: string
    firstName: string
    reportId: number
    title: string
    visualizationType: string
    system: boolean
    user?: BasicUserInfo
}

export interface userBookmarkSharedData {
    initials: string
    firstName: string
    bookmarkId: number
    path?: string
    name: string
    user?: BasicUserInfo
}

type NotificationContextType = {
    userCommentCreatedSubject: Subject<Notification<userCommentCreatedData>> | null
    userTaggedInCommentSubject: Subject<Notification<userTaggedInCommentData>> | null
    userCommentRepliedSubject: Subject<Notification<userCommentRepliedData>> | null
    userCreatedReactionVisualizationSubject: Subject<
        Notification<userCreatedReactionVisualizationData>
    > | null
    userCreatedReactionCommentSubject: Subject<Notification<userCreatedReactionCommentData>> | null
    userDataLoadedSubject: Subject<Notification<userDataLoadedData>> | null
    customerCommentCountChangedSubject: Subject<
        Notification<customerCommentCountChangedData>
    > | null
    customerReactionCountChangedSubject: Subject<
        Notification<customerReactionCountChangedData>
    > | null
    customerDataLoadedSubject: Subject<Notification<customerDataLoadedData>> | null
    systemReportCreatedSubject: Subject<Notification<systemReportCreatedData>> | null
    userReportSharedSubject: Subject<Notification<userReportSharedData>> | null
    userBookmarkSharedSubject: Subject<Notification<userBookmarkSharedData>> | null
    reportCommentCountChangedSubject: Subject<Notification<reportCommentCountChangedData>> | null
    connect?: (url: string, path?: string, headers?: any, query?: any) => void
    disconnect?: () => void
}

export const NotificationContext = createContext<NotificationContextType>({
    userCommentCreatedSubject: null,
    userTaggedInCommentSubject: null,
    userCommentRepliedSubject: null,
    userCreatedReactionVisualizationSubject: null,
    userCreatedReactionCommentSubject: null,
    userDataLoadedSubject: null,
    customerCommentCountChangedSubject: null,
    customerReactionCountChangedSubject: null,
    customerDataLoadedSubject: null,
    userReportSharedSubject: null,
    userBookmarkSharedSubject: null,
    systemReportCreatedSubject: null,
    reportCommentCountChangedSubject: null,
    connect: undefined,
    disconnect: undefined
})

export const useNotificationContext = () => useContext(NotificationContext)
