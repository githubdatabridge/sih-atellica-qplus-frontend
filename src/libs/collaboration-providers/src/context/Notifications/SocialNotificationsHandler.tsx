import { FC, useEffect } from 'react'

import { useAuthContext, useI18n } from '@libs/common-providers'
import { AlertType, AlertDuration, useAlertContext } from '@libs/common-ui'

import translation from '../constants/translation'
import { useNotificationContext } from './NotificationContext'

interface SocialNotificationsHandlerProps {
    duration?: AlertDuration
    children?: any
}

const SocialNotificationsHandler: FC<SocialNotificationsHandlerProps> = ({
    children,
    duration = AlertDuration.LONG
}) => {
    const { showToast } = useAlertContext()
    const { appUser } = useAuthContext()
    const { t } = useI18n()
    const {
        userCommentCreatedSubject,
        userCommentRepliedSubject,
        userTaggedInCommentSubject,
        userCreatedReactionVisualizationSubject,
        userCreatedReactionCommentSubject,
        userReportSharedSubject,
        userBookmarkSharedSubject,
        systemReportCreatedSubject
    } = useNotificationContext()

    useEffect(() => {
        if (userCommentCreatedSubject) {
            userCommentCreatedSubject.attach(_observer => {
                showToast(
                    `<b>${_observer?.data?.user?.name}</b> ${t(
                        translation.notificationUserCommentCreatedMsg
                    )} ${
                        _observer?.data.reportId
                            ? t(translation.notificationCommentTypeReport)
                            : t(translation.notificationCommentTypeVisualization)
                    }!`,
                    AlertType.INFO,
                    duration
                )
            })
        }

        return () => {
            userCommentCreatedSubject?.detach((_observer: any) => undefined)
        }
    }, [])

    useEffect(() => {
        if (userCommentRepliedSubject) {
            userCommentRepliedSubject.attach(_observer => {
                showToast(
                    `<b>${_observer?.data?.user?.name}</b> ${t(
                        translation.notificationUserCommentRepliedMsg
                    )}!`,
                    AlertType.INFO,
                    duration
                )
            })
        }

        return () => {
            userCommentRepliedSubject?.detach((_observer: any) => undefined)
        }
    }, [])

    useEffect(() => {
        if (userTaggedInCommentSubject) {
            userTaggedInCommentSubject.attach(_observer => {
                showToast(
                    `${t(translation.notificationUserTaggedInCommentMsg)} <b>${
                        _observer?.data?.user?.name
                    }</b>!`,
                    AlertType.INFO,
                    duration
                )
            })
        }

        return () => {
            userTaggedInCommentSubject?.detach(_observer => undefined)
        }
    }, [])

    useEffect(() => {
        if (systemReportCreatedSubject) {
            systemReportCreatedSubject.attach(_observer => {
                if (appUser.appUserId !== _observer?.data?.user?.appUserId) {
                    showToast(
                        `<b>${_observer?.data?.user?.name}</b> ${t(
                            translation.notificationSystemReportCreatedMsg
                        )}!`,
                        AlertType.INFO,
                        duration
                    )
                }
            })
        }

        return () => {
            systemReportCreatedSubject?.detach(_observer => undefined)
        }
    }, [])

    useEffect(() => {
        if (userReportSharedSubject) {
            userReportSharedSubject.attach(_observer => {
                showToast(
                    `<b>${_observer?.data?.user?.name}</b> ${t(
                        translation.notificationUserReportCreatedMsg
                    )}!`,
                    AlertType.INFO,
                    duration
                )
            })
        }

        return () => {
            userReportSharedSubject?.detach(_observer => undefined)
        }
    }, [])

    useEffect(() => {
        if (userBookmarkSharedSubject) {
            userBookmarkSharedSubject.attach(_observer => {
                showToast(
                    `<b>${_observer?.data?.user?.name}</b> ${t(
                        translation.notificationUserBookmarkCreatedMsg
                    )}!`,
                    AlertType.INFO,
                    duration
                )
            })
        }

        return () => {
            userBookmarkSharedSubject?.detach(_observer => undefined)
        }
    }, [])

    useEffect(() => {
        if (userCreatedReactionVisualizationSubject) {
            userCreatedReactionVisualizationSubject.attach(_observer => {
                showToast(
                    `<b>${_observer?.data?.user?.name}</b> ${t(
                        translation.notificationUserCreatedReactionOnVisualizationdMsg
                    )}!`,
                    AlertType.INFO,
                    duration
                )
            })
        }

        return () => {
            userCreatedReactionVisualizationSubject?.detach(_observer => undefined)
        }
    }, [])

    useEffect(() => {
        if (userCreatedReactionCommentSubject) {
            userCreatedReactionCommentSubject.attach(_observer => {
                showToast(
                    `<b>${_observer?.data?.user?.name}</b> ${t(
                        translation.notificationUserCreatedReactionOnCommentdMsg
                    )}!`,
                    AlertType.INFO,
                    duration
                )
            })
        }

        return () => {
            userCreatedReactionCommentSubject?.detach(_observer => undefined)
        }
    }, [])

    return <>{children}</>
}

export default SocialNotificationsHandler
