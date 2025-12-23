import React, { FC, useEffect, useCallback } from 'react'

import { Box, OutlinedInput, InputLabel, InputAdornment, FormControl, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import {
    useQlikSetStringVariable,
    useQlikSetNumVariable,
    useQlikGetVariableByName
} from '@libs/qlik-capability-hooks'
import { QVariable } from '@libs/qlik-models'
import { useQlikApp, useQlikBookmarkContext } from '@libs/qlik-providers'

export interface IQlikInputVariableProps {
    qlikAppId?: string
    variableOptions?: QVariable
}

const QlikInputVariable: FC<IQlikInputVariableProps> = React.memo(
    ({ qlikAppId, variableOptions }) => {
        const [value, setValue] = React.useState('')
        const { classes } = useStyles()
        const { classes: outlinedInputClasses } = useOutlinedInputStyles()
        const { qAppId } = useQlikApp(qlikAppId)
        const { getVariableByName } = useQlikGetVariableByName()
        const { setStringVariable } = useQlikSetStringVariable()
        const { setNumVariable } = useQlikSetNumVariable()
        const { subscribe, qBookmarkRefreshVariable } = useQlikBookmarkContext()

        const resetVariableContentHelper = useCallback(async () => {
            const v = await getVariableByName(variableOptions.variableName)
            if (v?.layout?.qNum && !isNaN(v?.layout?.qNum)) {
                setValue(v?.layout?.qNum)
            } else {
                setValue(v?.layout?.qText)
            }
        }, [getVariableByName, variableOptions.variableName])

        useEffect(() => {
            if (variableOptions?.defaultValue) {
                setValue(variableOptions?.defaultValue)
                if (!variableOptions.isNum) {
                    setStringVariable(
                        variableOptions.variableName,
                        variableOptions?.defaultValue,
                        qAppId
                    )
                } else {
                    setNumVariable(
                        variableOptions.variableName,
                        parseInt(variableOptions?.defaultValue),
                        qAppId
                    )
                }
                if (variableOptions?.includeInBookmark) {
                    if (subscribe) subscribe(qAppId, variableOptions.variableName)
                }
            }
        }, [
            qAppId,
            setNumVariable,
            setStringVariable,
            subscribe,
            variableOptions?.defaultValue,
            variableOptions?.includeInBookmark,
            variableOptions.isNum,
            variableOptions.variableName
        ])

        useEffect(() => {
            if (qBookmarkRefreshVariable) {
                resetVariableContentHelper()
            }
        }, [qBookmarkRefreshVariable, resetVariableContentHelper])

        const handleChange = async event => {
            if (event.target.value) {
                setValue(event.target.value)
                if (!variableOptions.isNum) {
                    await setStringVariable(
                        variableOptions.variableName,
                        event.target.value,
                        qAppId
                    )
                } else {
                    await setNumVariable(
                        variableOptions.variableName,
                        parseInt(event.target.value),
                        qAppId
                    )
                }
            }
        }

        return (
            <div className={classes.root}>
                <FormControl variant="outlined" className={classes.formControl}>
                    <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                        <Box flexGrow={1} width={'100%'} pr={1}>
                            <InputLabel htmlFor="outlined-adornment-amount">
                                {variableOptions?.placeHolder}
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                value={value}
                                onChange={e => handleChange(e)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        {variableOptions?.adornment}
                                    </InputAdornment>
                                }
                                classes={outlinedInputClasses}
                            />
                        </Box>
                    </Box>
                </FormControl>
            </div>
        )
    }
)

export default QlikInputVariable

const useStyles = makeStyles()((theme: Theme) => ({
    formControl: {
        width: '100%',
        backgroundColor: '#ececec',
        marginTop: '-1px',
        textAlignLast: 'end',
        alignItems: 'flex-end'
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        backgroundColor: 'transparent',
        width: '100%'
    }
}))

const useOutlinedInputStyles = makeStyles()((theme: Theme) => ({
    root: {
        '& $notchedOutline': {
            border: '0px'
        },
        '&:hover $notchedOutline': {
            border: '0px'
        },
        '&$focused $notchedOutline': {
            border: '0px'
        },
        '&:hover .MuiInputLabel-root': {
            color: theme.palette.secondary.main
        },
        '& .Mui-focused.MuiInputLabel-root': {
            color: theme.palette.secondary.main
        },
        height: '40px',
        width: '150px'
    },

    focused: {},
    notchedOutline: {}
}))
