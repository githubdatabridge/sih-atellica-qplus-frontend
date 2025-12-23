import { useEffect, useMemo, useState } from 'react'

import { CircularProgress, Theme, Typography, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import { Search as TableSearch } from './components/input/Search'
import { Header as TableHeader } from './components/table/Header'
import translations from './constants/translations'
import { useTableStyles } from './hooks/useTableStyles'
import {
    getComparator,
    Order,
    Searchable,
    searchArray,
    stableSort
} from './services/dataGridClientService'
import { SearchOption, HeadCell, TDataGridClientClasses } from './types'

interface IDataGridClientTableProps<T extends Searchable> {
    rowsPerPageOptions?: number[]
    rowsPerPage?: number
    isDataLoading?: boolean
    data: T[]
    searchOptions: SearchOption[]
    columns: HeadCell<T>[]
    height?: number
    classNames?: Partial<TDataGridClientClasses>
    LoaderComponent?: JSX.Element
}

const DataGridClientTable = <T extends Searchable>({
    isDataLoading = false,
    data,
    searchOptions,
    columns,
    rowsPerPage = 5,
    rowsPerPageOptions = [5, 10, 25, 100],
    height,
    classNames,
    LoaderComponent
}: IDataGridClientTableProps<T>): JSX.Element => {
    const theme = useTheme()
    const { t } = useI18n()
    const { classes } = useStyles()

    // table styles
    const { classesTable } = useTableStyles()
    //table state
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [page, setPage] = useState(0)
    const [_rowsPerPage, setRowsPerPage] = useState(rowsPerPage)
    const [_rowsPerPageOptions, setRowsPerPageOptions] = useState(rowsPerPageOptions)
    const [rows, setRows] = useState<T[]>([])
    const [searchValue, setSearchValue] = useState('')
    const [searchFields, setSearchFields] = useState<string[]>([])
    const [scrollBarVisible, setScrollBarVisible] = useState<boolean>(true)

    const filteredRows = useMemo(() => {
        return searchArray(
            stableSort(rows, getComparator(order, orderBy)),
            searchFields.length ? searchFields : searchOptions.map(v => v.value as string),
            searchValue
        )
    }, [rows, searchFields, searchOptions, searchValue, order, orderBy])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleInputSearch = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setSearchValue(event.target.value)
        setPage(0)
    }

    const handleSelectSearchFields = (
        event: React.SyntheticEvent<Element, Event>,
        options: SearchOption[]
    ) => {
        setSearchFields(options.map(v => v.value as string))
    }

    useEffect(() => {
        setIsLoading(isDataLoading)
    }, [isDataLoading])

    useEffect(() => {
        if (data?.length > 0) {
            setRows([...data])
        } else {
            setRows([])
        }
    }, [data])

    useEffect(() => {
        setScrollBarVisible(false)

        const timer = setTimeout(() => {
            setRowsPerPage(rowsPerPage)
            setRowsPerPageOptions(rowsPerPageOptions)
            setPage(0)
            setScrollBarVisible(true)
        }, 200)

        return () => {
            clearTimeout(timer)
        }
    }, [rowsPerPage, rowsPerPageOptions])

    return (
        <Box width="100%" height={'100%'} overflow="hidden">
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`
                }}
                elevation={0}>
                <TableSearch
                    handleInputSearch={handleInputSearch}
                    handleSelectSearchFields={handleSelectSearchFields}
                    options={searchOptions}
                    classNames={{
                        search: classNames?.tableSearch
                    }}
                />
                <TableContainer
                    sx={{
                        overflowY: scrollBarVisible ? 'auto' : 'hidden',
                        maxHeight: `${height - 75 - 52}px`,
                        height: `${height - 75 - 52}px`,
                        transition: 'all 0.2s ease'
                    }}>
                    {/* sx={{ maxHeight: `${height}px`, height: `${height}px` }}> */}
                    <Table
                        stickyHeader
                        aria-label="sticky table"
                        size="small"
                        classes={{
                            root: `${classNames?.tableRoot}`,
                            stickyHeader: `${classNames?.tableStickyHeader}`
                        }}>
                        <TableHeader
                            headCells={columns}
                            order={order}
                            orderBy={orderBy as string}
                            onRequestSort={handleRequestSort}
                            classNames={classNames}
                        />
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        className={`${classes.tableRow} ${classNames?.tableRow}`}
                                        colSpan={columns.length || 0}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            textAlign="center"
                                            className={`${classes.tableSpinner} ${classNames?.tableLoader}`}
                                            style={{
                                                height:
                                                    height > 0 ? `${height - 140}px` : 'fit-content'
                                            }}>
                                            {LoaderComponent || (
                                                <CircularProgress color="secondary" size={40} />
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : filteredRows?.length > 0 ? (
                                filteredRows
                                    .slice(page * _rowsPerPage, page * _rowsPerPage + _rowsPerPage)
                                    .map(row => {
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                                classes={{
                                                    footer: `${classNames?.tableRowFooter}`,
                                                    head: `${classNames?.tableRowHead}`,
                                                    hover: `${classNames?.tableRowHover}`,
                                                    root: `${classes.tableRow} ${classNames?.tableRowRoot}`,
                                                    selected: `${classNames?.tableRowSelected}`
                                                }}>
                                                {columns.map(column => {
                                                    const value = row[column.id]
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column?.align || 'left'}
                                                            style={{
                                                                maxWidth:
                                                                    column?.minWidth || 'inherit',
                                                                display: column?.hide
                                                                    ? 'none'
                                                                    : 'table-cell'
                                                            }}
                                                            classes={{
                                                                alignCenter: `${classNames?.tableCellAlignCenter}`,
                                                                alignJustify: ` ${classNames?.tableCellAlignJustify}`,
                                                                alignLeft: ` ${classNames?.tableCellAlignLeft}`,
                                                                alignRight: ` ${classNames?.tableCellAlignRight}`,
                                                                body: `${classes.tableCellBody} ${classNames?.tableCellBody}`,
                                                                footer: ` ${classNames?.tableCellFooter}`,
                                                                head: ` ${classNames?.tableCellHead}`,
                                                                paddingCheckbox: ` ${classNames?.tableCellPaddingCheckbox}`,
                                                                paddingNone: ` ${classNames?.tableCellPaddingNone}`,
                                                                root: `${classes.tableCell} ${classNames?.tableCellRoot}`,
                                                                sizeMedium: ` ${classNames?.tableCellSizeMedium}`,
                                                                sizeSmall: ` ${classNames?.tableCellSizeSmall}`,
                                                                stickyHeader: ` ${classNames?.tableCellStickyHeader}`
                                                            }}>
                                                            {column?.render
                                                                ? column.render(row)
                                                                : value}
                                                        </TableCell>
                                                    )
                                                })}
                                            </TableRow>
                                        )
                                    })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className={classes.tableCellEmpty}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            textAlign="center"
                                            width="100%"
                                            style={{
                                                height:
                                                    height > 0 ? `${height - 140}px` : 'fit-content'
                                            }}>
                                            <Typography
                                                className={`${classes.tableEmptyText} ${classNames?.tableEmptyText}`}>
                                                {t(translations.DataGridNoDataAvailable)}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={_rowsPerPageOptions}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={_rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className={`${classes.tablePagination} ${classNames?.tablePagination}`}
                    classes={{
                        toolbar: `${classesTable.tablePaginationToolbar} ${classNames?.tablePaginationToolbar}`,
                        selectLabel: `${classesTable.tablePaginationSelectLabel} ${classNames?.tablePaginationSelectLabel}`,
                        displayedRows: `${classesTable.tablePaginationDisplayedRows} ${classNames?.tablePaginationDisplayedRows}`,
                        select: `${classesTable.tablePaginationSelect} ${classNames?.tablePaginationSelect}`,
                        actions: `${classesTable.tablePaginationActions} ${classNames?.tablePaginationActions}`,
                        menuItem: `${classesTable.tablePaginationMenuItem} ${classNames?.tablePaginationMenuItem}`
                    }}
                />
            </Paper>
        </Box>
    )
}

export default DataGridClientTable

const useStyles = makeStyles()((theme: Theme) => ({
    tableSpinner: {
        textAlign: 'center'
    },
    tableRow: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    tableCellLoading: {
        background: theme.palette.background.paper,
        padding: '8px 0px 0px 15px',
        height: '51px',
        borderTop: `1px solid ${theme.palette.divider}`,
        '@media (max-width: 600px)': {
            padding: '0px'
        }
    },
    tableCell: {
        padding: '8px 0px 0px 15px',
        height: '40px',
        border: `1px solid ${theme.palette.divider}`,
        '@media (max-width: 600px)': {
            padding: '0px'
        },
        wordWrap: 'break-word',
        whiteSpace: 'normal'
    },
    tableCellBody: {
        fontSize: '0.825rem'
    },
    tableCellEmpty: {
        borderTop: `1px solid ${theme.palette.divider}`
    },
    tableCellHeaderText: {
        opacity: 0.5,
        fontSize: '0.825rem'
    },
    tableEmptyText: {
        fontSize: '0.85rem',
        fontStyle: 'oblique',
        opacity: 0.6
    },

    tableCheckboxUnchecked: {
        color: theme.palette.primary.main,
        opacity: 0.2,
        paddingLeft: '16px'
    },
    tableCheckboxChecked: {
        paddingLeft: '16px',
        color: theme.palette.primary.main
    },
    tablePaginationSelect: {
        fontSize: '0.75rem'
    },
    tablePagination: {
        fontSize: '0.75rem'
    },
    tablePaginationSelectLabel: {
        fontSize: '0.75rem'
    },
    tablePaginationDisplayedRows: {
        fontSize: '0.75rem'
    },
    tablePaginationActions: {
        marginRight: '20px'
    },
    tablePaginationMenuItem: {
        fontSize: '0.8rem'
    },
    tableFooterWrapper: {
        backgroundColor: theme.palette.background.default
    },
    tableFooterText: {
        fontSize: '0.875rem',
        color: theme.palette.info.main,
        fontStyle: 'italic'
    }
}))
