import { ChangeEvent } from 'react'

import { useMediaQuery } from 'react-responsive'

import Close from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputBase, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

export interface IBaseSearchProps {
    value: string
    onChange: (value: string) => void
    onCancelSearch: () => void
    disabled?: boolean
    minWidth?: string
    maxWidth?: string
    width?: string
    height?: string
    className?: any
    placeholder?: string
}

const BaseSearch = ({
    value,
    onChange,
    onCancelSearch,
    width,
    minWidth,
    maxWidth,
    height,
    disabled = false,
    className,
    placeholder
}: IBaseSearchProps) => {
    const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        onChange(e.target.value)
    }
    const isTablet = useMediaQuery({ query: '(max-width: 992px)' })
    const style = {
        width: width ? width : '100%',
        minWidth: minWidth ? minWidth : '100%',
        maxWidth: maxWidth ? maxWidth : '100%',
        pr: isTablet ? 0 : '20px',
        pl: '10px',
        height: height ? height : 40,
        '& div': {
            height: height ? height : 40
        }
    }

    const { classes } = useStyles()

    return (
        <InputBase
            style={style}
            classes={{
                input: classes.input
            }}
            inputProps={{ 'aria-label': 'search' }}
            onChange={onChangeHandler}
            disabled={disabled}
            className={className}
            value={value}
            placeholder={placeholder || 'Search'}
            endAdornment={
                value ? (
                    <IconButton size="large">
                        <Close onClick={onCancelSearch} />
                    </IconButton>
                ) : (
                    <IconButton size="large">
                        <SearchIcon />
                    </IconButton>
                )
            }
        />
    )
}

export default BaseSearch

const useStyles = makeStyles()((theme: Theme) => ({
    input: {
        paddingLeft: '10px'
    }
}))
