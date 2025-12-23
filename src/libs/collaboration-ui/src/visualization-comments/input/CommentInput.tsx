import React, { forwardRef, ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import { Box, Button, CircularProgress, Theme, useTheme } from '@mui/material'

import './editor.css'

interface CommentInputProps {
    comment?: Comment
    isEditing?: boolean
    isDisabled?: boolean
    parentComment?: Comment
    parentId?: number | null
    isInput?: boolean
    toggleEditing?: any
    placeholder?: string
    onAddComment?: (comment: Comment) => void
    onAddReply?: (comment: Comment) => void
    children?: ReactNode
}

const CommentInput = forwardRef<Editor, CommentInputProps>(
    (
        {
            toggleEditing,
            isEditing = false,
            isDisabled = false,
            parentId = null,
            parentComment,
            isInput,
            children,
            comment,
            onAddComment = () => undefined,
            onAddReply = () => undefined,
            ...props
        },
        forwardRef
    ) => {
        const [isLoading, setIsLoading] = useState(false)
        const [open, setOpen] = useState(false)
        const onOpenChange = useCallback((_open: boolean) => {
            setOpen(_open)
        }, [])
        const [previousEditorState, setPreviousEditorState] = useState<any>(null)

        const { notify } = useSyncNotificationContext()
        const { showToast } = useAlertContext()
        const { scope, qlikAppId, visualizationId, reportId } = useQlikBaseSocialContext()
        const { t } = useI18n()
        const { userMentionSuggestions } = useQlikSocialContext()
        const { qAppMap } = useQlikAppContext()
        const { qSelectionMap } = useQlikSelectionContext()
        const { cssDialogActionButton, cssDialogCancelButton } = useBaseUiContext()

        const isEditable = !isDisabled && !isLoading

        // Needed if there are multiple editors on one page
        const initialState = () => {
            const emojiPlugin = createEmojiPlugin({
                selectButtonContent: <SentimentSatisfiedAltIcon />
            })
            const mentionPlugin = createMentionPlugin({})

            const plugins: any = [emojiPlugin, mentionPlugin]

            return {
                plugins,
                MentionSuggestions: mentionPlugin.MentionSuggestions,
                EmojiSuggestions: emojiPlugin.EmojiSuggestions,
                EmojiSelect: emojiPlugin.EmojiSelect
            }
        }

        const [{ plugins, MentionSuggestions, EmojiSuggestions, EmojiSelect }] =
            useState(initialState)

        const editorRef = useRef<any>(forwardRef || null)
        const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

        const { classes } = useStyles()

        useEffect(() => {
            if (!comment) {
                return
            }
            let commentJSON: any = ''

            try {
                commentJSON = JSON.parse(comment.content)
            } catch {
                commentJSON = comment.content
            }

            setEditorState(prev =>
                EditorState.push(
                    prev,
                    EditorState.createWithContent(convertFromRaw(commentJSON)).getCurrentContent(),
                    'change-block-data'
                )
            )
        }, [comment])

        const savePreviousState = () => {
            if (isEditing) {
                setPreviousEditorState(editorState)
            }
        }

        const cancelEditing = () => {
            toggleEditing()
            setEditorState(prev =>
                EditorState.push(prev, previousEditorState.getCurrentContent(), 'change-block-data')
            )
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        useEffect(savePreviousState, [isEditing])

        const [suggestions, setSuggestions] = useState([])

        const onSearchChange = ({ value }: any) => {
            setSuggestions(defaultSuggestionsFilter(value, userMentionSuggestions))
        }

        const keyBindingFn = (e: any) => {
            if (e.key === 'Enter') {
                return 'submit'
            }
            if (e.key === 'Escape' && isEditing) {
                return 'stop-edit'
            }
            return getDefaultKeyBinding(e)
        }

        const handleKeyCommand = (command: string) => {
            if (command === 'submit') {
                handleSubmit()
            }
            if (command === 'stop-edit') {
                cancelEditing()
            }
            return 'not-handled' as any
        }

        const handleSubmit = async () => {
            try {
                setIsLoading(true)

                const editorContent = editorState.getCurrentContent()
                const contentJson = JSON.stringify(convertToRaw(editorContent))

                if (isEditing) {
                    await commentService.editComment({
                        comment: { content: contentJson },
                        commentId: Number(comment?.id)
                    })
                    toggleEditing()
                    return
                }

                const payload = {
                    commentId: parentId || null,
                    scope,
                    content: contentJson,
                    visualizationId: +visualizationId || undefined,
                    reportId: +reportId || undefined
                }

                const newComment = await commentService.addComment(payload)
                setIsLoading(false)

                if (parentComment) {
                    onAddReply(newComment)
                }

                setEditorState(EditorState.createEmpty())

                let bookmarkId = null

                const qApp = qAppMap.get(qlikAppId)
                const qSelection = qSelectionMap.get(qlikAppId)

                if (!comment && !parentId && qSelection?.qSelectionCount > 0) {
                    const bookmark = {
                        name: 'Comment',
                        class: 'Comment',
                        type: scope
                    }

                    bookmarkId = await qApp?.qEnigmaApi?.$createBookmark(bookmark)

                    if (bookmarkId) {
                        const qlikState = {
                            qsBookmarkId: bookmarkId,
                            qsSelectionHash: qSelection?.qSelectionCount || 0
                        }

                        const updatedComment = await commentService.editComment({
                            commentId: newComment.id,
                            comment: { qlikState }
                        })

                        onAddComment(updatedComment)
                    } else {
                        onAddComment(newComment)
                    }
                } else {
                    onAddComment(newComment)
                }

                notify(SyncType.COMMENTS_ALL)
            } catch (error) {
                showToast(
                    isEditing
                        ? t(translation.collaborationUpdateErrorMsg)
                        : t(translation.collaborationInsertErrorMsg),
                    AlertType.ERROR
                )
            } finally {
                setIsLoading(false)
            }
        }

        const theme = useTheme()

        const submitButtonContent = isLoading ? (
            <CircularProgress sx={{ color: theme.palette.secondary.contrastText }} size={24} />
        ) : isEditing ? (
            t(translation.collaborationEditComment)
        ) : parentId ? (
            t(translation.collaborationAddReply)
        ) : (
            t(translation.collaborationAddComment)
        )

        if (!isEditing && !isInput)
            return (
                <Box display="flex" alignItems="start" flexDirection="row" flexGrow="1">
                    <Box display="flex" width="0" maxWidth="initial" flexWrap="wrap" flexGrow={1}>
                        <Editor
                            ref={editor => (editorRef.current = editor)}
                            editorState={editorState}
                            onChange={editorState => setEditorState(editorState)}
                            plugins={plugins}
                            stripPastedStyles
                            spellCheck
                            keyBindingFn={keyBindingFn}
                            handleKeyCommand={handleKeyCommand}
                            readOnly={isDisabled || isLoading}
                            {...props}
                        />
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                        alignSelf="flex-start"
                        flexGrow={0}>
                        {isLoading && <CircularProgress color="secondary" size={16} />}
                        {isEditable && (
                            <>
                                <MentionSuggestions
                                    open={open}
                                    onOpenChange={onOpenChange}
                                    onSearchChange={onSearchChange}
                                    suggestions={suggestions}
                                />
                                <div className="demo-1">
                                    <EmojiSelect key="emoji-1" />
                                </div>
                                <EmojiSuggestions />
                            </>
                        )}
                    </Box>
                </Box>
            )

        return (
            <Box display="flex" flexDirection="column" flexGrow={1}>
                <Box
                    display="flex"
                    alignItems="start"
                    flexDirection="row"
                    p={2}
                    borderRadius="8px"
                    minHeight="80px"
                    flexGrow={1}
                    style={{
                        border: 'solid 0.5px #d9d9d9'
                    }}>
                    <Box display="flex" alignItems="start" flexDirection="row" flexGrow="1">
                        <Box display="flex" width="100%" maxWidth="initial" flexWrap="wrap">
                            <Editor
                                ref={editor => (editorRef.current = editor)}
                                editorState={editorState}
                                onChange={editorState => setEditorState(editorState)}
                                plugins={plugins}
                                stripPastedStyles
                                spellCheck
                                keyBindingFn={keyBindingFn}
                                handleKeyCommand={handleKeyCommand}
                                readOnly={isDisabled || isLoading}
                                {...props}
                            />
                        </Box>
                        <Box
                            flexGrow="1"
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            alignSelf="flex-start">
                            {isEditable && (
                                <>
                                    <MentionSuggestions
                                        open={open}
                                        onOpenChange={onOpenChange}
                                        onSearchChange={onSearchChange}
                                        suggestions={suggestions}
                                    />
                                    <div className="emoji-button-wrapper">
                                        <EmojiSelect key="emoji-2" />
                                    </div>
                                    <EmojiSuggestions />
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    {isEditing && (
                        <Button
                            onClick={cancelEditing}
                            disabled={isLoading}
                            className={classes.buttonCancel}
                            style={{ ...cssDialogCancelButton }}>
                            Cancel
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={handleSubmit}
                        color="secondary"
                        disabled={isLoading}
                        className={classes.buttonSubmit}
                        style={{ ...cssDialogActionButton }}>
                        {submitButtonContent}
                    </Button>
                </Box>
            </Box>
        )
    }
)

export default CommentInput

const useStyles = makeStyles()((theme: Theme) => ({
    buttonSubmit: {
        fontSize: '0.75rem',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        '&:hover': {
            //you want this to be the same as the backgroundColor above
            backgroundColor: `${theme.palette.secondary.main} !important`,
            color: `${theme.palette.secondary.contrastText} !important`
        },
        minWidth: '75px'
    },
    buttonCancel: {
        fontSize: '0.75rem',
        //you want this to be the same as the backgroundColor above
        backgroundColor: `${theme.palette.background.default} !important`,
        color: `${theme.palette.text.primary} !important`,
        '&:hover': {
            //you want this to be the same as the backgroundColor above
            backgroundColor: `${theme.palette.background.default} !important`,
            color: `${theme.palette.text.primary} !important`
        },
        minWidth: '75px',
        marginRight: 8
    }
}))

import Editor from '@draft-js-plugins/editor'
import createEmojiPlugin from '@draft-js-plugins/emoji'
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention'
import { convertFromRaw, convertToRaw, EditorState, getDefaultKeyBinding } from 'draft-js'
import { makeStyles } from 'tss-react/mui'

import {
    SyncType,
    useQlikBaseSocialContext,
    useQlikSocialContext,
    useSyncNotificationContext
} from '@libs/collaboration-providers'
import { commentService } from '@libs/collaboration-services'
import { Comment } from '@libs/common-models'
import { useBaseUiContext, useI18n } from '@libs/common-providers'
import { AlertType, useAlertContext } from '@libs/common-ui'
import { useQlikAppContext, useQlikSelectionContext } from '@libs/qlik-providers'

import '@draft-js-plugins/emoji/lib/plugin.css'
import '@draft-js-plugins/mention/lib/plugin.css'
import translation from '../../constants/translation'
