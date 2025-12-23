import React, { FC, memo } from 'react'

import { Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

import { useQlikReactionContext } from '@libs/collaboration-providers'
import { ReactionLoader } from '@libs/common-ui'

import { sentiments } from '../sentiments'
import ReactionSummaryIcon from './ReactionSummaryIcon'

export interface IQlikReactionSummaryProps {
    isForComments?: boolean
    handleSyncRemoveCallback?: () => void
}

const ReactionSummary: FC<IQlikReactionSummaryProps> = ({
    isForComments,
    handleSyncRemoveCallback
}) => {
    const { reactionCount, givenSentiments, matchedReactionCount, isLoadingReactions } =
        useQlikReactionContext()

    const { classes } = useStyles()

    if (reactionCount === null) return <p>Loading...</p>

    const renderReactionIcons = (isForComments: boolean | undefined) => (
        <Box display="flex" alignItems="center" style={{ cursor: 'pointer' }}>
            {givenSentiments.map(givenSentiment => {
                const sentiment = sentiments.find(
                    sentiment => Number(sentiment.score) === Number(givenSentiment.score)
                )

                return (
                    sentiment && (
                        <Box pl={0.5} pr={0.5} key={sentiment.score}>
                            <ReactionSummaryIcon
                                icon={sentiment.icon}
                                label={sentiment.label}
                                score={sentiment.score}
                                isForComments={Boolean(isForComments)}
                                isMatchingSelection={true}
                                handleSyncRemoveCallback={handleSyncRemoveCallback}
                            />
                        </Box>
                    )
                )
            })}
        </Box>
    )

    if (isForComments) {
        return isLoadingReactions ? (
            <ReactionLoader />
        ) : (
            <Box display="flex" flexDirection="row" alignItems="center">
                {renderReactionIcons(isForComments)}
            </Box>
        )
    }

    if (reactionCount === 0) return null

    return (
        <Box display="flex" flexDirection="row" alignItems="center" style={{ padding: '12px' }}>
            {isLoadingReactions ? (
                <ReactionLoader />
            ) : (
                <>
                    {renderReactionIcons(isForComments)}
                    <Box marginX="6px">
                        <Typography
                            className={
                                classes.text
                            }>{`${matchedReactionCount} of ${reactionCount}`}</Typography>
                    </Box>
                </>
            )}
        </Box>
    )
}

export default memo(ReactionSummary)

const useStyles = makeStyles()((theme: Theme) => ({
    text: {
        fontSize: '0.75rem'
    }
}))
