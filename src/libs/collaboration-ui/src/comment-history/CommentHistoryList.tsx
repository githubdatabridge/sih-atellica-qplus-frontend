import { Box, Button, CircularProgress, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useCommentsState } from '@libs/collaboration-providers'
import { useI18n, usePaginationContext } from '@libs/common-providers'
import { MyFacebookLoader } from '@libs/common-ui'

import translation from '../constants/translation'
import CommentHistoryListItem from './CommentHistoryListItem'

const CommentHistoryList = () => {
    const { classes } = useStyles()
    const { comments, hasMore, loadingMore, loading } = useCommentsState()
    const { loadMore } = usePaginationContext()
    const { t } = useI18n()

    if (loading) return <MyFacebookLoader />

    if (comments.length === 0)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={2} minHeight="350px">
                {loading ? (
                    <MyFacebookLoader />
                ) : (
                    <Typography>{t(translation.collaborationEmptyComment)}</Typography>
                )}
            </Box>
        )

    return (
        <>
            {comments.map(c => (
                <CommentHistoryListItem key={c.id} comment={c} />
            ))}
            {hasMore && (
                <Button
                    onClick={loadMore}
                    disabled={loadingMore}
                    variant="contained"
                    className={classes.button}>
                    {loadingMore ? (
                        <CircularProgress color="secondary" size={24} />
                    ) : (
                        t(translation.collaborationListMore)
                    )}
                </Button>
            )}
        </>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    button: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main
        }
    }
}))

export default CommentHistoryList
