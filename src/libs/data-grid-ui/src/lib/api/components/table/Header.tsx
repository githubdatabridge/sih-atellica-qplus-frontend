import React, { FC } from 'react'

import {
    Box,
    Checkbox,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
    useTheme,
    Theme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useDataGridHelper } from '../../hooks/useDataGridHelper'
import SvgSortIcon from '../../icons/SvgSortIcon'
import FilterSearchInput from '../input/FilterSearchInput'

interface IHeaderProps {
    isCellWithBorder?: boolean
    borderColor?: string
    classNames?: any
    isBulkDeleteAction?: boolean
    filterValue?: string
    hasActions?: boolean
    columns: any[]
    numberOfRows: number
    numberOfSelectedRowsPerPage: number
    orderByColumn: string
    orderByOperator: string
    setFilterState: any
    removeFilterState: any
    handleTableHeaderSelectAllClickCallback: (e: any) => void
    handleSortClickCallback: (accessor: string) => void
}

const Header: FC<IHeaderProps> = ({
    filterValue = '',
    columns,
    numberOfRows,
    numberOfSelectedRowsPerPage,
    orderByColumn,
    orderByOperator,
    isCellWithBorder = false,
    isBulkDeleteAction = true,
    hasActions = true,
    borderColor,
    classNames,
    setFilterState,
    removeFilterState,
    handleTableHeaderSelectAllClickCallback,
    handleSortClickCallback
}) => {
    const { classes } = useStyles()
    const theme = useTheme()
    const { isActiveFilter, sortDirection } = useDataGridHelper()
    const currColumns = columns
        .map((col, index) => col?.visible && col?.filterOperator && index)
        ?.filter(Boolean)

    const handleFilterAlign = index => {
        if (currColumns?.length === 2) {
            if (currColumns.indexOf(index) < 1) {
                return 0
            }
            return -400
        }
        if (currColumns.indexOf(index) === 0) {
            return 0
        }
        if (currColumns.indexOf(index) === currColumns?.length - 1) {
            return -400
        }
        return -200
    }

    return (
        <TableHead className={classes.tableHead}>
            <TableRow className={classes.tableRow}>
                {isBulkDeleteAction && (
                    <TableCell
                        key="bulk"
                        classes={{
                            root: classes.tableCellHeader
                        }}
                        className={classNames?.tableCellHeader}
                        component="th"
                        scope="row"
                        style={{
                            overflow: 'visible',
                            borderWidth: !isCellWithBorder ? '0px' : undefined,
                            borderColor: borderColor || undefined,
                            width: '5%'
                        }}>
                        <Checkbox
                            color="primary"
                            indeterminate={
                                numberOfSelectedRowsPerPage > 0 &&
                                numberOfSelectedRowsPerPage < numberOfRows
                            }
                            checked={
                                numberOfRows > 0 && numberOfSelectedRowsPerPage === numberOfRows
                            }
                            classes={{
                                root:
                                    numberOfSelectedRowsPerPage > 0 &&
                                    numberOfSelectedRowsPerPage <= numberOfRows
                                        ? `${classes.tableCheckboxChecked} ${classNames?.tableCheckboxChecked}`
                                        : `${classes.tableCheckboxUnchecked} ${classNames?.tableCheckboxUnchecked}`
                            }}
                            onChange={e => handleTableHeaderSelectAllClickCallback(e)}
                            inputProps={{
                                'aria-label': 'select all rows'
                            }}
                        />
                    </TableCell>
                )}
                {columns.map((column, index) =>
                    column.visible ? (
                        <TableCell
                            key={column.accessor}
                            classes={{
                                root: classes.tableCellHeader
                            }}
                            className={classNames?.tableCellHeader}
                            component="th"
                            style={{
                                overflow: 'visible',
                                borderWidth: !isCellWithBorder ? '0px' : undefined,
                                borderColor: borderColor || undefined,
                                width: column?.width || undefined
                            }}
                            scope="row">
                            <Box display="flex" alignItems="center">
                                <Box flexGrow={1}>
                                    <Typography className={classes.tableCellHeaderText}>
                                        {column?.label}
                                    </Typography>
                                </Box>
                                <Box>
                                    {!!column?.filterOperator && (
                                        <FilterSearchInput
                                            align={handleFilterAlign(index)}
                                            column={column}
                                            isActiveFilter={isActiveFilter(
                                                filterValue,
                                                `[${[column.accessor]}]`
                                            )}
                                            setFilter={setFilterState}
                                            removeFilterHelper={removeFilterState}
                                        />
                                    )}
                                </Box>
                                <Box>
                                    {column?.sortable && (
                                        <TableSortLabel
                                            active={orderByColumn === column.accessor}
                                            /* @ts-ignore */
                                            direction={sortDirection(
                                                column.accessor,
                                                orderByColumn,
                                                orderByOperator
                                            )}
                                            IconComponent={() =>
                                                orderByColumn === column.accessor ? (
                                                    <SvgSortIcon
                                                        colorDown={
                                                            orderByOperator === 'desc'
                                                                ? theme.palette.secondary.main
                                                                : theme.palette.text.disabled
                                                        }
                                                        colorUp={
                                                            orderByOperator === 'asc'
                                                                ? theme.palette.secondary.main
                                                                : theme.palette.text.disabled
                                                        }
                                                    />
                                                ) : (
                                                    <SvgSortIcon
                                                        colorDown={theme.palette.text.disabled}
                                                        colorUp={theme.palette.text.disabled}
                                                    />
                                                )
                                            }
                                            onClick={() =>
                                                column?.accessor
                                                    ? handleSortClickCallback(column.accessor)
                                                    : undefined
                                            }></TableSortLabel>
                                    )}
                                </Box>
                            </Box>
                        </TableCell>
                    ) : null
                )}
                {hasActions && (
                    <TableCell
                        key="action"
                        classes={{
                            root: classes.tableCellHeader
                        }}
                        className={classNames?.tableCellHeader}
                        component="th"
                        scope="row"
                        style={{
                            overflow: 'visible',
                            borderWidth: !isCellWithBorder ? '0px' : undefined,
                            borderColor: borderColor || undefined,
                            width: '5%'
                        }}
                    />
                )}
            </TableRow>
        </TableHead>
    )
}

export default Header

const useStyles = makeStyles()((theme: Theme) => ({
    tableHead: {
        '@media (max-width: 992px)': {
            display: 'none'
        }
    },
    tableRow: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    tableCellHeader: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        padding: '8px 0px 0px 15px',
        height: '51px',
        border: `1px solid ${theme.palette.divider}`,
        '@media (max-width: 600px)': {
            padding: '0px'
        }
    },
    tableCellHeaderText: {
        opacity: 0.5,
        fontSize: '0.825rem'
    },
    cell: {
        color: theme.palette.text.primary,
        fontSize: '0.825rem',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'visible',
        '@media (max-width: 992px)': {
            borderBottom: 'none',
            height: '38px'
        }
    },
    cellAction: {
        textAlign: 'right',
        '@media (max-width: 992px)': {
            height: '38px',
            borderBottom: 'none'
        }
    },
    tableCheckboxUnchecked: {
        color: theme.palette.primary.main,
        opacity: 0.2,
        paddingLeft: '16px'
    },
    tableCheckboxChecked: {
        paddingLeft: '16px',
        color: theme.palette.primary.main
    }
}))
