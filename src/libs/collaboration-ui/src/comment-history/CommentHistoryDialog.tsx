import React, { useState } from 'react'

import { useAsyncFn, useDebounce, useLocation } from 'react-use'

import SearchIcon from '@mui/icons-material/Search'
import { Box, DialogContent, IconButton, InputAdornment, TextField, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { commentService } from '@libs/collaboration-services'
import { Comment } from '@libs/common-models'
import { useI18n } from '@libs/common-providers'
import { DraggableDialog } from '@libs/common-ui'

import CommentHistoryList from './CommentHistoryList'
import CommentHistorySearchList from './CommentHistorySearchList'

const CommentHistoryDialog = () => {
    const { classes } = useStyles()
    const { pathname: pageId } = useLocation()
    const { t } = useI18n()
    const [searchText, setSearchText] = useState('')
    const [searchComments, setSearchComments] = useState<Comment[]>([])

    const [searchCommentsState, loadSearchComments] = useAsyncFn(async () => {
        setSearchComments([])
        if (!searchText) return []

        const { comments } = await commentService.getAllComments({
            'filter[content][like]': searchText,
            perPage: 50
        })

        setSearchComments(comments)

        return comments
    }, [searchText])

    const handleOnSearch = (searchQuery: string) => {
        setSearchText(searchQuery)
    }

    const [isReady] = useDebounce(loadSearchComments, 1500, [searchText])

    return (
        <DraggableDialog
            hideBackdrop={false}
            closeTooltipText={t('qplus-dialog-close')}
            pageId={pageId}
            title="Comment history"
            rightAlign>
            <DialogContent style={{ padding: 0 }}>
                <Box p={3}>
                    <TextField
                        placeholder="Search"
                        id="comment-history-search"
                        variant="outlined"
                        fullWidth
                        value={searchText}
                        className={classes.search}
                        onChange={event => handleOnSearch(event.target.value)}
                        InputProps={{
                            classes: {
                                input: classes.searchInput
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility" edge="end">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Box display="flex" flexDirection="column" mt={2} minHeight="600px">
                        {searchText ? (
                            <CommentHistorySearchList
                                comments={searchComments}
                                loading={searchCommentsState.loading}
                            />
                        ) : (
                            <CommentHistoryList />
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </DraggableDialog>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    search: {
        backgroundColor: theme.palette.background.default
    },
    searchInput: {
        padding: '14px 10px',
        height: '10px',
        borderColor: 'white'
    }
}))

export default CommentHistoryDialog
