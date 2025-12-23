import React, { FC, useState, useEffect, useCallback } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import { Theme, lighten } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'

import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { makeStyles } from 'tss-react/mui'

import { IAutoCompleteData } from './types'

type TBaseAutoCompleteClasses = {
    root: any
    inputRoot: any
    label: any
    input: any
    listbox: any
    groupLabel: any
    option?: any
    noOptions?: any
    listItem?: any
    searchIcon?: any
    loading?: any
}

interface IBaseAutoCompleteProps {
    isLoadingData?: boolean
    // defaultValue?: IAutoCompleteData
    defaultValue?: any
    label?: string
    placeHolder?: string
    options?: IAutoCompleteData[]
    variant?: string
    disabled?: boolean
    inlineLabel?: boolean
    width?: number
    size?: string
    classNames?: Partial<TBaseAutoCompleteClasses>
    reInitializeInMilliseconds?: number
    icon?: React.ReactNode
    withIcon?: boolean
    handleChangeCallback?: (value: any) => void
}

const BaseAutoComplete: FC<IBaseAutoCompleteProps> = ({
    isLoadingData = false,
    defaultValue,
    label = '',
    placeHolder = '',
    options = [],
    variant = 'standard',
    size = 'medium',
    disabled = false,
    inlineLabel = true,
    withIcon = true,
    width = 300,
    icon = null,
    classNames,
    reInitializeInMilliseconds = 0,
    handleChangeCallback
}) => {
    const [data, setData] = useState<IAutoCompleteData[]>([])

    useEffect(() => {
        if (options && options.length > 0) setData(options)
    }, [options])

    const handleChange = useCallback((e, value, reason, details) => {
        if (handleChangeCallback) handleChangeCallback(value)
    }, [])

    const { classes } = useStyles()

    const renderAutoComplete = useCallback(() => {
        return (
            <Autocomplete
                key={reInitializeInMilliseconds}
                defaultValue={defaultValue}
                id="grouped-demo"
                aria-placeholder={placeHolder}
                value={defaultValue}
                options={data.sort((a, b) => -b?.entry?.value?.localeCompare(a?.entry?.value))}
                groupBy={option => option?.title}
                getOptionLabel={option => option?.entry?.value}
                onChange={(event, value, reason, details) =>
                    handleChange(event, value, reason, details)
                }
                sx={{ width: width }}
                loading={isLoadingData}
                classes={{
                    root: `${classes.root} ${classNames?.root}`,
                    inputRoot: `${classes.inputRoot} ${classNames?.inputRoot}`,
                    input: `${classes.input}  ${classNames?.input}`,
                    listbox: `${classes.listbox} ${classNames?.listbox}`,
                    groupLabel: `${classes.groupLabel} ${classNames?.groupLabel}`,
                    noOptions: `${classes.noOptions} ${classNames?.noOptions}`,
                    option: `${classes.option} ${classNames?.option}`,
                    loading: `${classes.loading} ${classNames?.loading}`,
                    inputFocused: `${classes.inputRoot} ${classNames?.inputRoot}`
                }}
                renderOption={(props, option, { inputValue }) => {
                    if (option) {
                        const matches = match(option?.entry?.value, inputValue)
                        const parts = parse(option?.entry?.value, matches)
                        const isGroupedBy = !!option?.title

                        return (
                            <li
                                {...props}
                                className={`${classNames?.listItem} ${
                                    isGroupedBy ? classes.listItemGrouped : classes.listItem
                                }`}>
                                <div
                                    style={{
                                        display: withIcon ? 'flex' : undefined,
                                        alignItems: withIcon ? 'center' : undefined
                                    }}>
                                    {withIcon && (
                                        <span>
                                            {icon ? (
                                                icon
                                            ) : option?.icon ? (
                                                option.icon
                                            ) : (
                                                <SearchIcon
                                                    className={`${classes.searchIcon}  ${classNames?.searchIcon} `}
                                                />
                                            )}
                                        </span>
                                    )}

                                    {parts.map((part, index) => (
                                        <span key={index}>
                                            <span
                                                style={{
                                                    fontWeight: part.highlight ? 700 : 400
                                                }}>
                                                {part.text}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </li>
                        )
                    }
                }}
                size={size === 'small' ? 'small' : 'medium'}
                disabled={disabled}
                renderInput={params => (
                    <TextField
                        {...params}
                        placeholder={placeHolder}
                        label={inlineLabel ? label : ''}
                        hiddenLabel={!inlineLabel}
                        InputLabelProps={{
                            sx: { fontSize: '0.925rem' }
                        }}
                        classes={{
                            root: `${classes.inputRoot} ${classNames?.inputRoot}`
                        }}
                        variant={
                            variant === 'filled'
                                ? 'filled'
                                : variant === 'outlined'
                                ? 'outlined'
                                : 'standard'
                        }
                    />
                )}
            />
        )
    }, [
        classNames?.groupLabel,
        classNames?.input,
        classNames?.inputRoot,
        classNames?.listItem,
        classNames?.listbox,
        classNames?.loading,
        classNames?.noOptions,
        classNames?.option,
        classNames?.root,
        classNames?.searchIcon,
        classes.groupLabel,
        classes.input,
        classes.inputRoot,
        classes.listItem,
        classes.listItemGrouped,
        classes.listbox,
        classes.loading,
        classes.noOptions,
        classes.option,
        classes.root,
        classes.searchIcon,
        data,
        defaultValue,
        disabled,
        handleChange,
        icon,
        inlineLabel,
        isLoadingData,
        label,
        placeHolder,
        reInitializeInMilliseconds,
        size,
        variant,
        width,
        withIcon
    ])

    return (
        <Box>
            {!inlineLabel ? (
                <FormControlLabel
                    label={label}
                    labelPlacement="start"
                    classes={{
                        label: `${classes.label}  ${classNames?.label} `
                    }}
                    control={renderAutoComplete()}
                />
            ) : (
                renderAutoComplete()
            )}
        </Box>
    )
}

export default BaseAutoComplete

const useStyles = makeStyles()((theme: Theme) => ({
    root: {},
    inputRoot: {
        height: '25px'
    },
    label: {
        fontSize: '0.9rem',
        paddingRight: '16px'
    },
    input: {
        fontSize: '0.825rem',
        marginTop: '-5px'
    },
    listbox: {
        fontSize: '0.825rem',
        padding: 0
    },
    groupLabel: {
        fontSize: '0.825rem'
    },
    option: {},
    noOptions: {
        fontSize: '0.825rem'
    },
    listItem: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: 2,
        cursor: 'pointer'
    },
    listItemGrouped: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        paddingBottom: 4,
        paddingLeft: 20,
        cursor: 'pointer'
    },
    loading: {
        fontSize: '0.825rem'
    },
    searchIcon: {
        width: '24px',
        height: '24px',
        color: lighten(theme.palette.text.primary, 0.4),
        paddingLeft: '4px',
        marginTop: '8px',
        marginRight: '8px'
    }
}))
