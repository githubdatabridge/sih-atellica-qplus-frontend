import React, { FC } from 'react'

import { useMediaQuery } from 'react-responsive'

import RefreshIcon from '@mui/icons-material/Refresh'
import { Box, IconButton, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { BaseSearch, IconTooltip } from '@libs/common-ui'

import { TColumnSearch, TTableClasses } from '../../types'
import FieldSearchSelect from '../select/FieldSearchSelect'

interface ISearch {
    searchTerm?: string
    identifiers: string[]
    columns: TColumnSearch
    classNames?: TTableClasses
    setItems: (record: any) => void
    handleSearchTextCallback: (value: string) => void
    handleOnHandleRefreshClickCallback?: () => void
}

export const Search: FC<ISearch> = ({
    searchTerm = '',
    columns,
    identifiers,
    classNames,
    setItems,
    handleSearchTextCallback,
    handleOnHandleRefreshClickCallback
}) => {
    const { classes } = useStyles()
    const isMobile = useMediaQuery({ query: '(max-width: 475px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            <Box flexGrow={1} display="flex">
                <Box className={classes.BaseSearchContainer}>
                    <BaseSearch
                        width={`${isTabletOrMobile ? '200px' : isMobile ? '100px' : '400px'}`}
                        value={searchTerm}
                        onChange={v => handleSearchTextCallback(v)}
                        onCancelSearch={() => handleSearchTextCallback('')}
                        className={`${classes.searchInput} ${classNames?.searchBox}`}
                    />
                </Box>
                <Typography
                    sx={{
                        padding: '0 16px',
                        display: 'flex',
                        fontSize: '0.825rem',
                        alignItems: 'center'
                    }}>
                    in
                </Typography>
                <FieldSearchSelect
                    identifiers={identifiers}
                    columns={columns}
                    setItems={setItems}
                    classNames={classNames}
                />
            </Box>
            <Box pl={1}>
                <IconTooltip title={`Refresh`}>
                    <IconButton
                        edge="end"
                        color="secondary"
                        onClick={handleOnHandleRefreshClickCallback}>
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                </IconTooltip>
            </Box>
        </Box>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    BaseSearchContainer: {
        backgroundColor: theme.palette.background.paper,
        width: '100%%',
        border: '1px solid #e4e7ea',
        borderRadius: 4,
        '@media (max-width: 992px)': {
            flexDirection: 'column',
            paddingBottom: '0px',
            borderBottom: '1px solid #e4e7ea'
        }
    },
    searchInput: {
        fontSize: '0.875rem'
    }
}))
