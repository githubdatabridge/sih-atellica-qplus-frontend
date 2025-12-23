import React, { FC, useCallback, useEffect } from 'react'

import { useMount } from 'react-use'

import { ArrowDownward, ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import {
    Box,
    CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    lighten,
    MenuItem,
    Select,
    Theme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { AppInfoIcon } from '@libs/common-ui'
import {
    useQlikGetVariableByName,
    useQlikSetNumVariable,
    useQlikSetStringVariable
} from '@libs/qlik-capability-hooks'
import { QVariable } from '@libs/qlik-models'
import { useQlikApp, useQlikAppContext, useQlikBookmarkContext } from '@libs/qlik-providers'

import translations from './constants/translations'

const useStyles = makeStyles()((theme: Theme) => ({
    formControl: {
        width: '100%',
        backgroundColor: lighten(theme.palette.background.default, 0.1)
    },
    menuItem: {
        fontSize: '0.925rem'
    },
    select: {
        '&:focus': {
            backgroundColor: 'transparent'
        },
        fontSize: '0.85rem',
        paddingLeft: '16px',
        width: '100%'
    },
    root: {
        '&:focus': {
            backgroundColor: 'transparent'
        },
        fontSize: '0.875rem',
        paddingLeft: '16px',
        width: '100%'
    }
}))

export interface IQlikSelectVariableProps {
    qlikAppId?: string
    variableOptions?: QVariable
    showAppWaterMark?: boolean
    color?: 'primary' | 'secondary' | 'info' | 'inherit' | 'warning' | 'error' | 'success'
    handleValueChangeCallback?: (variableName: string, value: any) => void
}

const QlikSelectVariable: FC<IQlikSelectVariableProps> = React.memo(
    ({
        qlikAppId,
        variableOptions,
        color = 'secondary',
        showAppWaterMark = false,
        handleValueChangeCallback
    }) => {
        const [isLoading, setIsLoading] = React.useState<boolean>(false)
        const [open, setOpen] = React.useState<boolean>(false)
        const [value, setValue] = React.useState('')
        const { qAppId } = useQlikApp(qlikAppId)
        const { setStringVariable } = useQlikSetStringVariable()
        const { setNumVariable } = useQlikSetNumVariable()
        const { getVariableByName } = useQlikGetVariableByName()
        const { qAppMap } = useQlikAppContext()
        const { subscribe, qBookmarkRefreshVariable } = useQlikBookmarkContext()
        const { t } = useI18n()

        const { classes } = useStyles()

        const resetVariableContentHelper = useCallback(async () => {
            const v = await getVariableByName(variableOptions.variableName)
            if (v?.layout?.qNum && !isNaN(v?.layout?.qNum)) {
                setValue(v?.layout?.qNum)
            } else {
                setValue(v?.layout?.qText)
            }
        }, [getVariableByName, variableOptions.variableName])

        useMount(async () => {
            try {
                setIsLoading(true)
                if (variableOptions?.isTriggeredOnInit) {
                    if (!variableOptions.isNum) {
                        await setStringVariable(
                            variableOptions.variableName,
                            variableOptions?.defaultValue,
                            qAppId
                        )
                    } else {
                        await setNumVariable(
                            variableOptions.variableName,
                            parseInt(variableOptions?.defaultValue),
                            qAppId
                        )
                    }
                }
                if (variableOptions?.defaultValue) {
                    setValue(variableOptions?.defaultValue || t(translations.variableSelectLabel))
                }
                if (variableOptions?.includeInBookmark) {
                    if (subscribe) subscribe(qAppId, variableOptions.variableName)
                }
            } finally {
                setTimeout(() => setIsLoading(false), 500)
            }
        })

        useEffect(() => {
            if (qBookmarkRefreshVariable) {
                resetVariableContentHelper()
            }
        }, [qBookmarkRefreshVariable, resetVariableContentHelper])

        const handleChange = async event => {
            try {
                setIsLoading(true)
                if (!variableOptions.isNum) {
                    await setStringVariable(variableOptions.variableName, event.target.value)
                } else {
                    await setNumVariable(variableOptions.variableName, parseInt(event.target.value))
                }
                if (handleValueChangeCallback) {
                    handleValueChangeCallback(variableOptions.variableName, event.target.value)
                }
                setValue(event.target.value)
            } finally {
                setTimeout(() => setIsLoading(false), 1000)
            }
        }

        const handleIconClick = () => {
            setOpen(prevOpen => !prevOpen)
        }

        const handleClose = () => {
            setOpen(false)
        }

        const handleOpen = () => {
            setOpen(true)
        }

        const renderValue = () => {
            if (isLoading) {
                return (
                    <Box display="flex">
                        <CircularProgress color={color} size={24} />
                    </Box>
                )
            }
            return (
                variableOptions.values.find(v => v.key === value)?.value ||
                variableOptions?.defaultValue ||
                t(translations.variableSelectLabel) ||
                ''
            )
        }

        return (
            <FormControl
                className={`${classes.formControl} ${variableOptions?.classNames?.formControl}`}
                fullWidth
                style={{ ...variableOptions?.css }}>
                <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                    {showAppWaterMark && (
                        <Box ml={2} width="2%">
                            <AppInfoIcon
                                initials={qAppMap.get(qAppId)?.qMeta?.initials}
                                title={qAppMap.get(qAppId)?.qTitle}
                                text={qAppMap.get(qAppId)?.qDescription}
                                backgroundColor={qAppMap.get(qAppId)?.qMeta?.backgroundColor}
                                color={qAppMap.get(qAppId)?.qMeta?.color}
                                fontSize="0.8rem"
                                fontWeight={600}
                                width={14}
                                height={14}
                            />
                        </Box>
                    )}
                    <Box
                        flexGrow={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        width={showAppWaterMark ? '98%' : '100%'}>
                        <Select
                            variant="standard"
                            labelId="variable-select-label"
                            id="variable-select"
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            value={value}
                            renderValue={renderValue}
                            onChange={handleChange}
                            fullWidth
                            disableUnderline={true}
                            classes={{
                                select: `${classes.select} ${variableOptions?.classNames?.select}`,
                                root: `${classes.root} ${variableOptions?.classNames?.root}`
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleIconClick}>
                                        {open ? <ArrowDropUp /> : <ArrowDropDown />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            IconComponent={() => null} // Hide the default dropdown icon
                        >
                            {variableOptions.values.map((v, i) => (
                                <MenuItem
                                    key={i}
                                    value={v.key}
                                    className={`${classes.menuItem} ${variableOptions?.classNames?.menuItem}`}>
                                    {v.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>
            </FormControl>
        )
    }
)

export default QlikSelectVariable
