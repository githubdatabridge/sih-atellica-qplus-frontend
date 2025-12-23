import React, { useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Theme } from '@mui/material'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import MUISelect from '@mui/material/Select'
import { alpha } from '@mui/material/styles'

import { makeStyles, withStyles } from 'tss-react/mui'

type TBaseSelectClasses = {
    select: string
    menuItem: string
    icon?: string
}

export interface IBaseSelectProps {
    startValue: string
    name: string
    items: any[]
    dense?: boolean
    onChangeCallback: (target: any) => void
    classNames?: TBaseSelectClasses
}

const BaseSelect = ({
    startValue,
    name,
    items,
    dense = false,
    onChangeCallback,
    classNames
}: IBaseSelectProps) => {
    const { classes } = useStyles(dense)
    const [selectedValue, setSelectedValue] = useState(startValue)

    const handleChange = (event: any) => {
        setSelectedValue(event.target.value as string)
        onChangeCallback(event.target)
    }

    return (
        <MUISelect
            name={name}
            labelId="customized-select-label"
            id="customized-select"
            value={selectedValue}
            onChange={handleChange}
            input={<BootstrapInput dense={dense} />}
            IconComponent={ExpandMoreIcon}
            classes={{
                select: `${classes.select} ${classNames?.select}`,
                icon: `${classes.icon} ${classNames?.icon}`
            }}>
            {items.map((item, index) => (
                <MenuItem
                    key={`select-menu-${index}`}
                    value={item.value}
                    role="button"
                    classes={{
                        root: `${classes.menuItem} ${classNames?.menuItem}`
                    }}>
                    {item.title}
                </MenuItem>
            ))}
        </MUISelect>
    )
}

const useStyles: any = makeStyles<any, any>()((theme: Theme) => ({
    icon: {
        color: theme.palette.primary.main,
        right: '0.4px',
        top: 'calc(50% - 12px)'
    },
    select: {},
    menuItem: {
        backgroundColor: theme.palette.background.paper,
        borderBottom: (props: any) => `1px solid rgba(247, 247, 247, ${props.dense ? 0.2 : 0.2})`,
        fontSize: (props: any) => (props.dense ? 10 : 12),
        fontWeight: 400,
        color: (props: any) => `${alpha(theme.palette.text.secondary, props.dense ? 0.5 : 0.5)}`,
        lineHeight: (props: any) => (props.dense ? '10px' : '12px'),
        padding: (props: any) => (props.dense ? '5px 20px 5px 7px' : '10px 32px 5px 12px'),
        transition: theme.transitions.create(['border-color', 'box-shadow'])
    }
}))

const BootstrapInput = withStyles<any, any, any>(InputBase, (theme: Theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3)
        }
    },
    input: {
        borderRadius: '8px',
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.secondary.dark, 0.6)}`,
        fontSize: (props: any) => (props.dense ? 12 : 16),
        fontWeight: 400,
        color: (props: any) => `${alpha(theme.palette.text.secondary, props.dense ? 1 : 1)}`,
        lineHeight: (props: any) => (props.dense ? '14px' : '16px'),
        padding: (props: any) => (props.dense ? '5px 20px 5px 7px' : '10px 32px 8px 12px'),
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderRadius: '8px'
        },
        '@media (max-width: 1100px)': {
            fontSize: '11px !important'
        }
    }
}))

export default React.memo(BaseSelect)
