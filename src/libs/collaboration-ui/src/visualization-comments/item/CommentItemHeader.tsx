import React, { useMemo } from 'react'

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'
import FilterListIcon from '@mui/icons-material/FilterList'
import { Theme } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

import { Comment } from '@libs/common-models'
import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import Can from '../../Can'
import translation from '../../constants/translation'
import R from '../../res/R'

interface Props {
    comment: Comment
    isMatchingSelection: boolean
    onRemoveComment: () => void
    onRestoreBookmark: () => void
    toggleEditing: () => void
}

const CommentItemHeader: React.FC<Props> = ({
    comment,
    isMatchingSelection,
    onRemoveComment,
    onRestoreBookmark,
    toggleEditing
}) => {
    const { t } = useI18n()
    const { classes } = useStyles()
    const restoreBookmarkIconStyle = useMemo(
        () => (isMatchingSelection ? { fill: R.colors.socialGreen } : {}),
        [isMatchingSelection]
    )
    return (
        <Box display="flex" mb={1}>
            <Box display="flex" flexDirection="column">
                <Typography className={classes.text}>
                    <span className={classes.name}>{comment.user.fullName}</span>
                </Typography>
                <Typography color="textSecondary" variant="body2" className={classes.textTime}>
                    {comment.createdDate}
                </Typography>
            </Box>
            <Box display="flex" alignItems="flex-start" justifyContent="flex-end" flexGrow="1">
                <Can userDomainId={comment.appUserId}>
                    <IconTooltip title={t(translation.collaborationEditComment)}>
                        <IconButton size="small" onClick={toggleEditing}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </IconTooltip>
                    <IconTooltip title={t(translation.collaborationDeleteComment)}>
                        <IconButton size="small" onClick={onRemoveComment}>
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </IconTooltip>
                </Can>
                {!comment?.commentId && comment?.qlikState?.qsBookmarkId ? (
                    <IconTooltip title={t(translation.collaborationRestoreComment)}>
                        <IconButton size="small" onClick={onRestoreBookmark}>
                            <FilterListIcon fontSize="small" style={restoreBookmarkIconStyle} />
                        </IconButton>
                    </IconTooltip>
                ) : null}
            </Box>
        </Box>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    name: {
        color: theme.palette.text.primary,
        fontWeight: 600
    },
    text: {
        fontSize: '0.9rem'
    },
    textTime: {
        color: theme.palette.text.primary,
        fontWeight: 600,
        fontSize: 10,
        opacity: 0.6
    }
}))

export default React.memo(CommentItemHeader)
