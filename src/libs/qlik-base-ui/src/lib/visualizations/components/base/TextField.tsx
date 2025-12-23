import React, { FC, useState } from 'react'

import { useMount } from 'react-use'

import { TextField, Box, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useQlikVisualizationContext } from '../../QlikVisualizationContext'
import { strToObject, setObjectProperty, findByKey, mergeDeep } from '../../utils/functions'

interface VisualizationTextFieldProps {
    label: string
    identifier: string
    path: string
    delimiter?: string
    placeHolder: string
    color?: string
}

const VisualizationTextField: FC<VisualizationTextFieldProps> = ({
    label,
    color,
    path,
    delimiter = '.',
    identifier,
    placeHolder
}) => {
    const [object, setObject] = useState<any>(null)
    const [value, setValue] = useState<string>('')
    const { visualizationObject, visualizationOptions, setVisualizationOptions } =
        useQlikVisualizationContext()

    const useInputStyles = makeStyles()((theme: Theme) => ({
        inputRoot: {
            paddingLeft: '8px',
            backgroundColor: theme.palette.background.default,
            '&:hover': {
                backgroundColor: theme.palette.background.default
            },
            height: '3rem'
        },
        inputTextColor: {
            color: theme.palette.text.primary
        },
        underline: {
            '&&&:before': {
                borderBottom: `1px solid ${theme.palette.divider}`
            },
            '&&:after': {
                border: `1px solid ${theme.palette.text.primary}`
            }
        },
        cssFocused: {}
    }))

    useMount(async () => {
        const strPath = path
        const obj = strToObject(strPath, delimiter)
        setObject(obj)
        const value = findByKey(visualizationOptions, path)
        setValue(value)
    })

    const handleChangeText = event => {
        const value = event.target.value
        setValue(value)
    }

    const handleOnBlurText = () => {
        const obj = { ...object }
        setObjectProperty(identifier, value, obj)
        setObject(obj)

        const qOptions = mergeDeep(visualizationOptions, obj)
        if (visualizationObject) (visualizationObject as any).setOptions(qOptions)
        setVisualizationOptions(qOptions || {})
    }

    const { classes: classesInput } = useInputStyles()
    return (
        <Box mb={2} mt={1}>
            <TextField
                variant="standard"
                value={value}
                label={label}
                color="primary"
                placeholder={placeHolder}
                style={{ width: '100%' }} //assign the width as your requirement
                InputProps={{
                    classes: {
                        root: classesInput.inputRoot,
                        underline: classesInput.underline,
                        input: classesInput.inputTextColor
                    }
                }}
                onChange={e => {
                    handleChangeText(e)
                }}
                onFocus={() => (value ? setValue(value) : setValue(''))}
                onBlur={handleOnBlurText}
            />{' '}
        </Box>
    )
}

export default VisualizationTextField
