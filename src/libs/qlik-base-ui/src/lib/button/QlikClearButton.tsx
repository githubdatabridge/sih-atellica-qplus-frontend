import React, { FC, useEffect, useState } from 'react'

import ClearAllIcon from '@mui/icons-material/ClearAll'
import { IconButton, CircularProgress } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { useQlikClearAll } from '@libs/qlik-capability-hooks'
import { useQlikApp, useQlikSelectionContext } from '@libs/qlik-providers'

import translations from './constants/translations'

type TQlikClearClasses = {
    iconButton?: string
    iconButtonDisabled?: string
}

export interface IQlikClearButtonProps {
    qlikAppId?: string
    color?: 'primary' | 'info' | 'secondary' | 'default' | 'inherit'
    size?: 'small' | 'medium' | 'large'
    showWithNoSelections?: boolean
    classNames?: TQlikClearClasses
    icon?: React.ReactNode
    cssIcon?: any
    cssButtonIcon?: any
    isGlobalContext?: boolean
}

const QlikClearButton: FC<IQlikClearButtonProps> = ({
    qlikAppId,
    icon,
    color = 'inherit',
    size = 'small',
    showWithNoSelections = true,
    isGlobalContext = false,
    classNames,
    cssIcon,
    cssButtonIcon
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [count, setCount] = useState<number>(0)
    const { classes } = useStyles()
    const { qAppId } = useQlikApp(qlikAppId)
    const { qSelectionMap, qGlobalSelectionCount, clearSelectionsFromContext } =
        useQlikSelectionContext()
    const { setClearAll } = useQlikClearAll()
    const { t } = useI18n()

    useEffect(() => {
        if (qSelectionMap && !isGlobalContext) {
            const qAppSelections = qSelectionMap?.get(qlikAppId ?? qAppId)
            setCount(qAppSelections?.qSelectionCount || 0)
        } else {
            setCount(qGlobalSelectionCount)
        }
    }, [qSelectionMap, qGlobalSelectionCount, isGlobalContext, qlikAppId, qAppId])

    const handleClearClick = async () => {
        try {
            setIsLoading(true)
            if (!isGlobalContext) {
                await setClearAll(qlikAppId ?? qAppId)
            } else {
                await clearSelectionsFromContext
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (!qSelectionMap) return null

    return showWithNoSelections || count > 0 ? (
        <IconTooltip title={t(translations.buttonClearTooltip)}>
            <IconButton
                color={color}
                aria-label="hyperlink"
                component="span"
                disabled={count === 0}
                onClick={handleClearClick}
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
                    icon || <ClearAllIcon sx={{ ...cssIcon }} />
                )}
            </IconButton>
        </IconTooltip>
    ) : null
}

export default QlikClearButton

const useStyles = makeStyles()(() => ({
    iconButton: {
        cursor: 'pointer'
    }
}))
