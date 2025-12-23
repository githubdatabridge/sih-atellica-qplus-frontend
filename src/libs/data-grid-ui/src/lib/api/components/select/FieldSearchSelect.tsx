import * as React from 'react'
import { FC, useCallback, useRef, useState } from 'react'

import { useMediaQuery } from 'react-responsive'

import {
    Box,
    Checkbox,
    Chip,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Typography,
    Theme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import translations from '../../constants/translations'
import { IDataGridSearchFields } from '../../types'

const FieldSearchSelect: FC<IDataGridSearchFields> = ({
    identifiers,
    columns,
    classNames,
    setItems
}) => {
    const { classes } = useStyles()
    const [data, setData] = useState<string[]>(identifiers)
    const MAX_INPUT_CHIPS = 3
    const dataHandler = (value: string | string[]) =>
        typeof value === 'string' ? value.split(',') : value
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const { t } = useI18n()

    const handleChange = (event: SelectChangeEvent<typeof data>) => {
        const {
            target: { value }
        } = event
        setData(dataHandler(value))
        setItems(dataHandler(value))
    }

    const renderValues = useCallback(
        (strValues: string[]) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {strValues.length > 0 ? (
                    isTabletOrMobile ? (
                        <Chip
                            key={-1}
                            label={`Selected ${strValues.length}`}
                            classes={{ root: classes.chipRoot }}
                        />
                    ) : (
                        strValues
                            .slice(0, MAX_INPUT_CHIPS)
                            .map((value, index) => (
                                <Chip
                                    key={value}
                                    label={
                                        index === MAX_INPUT_CHIPS
                                            ? `+ ${strValues.length - MAX_INPUT_CHIPS}`
                                            : columns[value]
                                    }
                                    classes={{ root: classes.chipRoot }}
                                />
                            ))
                    )
                ) : (
                    <Typography className={classes.text}>Choose Fields</Typography>
                )}
            </Box>
        ),
        [isTabletOrMobile]
    )

    return (
        <Box>
            <FormControl
                sx={{ width: !isTabletOrMobile ? '350px' : 'auto' }}
                classes={classNames?.searchSelect}>
                <InputLabel id="demo-multiple-checkbox-label" className={classes.inputLabel}>
                    {t(translations.DataGridSearchSelectPlaceholder)}
                </InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    size="small"
                    value={data}
                    onChange={e => handleChange(e)}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={selected => renderValues(selected)}
                    className={classes.select}
                    variant="standard"
                    displayEmpty>
                    {identifiers?.map(identifier => (
                        <MenuItem
                            key={identifier}
                            value={identifier}
                            classes={{
                                selected: classes.menuItemSelected,
                                root: classes.menuItem
                            }}>
                            <Checkbox
                                size="small"
                                checked={data?.indexOf(identifier) > -1}
                                color="secondary"
                            />
                            <ListItemText
                                primary={columns[identifier]}
                                disableTypography
                                classes={{ root: classes.listItem }}
                            />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}

export default FieldSearchSelect

const useStyles = makeStyles()((theme: Theme) => ({
    formControl: {
        width: '100%',
        backgroundColor: theme.palette.background.default,
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        height: '60px',
        marginRight: '64px',
        marginBottom: '4px'
    },
    inputLabel: {
        transform: 'translate(14px, 18px) scale(1)',
        border: '0px solid',
        textAlign: 'left',
        height: '30px',
        marginTop: '-30px',
        marginLeft: '-5px',
        fontSize: '0.825rem',
        opacity: 0.6,
        color: theme.palette.text.primary
    },
    text: {
        fontSize: '0.825rem',
        color: theme.palette.text.disabled
    },
    select: {
        height: '40px',
        textAlign: 'left',
        fontSize: '0.875rem',
        paddingLeft: '10px',
        background: theme.palette.background.paper
    },
    menuItem: {
        height: '35px'
    },
    menuItemSelected: {
        background: `${theme.palette.background.paper} !important`,
        opacity: 1
    },
    listItem: {
        height: '35px',
        marginTop: '18px !important',
        fontSize: '0.85rem',
        color: theme.palette.text.primary
    },
    chipRoot: {
        height: '30px'
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
