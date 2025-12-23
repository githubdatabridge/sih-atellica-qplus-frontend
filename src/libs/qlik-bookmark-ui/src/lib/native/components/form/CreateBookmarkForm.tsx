import React, { FC, useState, useEffect } from 'react'

import { useAsyncFn } from 'react-use'

import { Button, CircularProgress, Box, TextField, Theme, useTheme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { useAlertContext, AlertType } from '@libs/common-ui'
import { useQlikCreateBookmark } from '@libs/qlik-capability-hooks'

import translations from '../../constants/translations'

type TQlikCreateBookmarkClasses = {
    buttonSave: string
    buttonCancel: string
    buttonProgress: string
}

export interface IQlikCreateBookmarkFormProps {
    qlikAppId: string
    color?: 'secondary' | 'primary' | 'info' | 'error' | 'success' | 'warning'
    classNames: Partial<TQlikCreateBookmarkClasses>
    onCallbackSubmit(r: any): void
}

const CreateBookmarkForm: FC<IQlikCreateBookmarkFormProps> = React.memo(
    ({ qlikAppId, color, classNames, onCallbackSubmit }) => {
        const [qAppId, setQAppId] = useState<string>('')
        const [name, setName] = useState<string>('')
        const [description, setDescription] = useState<string>('')
        const { setCreateBookmark } = useQlikCreateBookmark()
        const { showToast } = useAlertContext()
        const { t } = useI18n()

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
            try {
                if (!name) return
                const r = await setCreateBookmark(name, description, qAppId)
                showToast(t(translations.submitSuccessMsg), AlertType.SUCCESS)
                onClear()
                onCallbackSubmit(r)
            } catch {
                showToast(t(translations.createErrorMsg), AlertType.ERROR)
            }
        }, [name, description])

        useEffect(() => {
            setQAppId(qlikAppId)
        }, [qlikAppId])

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
                            color={color}
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
                            value={description}
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
                            defaultValue=""
                            variant="outlined"
                            color={color}
                            onChange={e => {
                                setDescription(e.target.value)
                            }}
                            sx={{ marginBottom: '16px', width: '100%' }}
                        />
                    </Box>
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
    },
    input: {
        fontSize: '0.875rem',
        color: theme.palette.common.white
    }
}))
