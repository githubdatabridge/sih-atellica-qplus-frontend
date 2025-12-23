import React, { FC } from 'react'

import { IconButton, Tooltip, useTheme } from '@mui/material'
import Box from '@mui/material/Box'

import { Sentiment, sentiments, SvgLikeIcon } from '../sentiments'
import ReactionIcon from './ReactionIcon'

export interface IQlikReactionButtonProps {
    targetId: number
    noIcon?: boolean
    isForComments?: boolean
    isDisabled?: boolean
}

const ReactionButton: FC<IQlikReactionButtonProps> = ({ targetId, isForComments = false }) => {
    const theme = useTheme()
    const iconSize = isForComments ? '20px' : '22px'
    const iconPadding = isForComments ? '3px' : '12px'

    const reactionIcons = sentiments.map((sentiment: Sentiment) => (
        <ReactionIcon
            key={sentiment.score}
            {...sentiment}
            targetId={targetId}
            isForComments={isForComments}
        />
    ))

    return (
        <Tooltip
            disableInteractive={false}
            placement="bottom-start"
            enterTouchDelay={0}
            leaveDelay={100}
            componentsProps={{
                tooltip: {
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.getContrastText(theme.palette.text.primary),
                        boxShadow: theme.shadows[7],
                        maxWidth: 'none',
                        zIndex: 1,
                        padding: 0
                    }
                }
            }}
            title={
                <Box
                    alignItems="center"
                    display="flex"
                    minWidth="320px"
                    borderRadius={1}
                    border={`1px solid ${theme.palette.divider}`}
                    bgcolor={theme.palette.background.paper}
                    sx={{ marginTop: '-15px', marginLeft: '-10px' }}>
                    {reactionIcons}
                </Box>
            }>
            <IconButton style={{ padding: iconPadding }} size="small">
                <SvgLikeIcon
                    style={{ width: iconSize, height: iconSize, opacity: 0.7 }}
                    height={iconSize}
                    width={iconSize}
                    fill={theme.palette.text.primary}
                />
            </IconButton>
        </Tooltip>
    )
}

export default ReactionButton
