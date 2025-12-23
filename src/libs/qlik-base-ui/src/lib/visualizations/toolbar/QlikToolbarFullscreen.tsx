import React, { FC } from 'react'

import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { IconButton } from '@mui/material'

import { useBaseUiContext } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import { useQlikVisualizationContext } from '../QlikVisualizationContext'

export interface IQlikToolbarFullscreenProps {
    title?: string
}

const QlikToolbarFullscreen: FC<IQlikToolbarFullscreenProps> = ({ title }) => {
    const { fullscreenNode } = useBaseUiContext()
    const { onVisualizationFullscreen } = useQlikVisualizationContext()

    return (
        <IconTooltip title={title}>
            <IconButton onClick={onVisualizationFullscreen} size="small">
                {fullscreenNode || <OpenInFullIcon color="primary" fontSize="small" />}
            </IconButton>
        </IconTooltip>
    )
}

export default QlikToolbarFullscreen
