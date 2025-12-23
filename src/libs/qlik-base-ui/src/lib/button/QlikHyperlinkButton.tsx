import React, { FC } from 'react'

import { useNavigate } from 'react-router-dom'

import LinkIcon from '@mui/icons-material/Link'
import { IconButton } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { useQlikAppAction } from '@libs/qlik-capability-hooks'
import { QAction } from '@libs/qlik-models'

import translations from './constants/translations'

export interface IQlikHyperlinkButtonProps {
    pathName: string
    search?: string
    qlikActions?: QAction[]
    color?: 'primary' | 'secondary' | 'info' | 'default'
    className?: string
    icon?: React.ReactNode
}

const QlikHyperlinkButton: FC<IQlikHyperlinkButtonProps> = ({
    pathName,
    search = '',
    qlikActions,
    color = 'primary',
    className,
    icon
}) => {
    const { classes } = useStyles()
    const { setQlikAction } = useQlikAppAction()
    const navigate = useNavigate()
    const { t } = useI18n()

    const handleLinkClick = async () => {
        for (const action of qlikActions) {
            await setQlikAction(action)
        }
        navigate({
            pathname: pathName,
            search: search
        })
    }

    return (
        <IconTooltip title={t(translations.buttonLinkTooltip)}>
            <IconButton
                color={color}
                aria-label="hyperlink"
                component="span"
                onClick={handleLinkClick}
                className={` ${classes.iconButton} ${className}`}
                size="small">
                {icon ?? <LinkIcon />}
            </IconButton>
        </IconTooltip>
    )
}

export default QlikHyperlinkButton

const useStyles = makeStyles()((theme: any) => ({
    iconButton: {
        cursor: 'pointer'
    }
}))
