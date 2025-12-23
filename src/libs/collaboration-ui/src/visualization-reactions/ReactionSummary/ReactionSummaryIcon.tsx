import React, { FC, useEffect, useMemo, useState } from 'react'

import { usePromise, useUpdateEffect } from 'react-use'

import { Box, useTheme, Theme, Tooltip } from '@mui/material'
import MuiBadge from '@mui/material/Badge'
import { alpha } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import {
    useQlikBaseSocialContext,
    useQlikReactionContext,
    useQlikSocialContext
} from '@libs/collaboration-providers'
import { reactionService } from '@libs/collaboration-services'
import { Badge } from '@libs/common-ui'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import ReactionSummaryList from './ReactionSummaryList'

export interface IQlikReactionSummaryIconProps {
    label: string
    score: number
    icon: any
    isForComments: boolean
    isMatchingSelection: boolean
    handleSyncRemoveCallback?: () => void
}

const ReactionSummaryIcon: FC<IQlikReactionSummaryIconProps> = ({
    label,
    score,
    icon: SentimentIcon,
    isForComments,
    isMatchingSelection,
    handleSyncRemoveCallback
}) => {
    const { scope, visualizationId, qlikAppId } = useQlikBaseSocialContext()
    const { reactionCount } = useQlikReactionContext()

    const { qSelectionMap } = useQlikSelectionContext()
    const [reactions, setReactions] = useState<any>()
    const [matchingSelection, setMatchingSelection] = useState(0)
    const { showSentimentBadge } = useQlikSocialContext()

    const mounted = usePromise()

    const contentType = useMemo(
        () => (isForComments ? 'comment' : 'visualization'),
        [isForComments]
    )

    useEffect(() => {
        void (async () => {
            const fetchedReactions = await mounted(
                reactionService.getReactionsBySentiment({
                    scope,
                    score,
                    targetId: Number(visualizationId),
                    content: contentType
                })
            )

            setReactions(fetchedReactions)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visualizationId, reactionCount])

    useUpdateEffect(() => {
        if (!reactions || reactions.length === 0) return

        const matching = reactions.reduce(
            (total: any, qr: any) =>
                total +
                qr.reactions.reduce(
                    (t: any, r: any) =>
                        r.qlikState.qsSelectionHash ===
                        qSelectionMap?.get(qlikAppId)?.qSelectionHash
                            ? t + 1
                            : t + 0,
                    0
                ),
            0
        )

        setMatchingSelection(matching)
    }, [qSelectionMap, reactions])

    const { classes } = useStyles()
    const theme = useTheme()
    const iconSize = useMemo(() => (isForComments ? '20px' : '22px'), [isForComments])
    const iconMargin = useMemo(() => (isForComments ? '6px' : '8px'), [isForComments])

    const iconColor = useMemo(
        () =>
            isForComments
                ? theme.palette.text.primary
                : matchingSelection > 0
                ? theme.palette.text.primary
                : theme.palette.text.disabled,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isForComments]
    )

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
                <ReactionSummaryList
                    matchingCount={matchingSelection}
                    icon={SentimentIcon}
                    score={score}
                    isForComments={isForComments}
                    handleRemoveCallback={handleSyncRemoveCallback}
                />
            }>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ width: iconSize, height: iconSize, marginRight: iconMargin }}
                bgcolor={theme.palette.background.default}>
                {showSentimentBadge ? (
                    <Badge badgeContent={matchingSelection} max={99}>
                        <SentimentIcon
                            fill={iconColor}
                            style={{ width: iconSize, height: iconSize }}
                        />
                    </Badge>
                ) : (
                    <MuiBadge
                        badgeContent={matchingSelection > 1 ? '+' : null}
                        variant={matchingSelection > 1 ? 'dot' : null}
                        classes={{ badge: matchingSelection > 1 ? classes.customBadge : null }}
                        style={{
                            background: 'transparent',
                            color: 'white'
                        }}>
                        <SentimentIcon
                            fill={
                                matchingSelection > 0 || isForComments
                                    ? theme.palette.text.primary
                                    : alpha(theme.palette.text.primary, 0.5)
                            }
                            style={{ width: iconSize, height: iconSize }}
                        />
                    </MuiBadge>
                )}
            </Box>
        </Tooltip>
    )
}

export default React.memo(ReactionSummaryIcon)

const useStyles = makeStyles()((theme: Theme) => ({
    text: {
        fontSize: '0.75rem'
    },
    customBadge: {
        backgroundColor: 'transparent',
        color: '#FFF',
        fontSize: '0.4rem'
    }
}))
