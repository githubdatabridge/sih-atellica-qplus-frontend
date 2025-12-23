import React, { FC } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Box, Typography, Input, IconButton, InputBase, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

interface QlikDatasetFormProps {
    setTitleCallback(value: string): void
    setDescriptionCallback(value: string): void
    setLabelCallback(value: string): void
    setTagsCallback(value: any[]): void
    newDatasetTitle?: string
    newDatasetDescription?: string
    newDatasetLabel?: string
    newDatasetTags?: any[]
}

const QlikDatasetForm: FC<QlikDatasetFormProps> = ({
    setTitleCallback,
    setDescriptionCallback,
    setLabelCallback,
    setTagsCallback,
    newDatasetTitle,
    newDatasetDescription,
    newDatasetLabel,
    newDatasetTags
}) => {
    const { classes } = useStyles()

    const [title, setTitle] = React.useState<string>(newDatasetTitle)
    const [description, setDescription] = React.useState<string>(newDatasetDescription)
    const [label, setLabel] = React.useState<string>(newDatasetLabel)
    const [tag, setTag] = React.useState<string>('')
    const [savedTags, setSavedTags] = React.useState<any>(newDatasetTags)

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter' || event.key === ' ') {
            if (!tag) {
                return
            }
            const newTags = [...savedTags]
            newTags.push(tag)
            setSavedTags(newTags)
            setTagsCallback(newTags)
            setTag('')
        }
    }

    const removeSavedTag = (tag: string) => {
        const newTags = savedTags.filter(t => t !== tag)
        setSavedTags(newTags)
        setTagsCallback(newTags)
    }

    const handleOnDataChange = (setValue: any, value: string, setCallback: any) => {
        setValue(value)
        setCallback(value)
    }

    const renderTextInputField = (
        placeholder: string,
        areaLabel: string,
        setValue: any,
        value: string,
        setCallback: any
    ) => {
        return (
            <Box className={classes.textInputWrapper}>
                <Box flexGrow={1}>
                    {' '}
                    <InputBase
                        className={classes.input}
                        placeholder={placeholder}
                        inputProps={{ 'aria-label': areaLabel }}
                        onChange={e => handleOnDataChange(setValue, e.target.value, setCallback)}
                        value={value}
                    />
                    {value ? (
                        <IconButton
                            aria-label="search"
                            onClick={() => handleOnDataChange(setValue, '', setCallback)}
                            className={classes.clearButton}>
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </Box>
            </Box>
        )
    }

    return (
        <Box className={classes.mainContainer}>
            <Box className={classes.textInputField}>
                {renderTextInputField('Title', 'title', setTitle, title, setTitleCallback)}
            </Box>
            <Box className={classes.descriptionWrapper}>
                <Input
                    type="textarea"
                    className={classes.descriptionTextarea}
                    placeholder={'Description'}
                    onChange={e =>
                        handleOnDataChange(setDescription, e.target.value, setDescriptionCallback)
                    }
                    minRows={3}
                    multiline={true}
                    value={description}
                />
                {description ? (
                    <IconButton
                        aria-label="search"
                        onClick={() =>
                            handleOnDataChange(setDescription, '', setDescriptionCallback)
                        }
                        className={classes.clearButton}>
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </Box>
            <Box className={classes.labelTextInputField}>
                {renderTextInputField('Label', 'label', setLabel, label, setLabelCallback)}
            </Box>
            <Box className={classes.descriptionWrapper}>
                <Input
                    type="textarea"
                    className={classes.descriptionTextarea}
                    style={{ minHeight: '0px' }}
                    placeholder={'Tags'}
                    onKeyPress={handleKeyPress}
                    onChange={e =>
                        e.target.value !== '\n' && e.target.value !== ' '
                            ? setTag(e.target.value)
                            : null
                    }
                    minRows={1}
                    multiline={true}
                    value={tag}
                />
                {tag ? (
                    <IconButton
                        aria-label="search"
                        onClick={() => setTag('')}
                        className={classes.clearButton}>
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </Box>
            <Box className={classes.saveTagsContainer}>
                {savedTags.map((item: any, index: any) => {
                    return (
                        <Box key={index} className={classes.tagContainer}>
                            <Typography className={classes.tagText}>{item}</Typography>
                            <IconButton
                                aria-label="search"
                                onClick={() => removeSavedTag(item)}
                                className={classes.removeTagButton}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

export default QlikDatasetForm

const useStyles = makeStyles()((theme: Theme) => ({
    mainContainer: {
        flexGrow: 1,
        flexDirection: 'column',
        display: 'flex',
        width: '100%',
        padding: '20px'
    },
    textInputField: {
        width: '45%',
        marginBottom: '20px',
        fontSize: '0.825rem'
    },
    descriptionWrapper: {
        width: '100%'
    },
    descriptionTextarea: {
        minHeight: '150px',
        padding: '8px',
        paddingRight: '30px',
        alignItems: 'baseline',
        background: theme.palette.background.default,
        width: '100%',
        fontSize: '0.825rem'
    },
    labelTextInputField: {
        width: '45%',
        marginBottom: '20px',
        marginTop: '20px',
        fontSize: '0.825rem'
    },
    clearButton: {
        paddingRight: '0px',
        paddingTop: '0px',
        paddingBottom: '0px',
        marginLeft: '-40px',
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.primary.main
        }
    },
    input: {
        paddingRight: '30px',
        minWidth: '350px',
        background: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        paddingLeft: theme.spacing(1),
        fontSize: '0.825rem'
    },
    removeTagButton: {
        color: theme.palette.info.contrastText,
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.info.contrastText
        }
    },
    tagContainer: {
        paddingLeft: '25px',
        borderRadius: '25px',
        marginRight: '10px',
        marginTop: '15px',
        height: '30px',
        backgroundColor: theme.palette.info.main,
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tagText: {
        fontSize: '0.825rem',
        color: theme.palette.info.contrastText
    },
    saveTagsContainer: {
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    textInputWrapper: {
        display: 'flex',
        width: '100%'
    }
}))
