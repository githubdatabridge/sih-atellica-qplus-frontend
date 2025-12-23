import React, { FC, useEffect, useState } from 'react'

import ClearIcon from '@mui/icons-material/Clear'
import { IconButton } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { useQlikAppContext } from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import translation from '../../constants/translation'

export type TQlikSelectionClasses = {
    root?: string
    disabled?: string
}

export interface IQlikSelectionClearButtonProps {
    classNames?: TQlikSelectionClasses
    clearIcon?: React.ReactNode
}

const QlikSelectionClearButton: FC<IQlikSelectionClearButtonProps> = ({
    classNames,
    clearIcon
}) => {
    const { classes } = useStyles()
    const [count, setCount] = useState(0)
    const { t } = useI18n()
    const { qGlobalSelectionCount } = useQlikSelectionContext()
    const { qAppMap } = useQlikAppContext()

    useEffect(() => {
        setCount(qGlobalSelectionCount || 0)
    }, [qGlobalSelectionCount])

    const handleClearClick = () => {
        for (const [, value] of qAppMap) {
            value?.qApi.clearAll()
        }
    }

    const isDisabled = count === 0

    return (
        <IconTooltip title={t(translation.clear)}>
            <IconButton
                color="secondary"
                aria-label="favorite"
                component="span"
                onClick={handleClearClick}
                className={classes.iconButton}
                classes={{
                    root: classNames?.root,
                    disabled: classNames?.disabled
                }}
                disabled={isDisabled}
                size="large">
                {clearIcon ?? <ClearIcon />}
            </IconButton>
        </IconTooltip>
    )
}

export default QlikSelectionClearButton

const useStyles = makeStyles()((theme: any) => ({
    iconButton: {
        cursor: 'pointer'
    }
}))
