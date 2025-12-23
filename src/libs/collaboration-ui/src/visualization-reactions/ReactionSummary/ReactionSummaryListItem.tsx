import React, { FC } from 'react'

import { useToggle } from 'react-use'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Theme } from '@mui/material'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { makeStyles } from 'tss-react/mui'

import { Reaction } from '@libs/collaboration-models'
import { useQlikBaseSocialContext } from '@libs/collaboration-providers'
import { RestoreBookmarkIcon, RemoveBookmarkIcon, IconTooltip } from '@libs/common-ui'
import { useQlikApp } from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import Can from '../../Can'

dayjs.extend(relativeTime)

export interface IQlikReactionSummaryListItemProps {
    isForComments: boolean
    reactions: Reaction[]
    appUserId: string
    onRemoveReaction: ({ bookmarkId, reactionId }: any) => void
}

const ReactionSummaryListItem: FC<IQlikReactionSummaryListItemProps> = ({
    reactions,
    isForComments,
    appUserId,
    onRemoveReaction
}) => {
    const { qlikAppId } = useQlikBaseSocialContext()
    const { qSelectionMap } = useQlikSelectionContext()

    const theme = useTheme()
    const [isCollapsed, toggleCollapsed] = useToggle(false)
    const userFullName = `${reactions[0].user.name}`

    const { qEnigmaApi } = useQlikApp(qlikAppId)

    const reactionCount = reactions.length

    const onRestoreBookmark = async (bookmarkId: string) => {
        qEnigmaApi?.applyBookmark(bookmarkId)
    }

    const { classes } = useStyles()

    const reactionControls =
        reactionCount === 1 ? (
            <>
                <Can userDomainId={appUserId} /* userDomainId={qsUserId} */>
                    <RemoveBookmarkIcon
                        onRemoveBookmark={event => {
                            onRemoveReaction({
                                bookmarkId: reactions[0]?.qlikState?.qsBookmarkId,
                                reactionId: reactions[0].id
                            })
                        }}
                    />
                </Can>
                {!isForComments && (
                    <RestoreBookmarkIcon
                        isMatchingSelection={
                            reactions[0].qlikState.qsSelectionHash ===
                            qSelectionMap?.get(qlikAppId)?.qSelectionHash
                        }
                        onClick={() => onRestoreBookmark(reactions[0].qlikState.qsBookmarkId)}
                    />
                )}
            </>
        ) : (
            <Box display="flex" flexDirection="row" alignItems="center">
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    className={classes.reactionCount}>
                    {reactionCount}
                </Box>
                <IconTooltip title="translate_toggle_list">
                    <IconButton edge="end" size="small" onClick={toggleCollapsed}>
                        <ExpandMoreIcon
                            fontSize="small"
                            style={{ color: theme.palette.text.primary }}
                        />
                    </IconButton>
                </IconTooltip>
            </Box>
        )

    return (
        <Box display="flex" flexDirection="column" marginTop="10px">
            <Box display="flex" alignItems="center">
                <Box display="flex" flexGrow="1" alignItems="center">
                    <Typography className={classes.text}>{userFullName}</Typography>
                </Box>
                <Box display="flex" alignItems="center" marginRight="8px">
                    {reactionControls}
                </Box>
            </Box>
            {reactions.length !== 1 && (
                <Collapse
                    in={isCollapsed}
                    style={{
                        margin: 0,
                        flexGrow: isCollapsed ? 1 : 0.00000000001
                    }}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        style={{
                            backgroundColor: theme.palette.background.paper
                        }}
                        margin={0}>
                        {reactions.map(reaction => {
                            const isMatchingSelection =
                                qSelectionMap?.get(qlikAppId)?.qSelectionHash ===
                                reaction.qlikState?.qsSelectionHash

                            return (
                                <Box display="flex" alignItems="center" key={reaction.id} p={1}>
                                    <Box display="flex" alignItems="center" flexGrow="1">
                                        <Typography className={classes.textSmall}>
                                            {dayjs(reaction.createdAt).fromNow()}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" marginRight="8px">
                                        <Can userDomainId={appUserId}>
                                            <RemoveBookmarkIcon
                                                onRemoveBookmark={() => {
                                                    onRemoveReaction({
                                                        bookmarkId:
                                                            reaction?.qlikState?.qsBookmarkId,
                                                        reactionId: reaction.id
                                                    })
                                                }}
                                            />
                                        </Can>
                                        <RestoreBookmarkIcon
                                            isMatchingSelection={isMatchingSelection}
                                            onClick={() =>
                                                onRestoreBookmark(reaction.qlikState.qsBookmarkId)
                                            }
                                        />
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                </Collapse>
            )}
        </Box>
    )
}

export default React.memo(ReactionSummaryListItem)

const useStyles = makeStyles()((theme: Theme) => ({
    reactionCount: {
        width: 22,
        height: 22,
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.text.primary,
        fontSize: '12px',
        borderRadius: '20px',
        marginLeft: '8px'
    },
    text: {
        fontSize: '0.75rem',
        color: theme.palette.text.primary
    },
    textSmall: {
        fontSize: '0.7rem',
        color: theme.palette.text.primary
    }
}))
