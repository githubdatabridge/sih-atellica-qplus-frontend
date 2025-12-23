import React, { FC, useMemo } from 'react'

import FilterListIcon from '@mui/icons-material/FilterList'
import { useTheme, Theme } from '@mui/material'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'

import R from '../../res/R'
import { IconTooltip } from '../ui'

export interface IRestoreBookmarkIconProps {
    isMatchingSelection?: boolean
}

const RestoreBookmarkIcon: FC<IRestoreBookmarkIconProps & Partial<IconButtonProps>> = ({
    isMatchingSelection = false,
    ...props
}) => {
    const theme = useTheme()
    const restoreBookmarkIconStyle = useMemo(
        () =>
            isMatchingSelection
                ? { fill: R.colors.socialGreen }
                : { fill: theme.palette.text.primary },
        [isMatchingSelection]
    )

    return (
        <IconTooltip title="translate_restore_bookmark">
            <IconButton edge="end" size="small" onClick={props.onClick} {...props}>
                <FilterListIcon fontSize="small" style={restoreBookmarkIconStyle} />
            </IconButton>
        </IconTooltip>
    )
}

export default React.memo(RestoreBookmarkIcon)
