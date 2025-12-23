import React, { FC } from 'react'

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useTheme, Theme } from '@mui/material'
import IconButton from '@mui/material/IconButton'

import { IconTooltip } from '../ui'

export interface IRemoveBookmarkIconProps {
    onRemoveBookmark: (event: any) => void
}

const RemoveBookmarkIcon: FC<IRemoveBookmarkIconProps> = ({ onRemoveBookmark }) => {
    const theme = useTheme()
    return (
        <IconTooltip title="Remove">
            <IconButton size="small" onClick={onRemoveBookmark}>
                <DeleteOutlineIcon fontSize="small" style={{ color: theme.palette.text.primary }} />
            </IconButton>
        </IconTooltip>
    )
}

export default React.memo(RemoveBookmarkIcon)
