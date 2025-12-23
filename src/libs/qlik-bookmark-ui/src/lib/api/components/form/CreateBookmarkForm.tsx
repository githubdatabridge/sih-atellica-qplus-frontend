import React, { FC, useState } from 'react'

import { useLocation } from 'react-router-dom'
import { useAsyncFn } from 'react-use'

import {
    Button,
    CircularProgress,
    Box,
    TextField,
    FormControlLabel,
    Theme,
    useTheme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { BaseSwitch } from '@libs/common-ui'
import { BookmarkItem } from '@libs/core-models'
import { useQlikBookmarkContext } from '@libs/qlik-providers'
import { useQlikAppContext } from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import translations from '../../constants/translations'
import { TQlikApiBookmarkOptions } from '../../QlikApiBookmarkCreateDialog'

type TQlikCreateBookmarkClasses = {
    buttonSave: string
    buttonCancel: string
    buttonProgress: string
}

export interface IQlikCreateBookmarkFormProps {
    color?: 'secondary' | 'primary' | 'info' | 'error' | 'success' | 'warning'
    defaultOptions?: TQlikApiBookmarkOptions
    showLayoutToggle?: boolean
    showPublicToggle?: boolean
    showPageToggle?: boolean
    classNames?: Partial<TQlikCreateBookmarkClasses>
    onCallbackSubmit(r: any): void
}

const CreateBookmarkForm: FC<IQlikCreateBookmarkFormProps> = React.memo(
    ({
        color,
        defaultOptions,
        showPublicToggle = true,
        showPageToggle = true,
        showLayoutToggle = true,
        classNames,
        onCallbackSubmit
    }) => {
        const [name, setName] = useState<string>('')
        const [description, setDescription] = useState<string>('')
        const [togglePrivate, setTogglePrivate] = useState<boolean>(defaultOptions.isPrivate)
        const [togglePage, setTogglePage] = useState<boolean>(defaultOptions.withPageNavigation)
        const [toggleLayout, setToggleLayout] = useState<boolean>(defaultOptions.withLayout)
        const { qAppMap } = useQlikAppContext()
        const { qSelectionMap } = useQlikSelectionContext()
        const { setAnimation, createBookmark } = useQlikBookmarkContext()
        const { t } = useI18n()
        const location = useLocation()

        const { classes } = useStyles()

        const useInputStyles = makeStyles()((theme: any) => ({
            inputRoot: {
                color: theme.palette.primary.dark
            },
            underline: {
                color: '#e0e0e0',
                '&&&:before': {
                    borderBottom: '1px solid #e0e0e0'
                },
                '&&:after': {
                    border: `1px solid ${
                        color === 'secondary'
                            ? theme.palette.secondary.main
                            : color === 'primary'
                            ? theme.palette.primary.main
                            : theme.palette.info.main
                    }`
                }
            },
            cssOutlinedInput: {
                '&$cssFocused $notchedOutline': {
                    borderColor: `${
                        color === 'secondary'
                            ? theme.palette.secondary.main
                            : color === 'primary'
                            ? theme.palette.primary.main
                            : theme.palette.info.main
                    } !important`
                }
            },
            cssFocused: {},
            notchedOutline: {
                borderWidth: '1px',
                borderColor: '#e0e0e0 !important'
            }
        }))

        const [bookmarkState, submitBookmark] = useAsyncFn(async () => {
            const bookmarkItems: BookmarkItem[] = []
            if (!name) return
            for (const [key, value] of qAppMap) {
                const selection = qSelectionMap.get(key)
                if (selection) {
                    if (togglePrivate) {
                        const bookmark = await value?.qApi?.$apiBookmark.create(name, '')
                        if (bookmark?.id) {
                            bookmarkItems.push({
                                qlikAppId: key,
                                qlikState: {
                                    qsBookmarkId: bookmark.id,
                                    qsSelectionHash: selection?.qSelectionHash || 0,
                                    meta: toggleLayout ? {} : undefined
                                }
                            })
                        }
                    } else {
                        bookmarkItems.push({
                            qlikAppId: key,
                            qlikState: {
                                qsSelectionHash: selection?.qSelectionHash || 0,
                                selections: selection?.qSelectedFields,
                                meta: toggleLayout ? {} : undefined
                            }
                        })
                    }
                }
            }
            const r = await createBookmark(
                {
                    name,
                    path: togglePage ? location.pathname : '/',
                    meta: {
                        search: togglePage ? location.search || '' : ''
                    },
                    bookmarkItems: bookmarkItems
                },
                toggleLayout
            )
            setAnimation(true)
            onClear()
            onCallbackSubmit(r)
            return name
        }, [name, description, togglePrivate, togglePage, toggleLayout, qAppMap, qSelectionMap])

        const clearError = !name

        const onClear = () => {
            setName('')
            setDescription('')
        }

        const { classes: classesInput } = useInputStyles()
        const theme = useTheme()

        return (
            <Box p={4}>
                <Box className={classes.nameFieldBox}>
                    <Box mb={4} mt={2}>
                        <TextField
                            className={classes.nameField}
                            sx={{
                                '& .MuiInputBase-root': { height: '45px' }
                            }}
                            value={name}
                            label={t(translations.name)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            color="primary"
                            InputProps={{
                                classes: {
                                    root: classesInput.inputRoot,
                                    underline: classesInput.underline,
                                    input: classes.inputTextColor
                                }
                            }}
                            onChange={e => {
                                setName(e.target.value)
                            }}
                        />
                    </Box>
                    <Box>
                        <TextField
                            label={t(translations.description)}
                            multiline
                            InputLabelProps={{
                                className: classes.label
                            }}
                            InputProps={{
                                sx: {
                                    fontSize: '0.875rem' // Font size for the input text
                                }
                            }}
                            rows={4}
                            defaultValue={description}
                            variant="outlined"
                            color={color}
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                            sx={{ marginBottom: '16px', width: '100%' }}
                        />
                    </Box>
                    {showPublicToggle && (
                        <Box>
                            <FormControlLabel
                                control={
                                    <BaseSwitch
                                        defaultChecked={true}
                                        color={color}
                                        checked={togglePrivate}
                                        name="Private"
                                        onClick={() => setTogglePrivate(!togglePrivate)}
                                    />
                                }
                                label={t(translations.private)}
                            />
                        </Box>
                    )}
                    {showLayoutToggle && (
                        <Box>
                            <FormControlLabel
                                control={
                                    <BaseSwitch
                                        defaultChecked={false}
                                        color={color}
                                        checked={toggleLayout}
                                        name="Layout"
                                        onClick={() => setToggleLayout(!toggleLayout)}
                                    />
                                }
                                label={t(translations.layout)}
                            />
                        </Box>
                    )}
                    {showPageToggle && (
                        <Box>
                            <FormControlLabel
                                control={
                                    <BaseSwitch
                                        defaultChecked={false}
                                        color={color}
                                        checked={togglePage}
                                        name="Page"
                                        onClick={() => setTogglePage(!togglePage)}
                                    />
                                }
                                label={t(translations.page)}
                            />
                        </Box>
                    )}
                </Box>
                <Box mb={1} mt={7} display="flex" justifyContent="flex-end">
                    <Button
                        onClick={onClear}
                        disabled={clearError}
                        className={`${classes.buttonCancel} ${classNames?.buttonCancel}`}>
                        {t(translations.btnClearLabel)}
                    </Button>
                    <Button
                        onClick={submitBookmark}
                        className={`${classes.buttonSave} ${classNames?.buttonSave}`}
                        disabled={clearError}
                        style={
                            clearError
                                ? { backgroundColor: theme.palette.text.disabled }
                                : undefined
                        }>
                        {bookmarkState.loading ? (
                            <CircularProgress
                                className={`${classes.buttonProgress} ${classNames?.buttonProgress}`}
                                size={20}
                            />
                        ) : (
                            t(translations.btnSaveLabel)
                        )}
                    </Button>
                </Box>
            </Box>
        )
    }
)

export default CreateBookmarkForm

const useStyles = makeStyles()((theme: Theme) => ({
    buttonCancel: {
        paddingRight: '20px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        width: '120px',
        '&:hover': {
            backgroundColor: `${theme.palette.background.paper} !important`,
            color: `${theme.palette.text.primary} !important`,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: `${theme.palette.background.paper} !important`,
            color: `${theme.palette.text.primary} !important`,
            boxShadow: 'none'
        }
    },
    buttonSave: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        width: '120px',
        '&:hover': {
            backgroundColor: `${theme.palette.secondary.main} !important`,
            color: `${theme.palette.secondary.contrastText} !important`,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: `${theme.palette.secondary.main} !important`,
            color: `${theme.palette.secondary.contrastText} !important`,
            boxShadow: 'none'
        }
    },
    buttonProgress: {
        color: theme.palette.secondary.contrastText
    },
    inputRoot: {
        color: theme.palette.primary.dark,
        width: '100%'
    },
    underline: {
        color: '#e0e0e0',
        '&&&:before': {
            borderBottom: '1px solid #e0e0e0'
        },
        '&&:after': {
            border: `1px solid ${theme.palette.info.main}`
        }
    },
    inputTextColor: {
        fontSize: '0.875rem',
        color: theme.palette.text.primary
    },
    nameFieldBox: {
        minWidth: '100%',
        '@media (max-width: 470px)': {
            minWidth: '100%'
        }
    },
    nameField: {
        width: '350px',
        '@media (max-width: 470px)': {
            width: '100%'
        }
    },
    label: {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary
    }
}))
