import { FC, useState } from 'react'

import { useMount, usePromise } from 'react-use'

import { Theme, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

import { Reaction } from '@libs/collaboration-models'
import {
    useQlikReactionContext,
    useQlikBaseSocialContext
} from '@libs/collaboration-providers'
import { reactionService } from '@libs/collaboration-services'
import { ReactionSummaryLoader } from '@libs/common-ui'
import { useQlikApp } from '@libs/qlik-providers'

import ReactionSummaryListItem from './ReactionSummaryListItem'

export interface IQlikReactionSummaryListProps {
    score: number
    isForComments: boolean
    icon: any
    matchingCount: number
    handleRemoveCallback?: () => void
}

const ReactionSummaryList: FC<IQlikReactionSummaryListProps> = ({
    score,
    isForComments,
    matchingCount,
    handleRemoveCallback,
    icon: SentimentIcon
}) => {
    const mounted = usePromise()

    const { scope, qlikAppId } = useQlikBaseSocialContext()
    const { targetId } = useQlikReactionContext()
    const { qEnigmaApi } = useQlikApp(qlikAppId)

    const [reactions, setReactions] = useState<{ appUserId: string; reactions: Reaction[] }[]>([])
    const [count, setReactionCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const { classes } = useStyles()

    const loadReactions = async (withLoader?: boolean) => {
        try {
            if (withLoader) setIsLoading(true)

            const contentType = isForComments ? 'comment' : 'visualization'

            const reactionsRequest = reactionService.getReactionsBySentiment({
                scope,
                score,
                targetId: Number(targetId),
                content: contentType
            })

            const fetchedReactions = await mounted(reactionsRequest)

            const count = fetchedReactions.reduce((total, qr) => total + qr.reactions.length, 0)

            setReactions(fetchedReactions as any)
            setReactionCount(count)
        } finally {
            if (withLoader) setIsLoading(false)
        }
    }
    useMount(async () => {
        await loadReactions(true)
    })

    const onRemoveReaction = async ({ bookmarkId, reactionId }: any) => {
        if (bookmarkId) qEnigmaApi?.destroyBookmark(bookmarkId)
        await reactionService.removeReaction(reactionId)
        if (handleRemoveCallback) {
            handleRemoveCallback()
        }
        await loadReactions(true)
    }

    const theme = useTheme()

    if (isLoading) {
        return (
            <Box display="flex">
                <ReactionSummaryLoader />
            </Box>
        )
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            bgcolor={theme.palette.background.paper}
            border={`1px solid ${theme.palette.divider}`}
            pl={1}
            pb={1}>
            {!isForComments && (
                <>
                    <Box display="flex" flexDirection="row" alignItems="center" marginY="6px">
                        <SentimentIcon className={classes.sentiment} />
                        <Typography
                            className={classes.text}>{`${matchingCount} of ${count}`}</Typography>
                    </Box>
                    <Divider />
                </>
            )}
            <Box
                display="flex"
                flexDirection="column"
                style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {reactions.map(reaction => (
                    <ReactionSummaryListItem
                        key={reaction.appUserId}
                        reactions={reaction.reactions}
                        appUserId={reaction.appUserId}
                        isForComments={isForComments}
                        onRemoveReaction={onRemoveReaction}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default ReactionSummaryList

const useStyles = makeStyles()((theme: Theme) => ({
    text: {
        fontSize: '0.75rem',
        color: theme.palette.text.primary
    },
    sentiment: {
        height: '14px',
        width: '14px',
        marginRight: '8px',
        fill: theme.palette.text.primary
    }
}))
