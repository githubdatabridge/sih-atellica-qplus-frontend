import React, { FC } from 'react'

import ReactPlayer from 'react-player'

import Box from '@mui/material/Box'

import DraggableDialog from '../dialogs/DraggableDialog'

export interface IVideoDialogProps {
    title: string
    pageId: string
    url
    width?: string
    height?: string
    config?: any
    controls?: boolean
}

const VideoDialog: FC<IVideoDialogProps> = ({
    title,
    pageId,
    url,
    height = '50vh',
    width = '100%',
    config,
    controls = true
}) => {
    return (
        <DraggableDialog
            pageId={pageId}
            title={title}
            dialogProps={{ maxWidth: 'md' }}
            hideBackdrop={false}>
            <Box m={0}>
                <ReactPlayer
                    controls={controls}
                    url={url}
                    height={height}
                    width={width}
                    style={{ overflow: 'hidden' }}
                    config={config}
                />
            </Box>
        </DraggableDialog>
    )
}

export default VideoDialog
