import React, { FC, useEffect, useState } from 'react'

import RedoIcon from '@mui/icons-material/Redo'
import { IconButton, CircularProgress } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { useQlikForward } from '@libs/qlik-capability-hooks'
import { useQlikApp, useQlikSelectionContext } from '@libs/qlik-providers'

import translations from './constants/translations'

type TQlikRedoClasses = {
    iconButton?: string
    iconButtonDisabled?: string
}
export interface IQlikRedoButtonProps {
    qlikAppId?: string
    color?: 'primary' | 'info' | 'secondary' | 'default' | 'inherit'
    size?: 'small' | 'medium' | 'large'
    classNames?: TQlikRedoClasses
    icon?: React.ReactNode
    cssIcon?: any
    cssButtonIcon?: any
    isGlobalContext?: boolean
}

const QlikRedoButton: FC<IQlikRedoButtonProps> = ({
    qlikAppId,
    icon,
    color = 'inherit',
    size = 'small',
    classNames,
    cssIcon,
    cssButtonIcon,
    isGlobalContext = false
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [forwardCount, setForwardCount] = useState<number>(0)
    const { classes } = useStyles()
    const { qAppId } = useQlikApp(qlikAppId)
    const { qSelectionMap, qGlobalForwardCount, nextSelectionsFromContext } =
        useQlikSelectionContext()
    const { setForward } = useQlikForward()
    const { t } = useI18n()

    useEffect(() => {
        if (qSelectionMap && !isGlobalContext) {
            const qAppSelections = qSelectionMap?.get(qlikAppId ?? qAppId)
            setForwardCount(qAppSelections?.qForwardCount || 0)
        } else {
            setForwardCount(qGlobalForwardCount)
        }
    }, [qSelectionMap, qlikAppId, qAppId, isGlobalContext, qGlobalForwardCount])

    const handleUndoClick = async () => {
        try {
            setIsLoading(true)
            if (!isGlobalContext) await setForward(qlikAppId ?? qAppId)
            else await nextSelectionsFromContext()
        } finally {
            setIsLoading(false)
        }
    }

    if (!qSelectionMap) return null

    return (
        <IconTooltip title={t(translations.buttonRedoTooltip)}>
            <IconButton
                color={color}
                aria-label="hyperlink"
                component="span"
                disabled={forwardCount === 0}
                onClick={handleUndoClick}
                className={`${classes?.iconButton}`}
                classes={{
                    root: classNames?.iconButton,
                    disabled: classNames?.iconButtonDisabled
                }}
                size={size}
                sx={{
                    ...cssButtonIcon
                }}>
                {isLoading ? (
                    <CircularProgress color="secondary" size={24} />
                ) : (
                    icon || <RedoIcon sx={{ ...cssIcon }} />
                )}
            </IconButton>
        </IconTooltip>
    )
}

export default QlikRedoButton

const useStyles = makeStyles()(() => ({
    iconButton: {
        cursor: 'pointer'
    }
}))
