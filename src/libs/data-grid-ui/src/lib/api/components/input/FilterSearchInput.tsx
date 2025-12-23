import React, { FC, useState } from 'react'

import FilterListIcon from '@mui/icons-material/FilterList'
import {
    Box,
    Button,
    ClickAwayListener,
    IconButton,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Theme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import { OPERATORS_MAP } from '../../constants/constants'
import translations from '../../constants/translations'
import { IDataGridCellSearchProps } from '../../types'

const FilterSearchInput: FC<IDataGridCellSearchProps> = ({
    column,
    align,
    setFilter,
    isActiveFilter,
    removeFilterHelper
}) => {
    const [filterSearch, setFilterSearch] = useState<string>('')
    const [filterOperator, setFilterOperator] = useState('eq')
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(prevState => !prevState)
    const { t } = useI18n()

    const { classes } = useStyles()

    return (
        <ClickAwayListener onClickAway={() => setShow(false)}>
            <Box sx={{ position: 'relative', display: 'inline' }}>
                <IconButton
                    style={{ opacity: show || isActiveFilter ? 1 : 0.6 }}
                    color={show || isActiveFilter ? 'secondary' : 'default'}
                    size="small"
                    component="label"
                    onClick={handleClick}>
                    <FilterListIcon />
                </IconButton>
                {show ? (
                    <Box className={classes.filterBox} sx={{ left: align }}>
                        <Select
                            value={filterOperator}
                            className={classes.root}
                            MenuProps={{ disablePortal: true }}
                            input={
                                <OutlinedInput
                                    classes={{
                                        root: classes.rootOutlineInput,
                                        focused: classes.focusedOutlineInput,
                                        notchedOutline: classes.notchedOutlineInput
                                    }}
                                    onChange={e => setFilterOperator(e.target.value)}
                                />
                            }>
                            {column?.filterOperator?.map((op, i) => (
                                <MenuItem
                                    key={`${op}+${i}`}
                                    value={op}
                                    classes={{
                                        selected: classes.menuItem,
                                        root: classes.menuItem
                                    }}>
                                    <ListItemText
                                        primary={<em>{OPERATORS_MAP(op)}</em>}
                                        disableTypography
                                        classes={{ root: classes.listItem }}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                        <OutlinedInput
                            className={classes.root}
                            classes={{
                                input: classes.input,
                                notchedOutline: classes.customInputLabel
                            }}
                            notched={false}
                            value={filterSearch}
                            placeholder="Filter"
                            id="value"
                            onChange={e => setFilterSearch(e.target.value)}
                        />
                        <Button
                            className={classes.buttonReset}
                            onClick={() => {
                                setFilterSearch('')
                                removeFilterHelper(column.accessor)
                            }}>
                            {t(translations.DataGridFilterSearchResetButton)}
                        </Button>
                        <Button
                            className={classes.buttonApply}
                            onClick={() => {
                                removeFilterHelper(column.accessor)
                                setFilter(column.accessor, filterOperator, filterSearch)
                            }}>
                            {t(translations.DataGridFilterSearchApplyButton)}
                        </Button>
                    </Box>
                ) : null}
            </Box>
        </ClickAwayListener>
    )
}

export default FilterSearchInput

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        height: '34px',
    },
    input: {
        fontSize: '0.825rem'
    },
    text: {
        fontSize: '0.825rem'
    },
    menuItem: {},
    listItem: {
        fontSize: '0.85rem',
        color: theme.palette.text.primary
    },
    customInputLabel: {
        '& legend': {
            visibility: 'visible'
        }
    },
    filterBox: {
        padding: theme.spacing(1),
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: `0px 2px 16px 0px ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: '4px',
        position: 'absolute',
        right: 0,
        zIndex: 1,
        width: '28rem',
        background: theme.palette.background.paper
    },
    buttonApply: {
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.825rem',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: 'none'
        }
    },
    buttonReset: {
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.825rem',
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.dark,
        textTransform: 'none',
        border: `1px solid ${theme.palette.primary.dark}`,
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText,
            color: theme.palette.primary.dark,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.primary.contrastText,
            color: theme.palette.primary.dark,
            boxShadow: 'none'
        }
    },
    rootOutlineInput: {
        '& $notchedOutline': {
            borderWidth: 0
        },
        '&:hover $notchedOutline': {
            borderWidth: 0
        },
        '&$focused $notchedOutline': {
            borderWidth: 0
        }
    },
    focusedOutlineInput: {},
    notchedOutlineInput: {}
}))
