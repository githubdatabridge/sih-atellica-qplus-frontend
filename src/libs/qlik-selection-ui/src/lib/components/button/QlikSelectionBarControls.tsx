import React, { memo, FC } from 'react'

import { Box, IconButton } from '@mui/material'

import { useI18n, useBaseUiContext } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { useQlikApp } from '@libs/qlik-providers'

import translation from '../../constants/translation'
import SvgBackwardArrowIcon from '../../icons/SvgBackwardArrowIcon'
import SvgClearIcon from '../../icons/SvgClearIcon'
import SvgForwardArrowIcon from '../../icons/SvgForwardArrowIcon'

export interface QlikSelectionBarControlsProps {
    qlikAppId?: string
}

const QlikSelectionBarControls: FC<QlikSelectionBarControlsProps> = ({ qlikAppId }) => {
    const { qApi } = useQlikApp(qlikAppId)
    const { clearNode, redoNode, undoNode } = useBaseUiContext()
    const { t } = useI18n()

    const onClearSelection = async () => {
        //PAM: Clear Field Selection
        qApi?.$apiSelection.$apiSelectionState.clearAll()
    }

    const onUndoSelection = async () => {
        //PAM: Clear Field Selection
        qApi?.back()
    }

    const onRedoSelection = async () => {
        //PAM: Clear Field Selection
        qApi?.forward()
    }

    return (
        <Box display="flex" alignItems="center" marginX="6px">
            <IconTooltip title={t(translation.clear)}>
                <IconButton onClick={onClearSelection} size="large">
                    {clearNode || <SvgClearIcon width="24px" height="24px" />}
                </IconButton>
            </IconTooltip>
            <IconTooltip title={t(translation.undo)}>
                <IconButton onClick={onUndoSelection} size="large">
                    {undoNode || <SvgBackwardArrowIcon width="24px" height="24px" />}
                </IconButton>
            </IconTooltip>
            <IconTooltip title={t(translation.redo)}>
                <IconButton onClick={onRedoSelection} size="large">
                    {redoNode || <SvgForwardArrowIcon width="24px" height="24px" />}
                </IconButton>
            </IconTooltip>
        </Box>
    )
}

export default memo(QlikSelectionBarControls)
