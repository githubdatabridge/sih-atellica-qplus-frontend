import React, { FC, ChangeEvent, useEffect, useState } from 'react'

import { Box, TextField, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import translation from '../../constants/translations'

interface QlikPinWallFormProps {
    defaultTitle?: string
    defaultDescription?: string
    onSetTitleCallback: (title: string) => void
    onSetDescriptionCallback: (description: string) => void
}

const QlikPinWallForm: FC<QlikPinWallFormProps> = ({
    defaultTitle = '',
    defaultDescription = '',
    onSetTitleCallback,
    onSetDescriptionCallback
}) => {
    const [title, setTitle] = useState(defaultTitle)
    const [description, setDescription] = useState(defaultDescription)
    const { t } = useI18n()

    const { classes } = useStyles()

    useEffect(() => {
        setTitle(defaultTitle)
    }, [defaultTitle])

    useEffect(() => {
        setDescription(defaultDescription)
    }, [defaultDescription])

    const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
        onSetTitleCallback(event.target.value)
    }

    const onDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
        onSetDescriptionCallback(event.target.value)
    }

    return (
        <>
            <Box display="flex" alignItems="center" mb={2} mt={2}>
                <Box flexGrow={2}>
                    <TextField
                        variant="standard"
                        value={title}
                        label={t(translation.pinwallTitle)}
                        InputLabelProps={{
                            className: classes.textFieldRoot
                        }}
                        color="secondary"
                        onChange={onNameChange}
                        fullWidth
                        InputProps={{
                            classes: {
                                root: classes.cssOutlinedInputTitle
                            }
                        }}
                    />
                </Box>
            </Box>
            <Typography className={classes.descTitle}>
                {t(translation.pinwallDescription)}
            </Typography>
            <TextField
                multiline
                InputProps={{
                    classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        notchedOutline: classes.notchedOutline
                    }
                }}
                rows={4}
                variant="outlined"
                value={description}
                onChange={onDescriptionChange}
                color="secondary"
                sx={{ marginBottom: '16px', fontSize: '0.825rem' }}
            />
        </>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    cssOutlinedInput: {
        fontSize: '0.825rem !important',
        color: theme.palette.text.primary,
        '&$cssFocused $notchedOutline': {
            borderColor: `${theme.palette.secondary.main} !important`
        }
    },
    cssFocused: {},
    notchedOutline: {
        borderWidth: '1px',
        borderColor: '#e0e0e0 !important'
    },

    cssOutlinedInputTitle: {
        fontSize: '0.825rem',
        color: theme.palette.text.primary,
        '&$cssFocusedTitle $notchedOutlineTitle': {
            borderBottomColor: `${theme.palette.divider} !important`
        }
    },
    cssFocusedTitle: {},
    descTitle: {
        color: theme.palette.text.primary,
        paddingBottom: '5px',
        fontSize: '0.825rem'
    },
    textFieldRoot: {
        fontSize: '0.825rem'
    }
}))

export default QlikPinWallForm
