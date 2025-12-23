import React, { FC, useState } from 'react'

import { Button, CircularProgress, IconButton, useTheme, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import {
    useQlikReactionContext,
    useQlikBaseSocialContext
} from '@libs/collaboration-providers'
import { reactionService } from '@libs/collaboration-services'
import { useI18n } from '@libs/common-providers'
import { AlertType, useAlertContext } from '@libs/common-ui'
import { useQlikAppContext } from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import translation from '../../constants/translation'

export interface IQlikReactionIconProps {
    score: number
    label: string
    icon: any
    targetId: number
    isForComments: boolean
}

const useStyles = makeStyles()((theme: Theme) => ({
    button: {
        '&:hover': {
            //you want this to be the same as the backgroundColor above
            backgroundColor: `transparent !important`
        }
    },
    icon: {
        '&:hover': {
            transform: 'scale(1.45)',
            transition: 'transform .125s ease-in'
        }
    }
}))

const ReactionIcon: FC<IQlikReactionIconProps> = ({
    score,
    icon: SentimentIcon,
    targetId,
    isForComments
}) => {
    const { showToast } = useAlertContext()
    const theme = useTheme()

    const { classes } = useStyles()

    const { qlikAppId, scope } = useQlikBaseSocialContext()
    const { qSelectionMap } = useQlikSelectionContext()
    const { qAppMap } = useQlikAppContext()
    const { syncReactions, previousReaction, setPreviousReaction } = useQlikReactionContext()
    const { t } = useI18n()

    const [isLoading, setIsLoading] = useState(false)

    const onReaction = async () => {
        setIsLoading(true)
        try {
            const bookmark = {
                name: score,
                class: 'Reaction',
                type: scope
            }

            let bookmarkId = null
            const qApp = qAppMap.get(qlikAppId)
            if (!isForComments) {
                bookmarkId = await qApp?.qEnigmaApi?.$createBookmark(bookmark)
            }

            const targetOptions = isForComments
                ? { commentId: targetId }
                : { visualizationId: targetId }

            const bookmarkOptions = isForComments
                ? {}
                : {
                      qlikState: {
                          qsBookmarkId: bookmarkId,
                          qsSelectionHash: qSelectionMap?.get(qlikAppId)?.qSelectionHash
                      }
                  }

            const reactionData = {
                ...targetOptions,
                ...bookmarkOptions,
                score,
                scope
            }

            if (previousReaction && isForComments) {
                await reactionService.editReaction({
                    reactionId: previousReaction,
                    reaction: {
                        score: reactionData.score
                    }
                })
                return
            }

            const reaction = await reactionService.addReaction(reactionData)
            if (setPreviousReaction) {
                setPreviousReaction(reaction.id)
            }
        } catch (error) {
            showToast(t(translation.collaborationReactionSubmitErrorMsg), AlertType.ERROR)
        } finally {
            if (isForComments) syncReactions()
            setIsLoading(false)
        }
    }

    const iconSize = isForComments ? '18px' : '22px'

    return (
        <Button disabled={isLoading} onClick={onReaction} className={classes.button}>
            {isLoading ? (
                <CircularProgress size={16} color="secondary" />
            ) : (
                <SentimentIcon
                    className={classes.icon}
                    fill={theme.palette.text.primary}
                    sx={{
                        height: iconSize,
                        width: iconSize
                    }}
                />
            )}
        </Button>
    )
}

export default React.memo(ReactionIcon)
