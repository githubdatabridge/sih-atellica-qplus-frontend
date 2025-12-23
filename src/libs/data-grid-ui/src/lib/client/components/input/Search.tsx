import React from 'react'

import { Cancel } from '@mui/icons-material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import SearchIcon from '@mui/icons-material/Search'
import {
    Autocomplete,
    Checkbox,
    InputAdornment,
    Stack,
    TextField,
    Chip,
    Theme,
    useTheme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { SearchOption, TSearchClasses } from '../../types'

type Props<T> = {
    options: SearchOption[]
    classNames?: TSearchClasses
    handleInputSearch: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => T
    handleSelectSearchFields: (
        event: React.SyntheticEvent<Element, Event>,
        value: SearchOption[]
    ) => void
}
const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText
    },
    deleteIcon: {
        color: theme.palette.secondary.contrastText
    }
}))

export function Search<T>({
    handleInputSearch,
    handleSelectSearchFields,
    options,
    classNames
}: Props<T>) {
    const theme = useTheme()
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
    const checkedIcon = (
        <CheckBoxIcon fontSize="small" style={{ color: theme.palette.secondary.main }} />
    )

    const { classes } = useStyles()
    return (
        <Stack
            direction="row"
            alignItems="center"
            padding="1rem 2rem"
            bgcolor={theme.palette.background.default}
            className={classNames?.search}
            spacing={1}>
            <TextField
                placeholder="Search..."
                sx={{ backgroundColor: theme.palette.common.white }}
                variant="outlined"
                size="small"
                onChange={handleInputSearch}
                InputProps={{
                    sx: {
                        fontSize: '0.825rem'
                    },
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    )
                }}
            />
            <p>in</p>

            <Autocomplete
                multiple
                limitTags={1}
                id="tags-standard"
                disableCloseOnSelect
                sx={{ width: 300, fontSize: '0.825rem' }}
                options={options}
                onChange={handleSelectSearchFields}
                getOptionLabel={option => option.label}
                ListboxProps={{
                    sx: {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        backgroundColor: 'inherit'
                    }
                }}
                renderOption={(props, option, { selected }) => (
                    <li {...props} style={{ fontSize: '0.825rem' }}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.label}
                    </li>
                )}
                renderInput={params => (
                    <TextField
                        {...params}
                        sx={{
                            backgroundColor: theme.palette.common.white,
                            position: 'relative'
                        }}
                        InputProps={{
                            ...params.InputProps,
                            sx: {
                                fontSize: '0.825rem'
                            }
                        }}
                        variant="outlined"
                        size="small"
                        placeholder="Fields"
                    />
                )}
                renderTags={(value: SearchOption[], getTagProps) =>
                    value.length > 1 ? (
                        <>
                            <Chip
                                variant="outlined"
                                label={value[0].label}
                                {...getTagProps({ index: 0 })}
                                color="secondary"
                                deleteIcon={
                                    <Cancel
                                        style={{ color: theme.palette.secondary.contrastText }}
                                    />
                                }
                                classes={{
                                    root: classes.root,
                                    deleteIcon: classes.deleteIcon
                                }}
                            />
                            <Chip
                                variant="outlined"
                                label={'+' + (value.length - 1)}
                                color="secondary"
                                deleteIcon={
                                    <Cancel
                                        style={{ color: theme.palette.secondary.contrastText }}
                                    />
                                }
                                classes={{
                                    root: classes.root,
                                    deleteIcon: classes.deleteIcon
                                }}
                            />
                        </>
                    ) : (
                        value.map((option: SearchOption, index: number) => (
                            <Chip
                                variant="outlined"
                                label={option.label}
                                deleteIcon={
                                    <Cancel
                                        style={{ color: theme.palette.secondary.contrastText }}
                                    />
                                }
                                {...getTagProps({ index })}
                                color="secondary"
                                classes={{
                                    root: classes.root,
                                    deleteIcon: classes.deleteIcon
                                }}
                            />
                        ))
                    )
                }
            />
        </Stack>
    )
}
