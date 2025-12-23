import React, { FC, useEffect, useState } from 'react'

import UndoIcon from '@mui/icons-material/Undo'
import { IconButton, CircularProgress } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { useQlikBackward } from '@libs/qlik-capability-hooks'
import { useQlikApp, useQlikSelectionContext } from '@libs/qlik-providers'

import translations from './constants/translations'

type TQlikUndoClasses = {
    iconButton?: string
    iconButtonDisabled?: string
}

export interface IQlikUndoButtonProps {
    qlikAppId?: string
    color?: 'primary' | 'info' | 'secondary' | 'default' | 'inherit'
    size?: 'small' | 'medium' | 'large'
    classNames?: TQlikUndoClasses
    icon?: React.ReactNode
    cssIcon?: any
    cssButtonIcon?: any
    isGlobalContext?: boolean
}

const QlikUndoButton: FC<IQlikUndoButtonProps> = ({
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
    const [backwardCount, setBackwardCount] = useState<number>(0)
    const { classes } = useStyles()
    const { qAppId } = useQlikApp(qlikAppId)
    const { qSelectionMap, qGlobalBackwardCount, previousSelectionsFromContext } =
        useQlikSelectionContext()
    const { setBackward } = useQlikBackward()
    const { t } = useI18n()

    useEffect(() => {
        if (qSelectionMap && !isGlobalContext) {
            const qAppSelections = qSelectionMap?.get(qlikAppId ?? qAppId)
            setBackwardCount(qAppSelections?.qBackwardCount || 0)
        } else {
            setBackwardCount(qGlobalBackwardCount)
        }
    }, [qSelectionMap, qlikAppId, qAppId, qGlobalBackwardCount, isGlobalContext])

    const handleUndoClick = async () => {
        try {
            setIsLoading(true)
            if (!isGlobalContext) await setBackward(qlikAppId ?? qAppId)
            else await previousSelectionsFromContext()
        } finally {
            setIsLoading(false)
        }
    }

    if (!qSelectionMap) return null

    return (
        <IconTooltip title={t(translations.buttonUndoTooltip)}>
            <IconButton
                color={color}
                aria-label="hyperlink"
                component="span"
                disabled={backwardCount === 0}
                onClick={handleUndoClick}
                className={`${classes.iconButton}`}
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
                    icon || <UndoIcon sx={{ ...cssIcon }} />
                )}
            </IconButton>
        </IconTooltip>
    )
}

export default QlikUndoButton

const useStyles = makeStyles()(() => ({
    iconButton: {
        cursor: 'pointer'
    }
}))
