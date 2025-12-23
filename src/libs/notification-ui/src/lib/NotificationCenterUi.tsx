import React, { FC, useState } from 'react'

import { useQlikLoaderContext } from '@libs/qlik-providers'

import NotificationCenterButton from './components/button/NotificationCenterButton'
import NotificationCenterMenu from './components/menu/NotificationCenterMenu'

export enum NotificationType {
    NOTIFICATION_TYPE_COMMENT = 0,
    NOTIFICATION_TYPE_REPORT = 1
}

const NOTIFICATION_VIEWS = ['comments', 'reports']

export type TNotificationCenterUIClasses = {
    icon?: string
    iconButton?: string
    badge?: string
    appBar?: string
    toolbar?: string
    menuTitleContainer?: string
    menuTitle?: string
    progressMarkReadAll?: string
    readAllIcon?: string
}

export interface INotificationCenterUiProps {
    views?: string[]
    notificationIcon?: React.ReactNode
    cssNotificationIcon?: React.CSSProperties
    color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    classNames?: TNotificationCenterUIClasses
}

const NotificationCenterUi: FC<INotificationCenterUiProps> = ({
    views = NOTIFICATION_VIEWS,
    cssNotificationIcon = {},
    notificationIcon,
    classNames,
    color = 'secondary'
}) => {
    const [commentMentionCount, setCommentMentionCount] = useState<number>(0)
    const [reportMentionCount, setReportMentionCount] = useState<number>(0)
    const [notificationMenu, setNotificationMenu] = React.useState<null | HTMLElement>(null)
    const { isQlikMasterItemLoading } = useQlikLoaderContext()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bookmarkMenuClick = (refValue: React.MutableRefObject<any>) => {
        setNotificationMenu(refValue.current)
    }

    const bookmarkMenuClose = () => {
        setNotificationMenu(null)
    }

    const handleCommentCount = (count: number) => {
        if (views?.includes('comments')) {
            setCommentMentionCount(count)
        }
    }

    const handleReportCount = (count: number) => {
        if (views?.includes('reports')) {
            setReportMentionCount(count)
        }
    }

    const handleRestore = () => {
        setNotificationMenu(null)
    }

    return (
        <>
            <NotificationCenterButton
                reportMentionCount={reportMentionCount}
                commentMentionCount={commentMentionCount}
                notificationIcon={notificationIcon}
                classNames={classNames}
                cssNotificationIcon={cssNotificationIcon}
                color={color}
                bookmarkMenuClick={bookmarkMenuClick}
            />
            <NotificationCenterMenu
                notificationMenu={notificationMenu}
                commentMentionCount={commentMentionCount}
                reportMentionCount={reportMentionCount}
                views={views}
                isLoading={isQlikMasterItemLoading}
                color={color}
                bookmarkMenuClose={bookmarkMenuClose}
                handleRestore={handleRestore}
                handleCommentCount={handleCommentCount}
                handleReportCount={handleReportCount}
                classNames={classNames}
            />
        </>
    )
}

export default React.memo(NotificationCenterUi)
