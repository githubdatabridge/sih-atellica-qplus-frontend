import React, { useRef } from 'react'

import NotificationsIcon from '@mui/icons-material/Notifications'
import { Badge, ButtonBase } from '@mui/material'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import translation from '../../constants/translation'
import { createStyles } from './buttonStyles'

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bookmarkMenuClick: (value: React.MutableRefObject<any>) => void
    commentMentionCount: number
    reportMentionCount: number
    notificationIcon?: React.ReactNode
    color?: string
    cssNotificationIcon?: React.CSSProperties
    classNames?: {
        badge?: string
        iconButton?: string
        icon?: string
    }
}

const NotificationCenterButton = ({
    bookmarkMenuClick,
    commentMentionCount,
    reportMentionCount,
    color,
    notificationIcon,
    cssNotificationIcon,
    classNames
}: Props) => {
    const { t } = useI18n()
    const menuButtonRef = useRef(null)

    const handleMenuClick = () => {
        bookmarkMenuClick(menuButtonRef)
    }

    const useStyles = createStyles(color)
    const { classes } = useStyles()

    return (
        <IconTooltip title={t(translation.notificationTooltipTitle)}>
            <ButtonBase
                ref={menuButtonRef}
                onClick={handleMenuClick}
                aria-controls="customized-menu"
                aria-haspopup="true"
                className={classes.button}>
                <Badge
                    classes={{ badge: `${classes.customBadge} ${classNames?.badge || ''}` }}
                    badgeContent={commentMentionCount + reportMentionCount}
                    max={99}>
                    {notificationIcon || (
                        <div className={`${classes.iconButton} ${classNames?.iconButton || ''}`}>
                            <NotificationsIcon
                                className={`${classes.icon} ${classNames?.icon || ''}`}
                                style={{ ...cssNotificationIcon }}
                            />
                        </div>
                    )}
                </Badge>
            </ButtonBase>
        </IconTooltip>
    )
}

export default NotificationCenterButton
