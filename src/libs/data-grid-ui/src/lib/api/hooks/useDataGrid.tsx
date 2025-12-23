import React, {
    ChangeEvent,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react'

import { Box, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { DeleteButton } from '../components/button/DeleteButton'
import { NewButton } from '../components/button/NewButton'
import CrudDialog from '../components/dialog/CrudDialog'
import Body from '../components/table/Body'
import Footer from '../components/table/Footer'
import Header from '../components/table/Header'
import { Search } from '../components/table/Search'
import {
    ColumnTypeEnum,
    IDataGridConfig,
    IDataGridShowCrudDialogData,
    TLabels,
    TTableClasses,
    TTableSelectedItemsMap,
    TTableVisibility
} from '../types'
import { useDataGridHelper } from './useDataGridHelper'
import { useDebounce } from './useDebounce'

export const useDataGrid = (
    isCellWithBorder: boolean,
    rowsPerPage: number,
    borderColor: string,
    classNames: Partial<TTableClasses>,
    height: number,
    data: any,
    showOptions?: TTableVisibility,
    labels?: TLabels,
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit',
    LoaderComponent?: JSX.Element
): {
    TableControlBar: any
    TableHeader: JSX.Element
    TableBody: JSX.Element
    TableFooter: JSX.Element
    TableCrudDialogHelper: false | JSX.Element
    paperContainerAttributes: { className: string; style: { height: string } }
    tableContainerStyle: { boxShadow: string; height: string | number }
    tableClass: string
} => {
    const { classes } = useStyles()
    const [tableData, setTableData] = useState<any>({
        rows: [],
        pagination: {},
        operators: {}
    })
    const [page, setPage] = useState<number>(0)
    const [perPage, setPerPage] = useState<number>(rowsPerPage)
    const [editRowId, setEditRowId] = useState(0)
    const [selectedRow, setSelectedRow] = useState({})
    const [crudActions, setCrudActions] = useState([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showCrudDialogData, setShowCrudDialogData] = useState<IDataGridShowCrudDialogData>({
        show: false,
        mode: ''
    })
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [orderByOperator, setOrderByOperator] = useState<string>(
        data?.defaults?.orderByDirection || ''
    )
    const [orderByColumn, setOrderByColumn] = useState<string>(data?.defaults?.orderByColumn || '')
    const [filter, setFilter] = useState<any>([])
    const defaultFilter = data?.defaults?.filters
    const filterHelper = (accessor: string, operator: string, query: string) =>
        `&filter[${accessor}][${operator}]=${query}`
    const [checkedRows, setCheckedRows] = useState<TTableSelectedItemsMap>(
        new Map<number, string[]>()
    )
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [numberOfSelectedItems, setNumberOfSelectedItems] = useState<number>(0)
    const [numberOfSelectedRowsPerPage, setNumberOfSelectedItemsPage] = useState<number>(0)
    const [refreshTimestamp, setRefreshTimestamp] = useState<number>(0)

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const {
        getDictionaryFromColumns,
        getIdentifiersFromSearchableColumns,
        getCrudColumns,
        getSelectedCrudColumns,
        getTableKeyField,
        setInitStateCrud
    } = useDataGridHelper()

    const OFFSET_HEADER = showOptions?.isControlBarVisible ? 125 : 40
    const OFFSET_FOOTER = 3

    const tableConfig: IDataGridConfig = useMemo(
        () => ({
            getter: data?.crud?.read || null,
            columns: data.columns || []
        }),
        [data?.crud?.read, data?.columns]
    )

    const [searchColumns, setSearchColumns] = useState(
        getIdentifiersFromSearchableColumns(tableConfig.columns)
    )

    const tableKeyField = getTableKeyField(data?.columns)

    const dialogTitle = useMemo((): any => {
        return {
            new: 'New Record',
            edit: 'Edit Record',
            delete: 'Delete Record'
        }
    }, [])

    /* We are collecting accessors in array, and setting rows state in table data **/
    // const columnsConfig = tableConfig.columns?.map(i => i.accessor)

    const createSortHandler = useCallback(
        (property: SetStateAction<string>) => {
            const isAsc = orderByColumn === property && orderByOperator === 'asc'
            setOrderByOperator(isAsc ? 'desc' : 'asc')
            setOrderByColumn(property)
        },
        [orderByColumn, orderByOperator]
    )

    const setFilterHelper = useCallback(
        (accessor: string, operator: string, query: string) =>
            setFilter((prev: string | any[]) =>
                prev.concat(filterHelper(accessor, operator, query))
            ),
        []
    )

    const removeFilterHelper = useCallback(
        (accessor: string) =>
            setFilter((prev: any[]) => prev.filter(item => !item.includes(`[${accessor}]`))),
        []
    )

    const loadData = useCallback(
        async (
            perPage: number | undefined,
            page: number | undefined,
            searchColumns: string | undefined,
            searchOperator: string | undefined,
            searchQuery: string | undefined,
            orderByColumn: string | undefined,
            orderByOperator: string | undefined,
            filter: string | undefined
        ) => {
            try {
                setIsLoading(true)
                const table = tableConfig.getter
                    ? await tableConfig.getter(
                          perPage,
                          page,
                          searchColumns,
                          searchOperator,
                          searchQuery,
                          orderByColumn,
                          orderByOperator,
                          filter,
                          defaultFilter
                      )
                    : {}

                setTableData({
                    rows: table?.data,
                    pagination: table?.pagination || {},
                    operators: table?.operators || {},
                    tableInfo: {
                        orderByColumn,
                        orderByOperator
                    }
                })
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsLoading(false)
            }
        },
        [defaultFilter, tableConfig]
    )

    // external timestampChange
    const refetchHelper = useCallback(
        () =>
            loadData(
                perPage,
                page + 1,
                `[${searchColumns.join(',')}]`,
                'like',
                debouncedSearchTerm,
                orderByColumn,
                orderByOperator,
                filter.join('')
            ),
        [
            debouncedSearchTerm,
            filter,
            loadData,
            orderByColumn,
            orderByOperator,
            page,
            perPage,
            searchColumns
        ]
    )

    useEffect(() => {
        const fetchData = async () => {
            await loadData(
                perPage,
                page + 1,
                `[${searchColumns.join(',')}]`,
                'like',
                debouncedSearchTerm,
                orderByColumn,
                orderByOperator,
                filter.join('')
            )
        }

        fetchData()
    }, [
        perPage,
        page,
        debouncedSearchTerm,
        orderByColumn,
        orderByOperator,
        filter,
        refreshTimestamp,
        loadData,
        searchColumns
    ])

    useEffect(() => {
        if (data?.refreshTimestamp) {
            refetchHelper()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.refreshTimestamp])

    useEffect(() => {
        const arr = [...checkedRows.values()]
        const flatArray = arr.reduce((acc, curVal) => {
            return acc.concat(curVal)
        }, [])
        setNumberOfSelectedItems(flatArray?.length || 0)
        setNumberOfSelectedItemsPage(checkedRows.get(page)?.length || 0)
        setSelectedItems(flatArray)
    }, [checkedRows, data?.crud?.bulkDelete, page])

    useEffect(() => {
        const actions: any = []
        if (data?.crud?.update || data?.customEditClickAction) {
            actions.push({
                label: labels?.editAction || 'Edit',
                handleOnClickCallback: (e: any) => {
                    if (data?.customEditClickAction) {
                        data?.customEditClickAction(e.id, e.payload)
                        return
                    }
                    setEditRowId(e.id)
                    setSelectedRow(e.payload)
                    setShowCrudDialogData({ mode: 'edit', show: true })
                }
            })
        }
        if (data?.crud?.delete || data?.customDeleteClickAction) {
            actions.push({
                label: labels?.deleteAction || 'Delete',
                handleOnClickCallback: (e: any) => {
                    if (data?.customDeleteClickAction) {
                        data?.customDeleteClickAction(e.id)
                        return
                    }
                    setSelectedRow(e)
                    setShowCrudDialogData({ mode: 'delete', show: true })
                }
            })
        }
        setCrudActions(actions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, data?.crud])

    const handleSearchTextChange = useCallback((v: SetStateAction<string>) => {
        setSearchTerm(v)
        setPage(0)
    }, [])

    const handleChangePage = useCallback((event: any, newPage: SetStateAction<number>) => {
        setPage(newPage)
    }, [])

    const handleChangeRowsPerPage = useCallback((event: { target: { value: string | number } }) => {
        setPerPage(+event.target.value)
        setPage(0)
    }, [])

    const handleTableHeaderSelectAllClick = (
        event: ChangeEvent<HTMLInputElement>,
        page: number
    ) => {
        const copyMapItems = new Map(checkedRows)
        if (event.target.checked) {
            const newSelected = tableData.rows.map(
                (row: { [x: string]: any }) => row[tableKeyField]
            )
            copyMapItems.set(page, newSelected)
            setCheckedRows(copyMapItems)
            return
        }
        copyMapItems.set(page, [])
        setCheckedRows(copyMapItems)
    }

    const handleTableCellCheckBoxClick = (
        event: React.MouseEvent<unknown>,
        page: number,
        key: string
    ) => {
        const copyMapItems = new Map(checkedRows)
        const pageSelectedItems = copyMapItems.get(page) || []
        const selectedIndex = pageSelectedItems.indexOf(key)

        let newSelected: string[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(pageSelectedItems, key)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(pageSelectedItems.slice(1))
        } else if (selectedIndex === numberOfSelectedItems - 1) {
            newSelected = newSelected.concat(pageSelectedItems.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                pageSelectedItems.slice(0, selectedIndex),
                pageSelectedItems.slice(selectedIndex + 1)
            )
        }
        copyMapItems.set(page, newSelected)
        setCheckedRows(copyMapItems)
    }

    const onHandleRefreshClick = () => {
        setRefreshTimestamp(new Date().getMilliseconds())
    }

    /* We are creating init empty fields for New record **/
    const handleCrudNewInitState = useCallback(() => {
        const newInitState: any = {}
        getSelectedCrudColumns(tableConfig?.columns)?.map(
            (col: { columnType: ColumnTypeEnum; accessor: string | number; dataType: any }) =>
                col.columnType === ColumnTypeEnum.CRUD &&
                col.accessor !== tableKeyField &&
                (newInitState[col.accessor] = setInitStateCrud(col.dataType))
        )
        return newInitState
    }, [getSelectedCrudColumns, setInitStateCrud, tableKeyField, tableConfig?.columns])

    const handleCrudEditInitState = useCallback(
        (row: { [x: string]: any }) => {
            const editInitState: any = {
                id: '',
                payload: {}
            }
            getSelectedCrudColumns(tableConfig?.columns)?.map((col: any) => {
                if (!!row[col.accessor] && col.accessor === tableKeyField) {
                    editInitState.id = row[col.accessor]
                }
                if (
                    !!row[col.accessor] &&
                    col.accessor !== tableKeyField &&
                    col.columnType === ColumnTypeEnum.CRUD
                ) {
                    editInitState.payload[col.accessor] = row[col.accessor]
                }
            })
            return editInitState
        },
        [getSelectedCrudColumns, tableConfig?.columns, tableKeyField]
    )

    const handleButtonNewClick = () => {
        if (data?.customNewClickAction) {
            data?.customNewClickAction()
            return
        }
        setSelectedRow(handleCrudNewInitState)
        setShowCrudDialogData({ mode: 'new', show: true })
    }

    const TableControlBar = showOptions?.isControlBarVisible && (
        <Box
            display="flex"
            className={`${classes.controlBarWrapper} ${classNames?.controlBox}`}
            p={2}>
            <Box display="flex" alignItems="center" flexGrow={1} width="60%">
                <Search
                    identifiers={getIdentifiersFromSearchableColumns(data?.columns)}
                    columns={getDictionaryFromColumns(data?.columns)}
                    setItems={setSearchColumns}
                    handleSearchTextCallback={handleSearchTextChange}
                    handleOnHandleRefreshClickCallback={onHandleRefreshClick}
                    searchTerm={searchTerm}
                    classNames={classNames}
                />
            </Box>
            {data?.crud?.bulkDelete && (
                <Box flexGrow={1} textAlign="right" alignSelf="center" maxWidth={'125px'}>
                    <DeleteButton
                        isDisabled={selectedItems.length === 0}
                        label={labels?.bulkDeleteButton}
                        handleBulkDeleteCallback={() => {
                            if (data?.crud?.bulkDelete && selectedItems.length > 0) {
                                data.crud.bulkDelete(selectedItems)
                            }
                        }}
                    />
                </Box>
            )}
            {data?.crud?.create && (
                <Box flexGrow={1} textAlign="right" alignSelf="center" maxWidth={'125px'}>
                    <NewButton
                        handleButtonNewCallback={handleButtonNewClick}
                        label={labels?.newButton}
                    />
                </Box>
            )}
        </Box>
    )

    const TableHeader = showOptions?.isHeaderVisible ? (
        <Header
            isBulkDeleteAction={!!data?.crud?.bulkDelete}
            isCellWithBorder={isCellWithBorder}
            borderColor={borderColor}
            columns={data?.columns}
            filterValue={filter}
            setFilterState={setFilterHelper}
            removeFilterState={removeFilterHelper}
            numberOfRows={tableData?.rows?.length || 0}
            numberOfSelectedRowsPerPage={numberOfSelectedRowsPerPage}
            orderByColumn={orderByColumn}
            orderByOperator={orderByOperator}
            classNames={classNames}
            handleSortClickCallback={accessor => createSortHandler(accessor)}
            handleTableHeaderSelectAllClickCallback={(e: any) =>
                handleTableHeaderSelectAllClick(e, page)
            }
            hasActions={data?.customActions?.length > 0 || crudActions?.length > 0}
        />
    ) : null

    const TableBody = (
        <Body
            classNames={classNames}
            isCellWithBorder={isCellWithBorder}
            borderColor={borderColor}
            checkedRows={checkedRows}
            columns={data?.columns || []}
            components={data?.components}
            data={tableData}
            currentPage={page}
            height={height - OFFSET_HEADER}
            isLoading={isLoading}
            keyField={tableKeyField}
            handleOnEditStateCrudCallback={row => handleCrudEditInitState(row)}
            crudActions={crudActions}
            customActions={data?.customActions}
            isBulkDeleteAction={!!data?.crud?.bulkDelete}
            activeRowKeyId={data.activeRowKeyId}
            handleTableCellCheckBoxClickCallback={(event, page, key) =>
                handleTableCellCheckBoxClick(event, page, key)
            }
            color={color}
            LoaderComponent={LoaderComponent}
        />
    )

    const TableFooter = (
        <Footer
            classNames={classNames}
            numberOfSelectedItems={numberOfSelectedItems}
            totalNumberOfRows={tableData?.pagination?.total || 0}
            rowsPerPage={perPage}
            currentPage={page}
            handleChangePageCallback={(e, page) => handleChangePage(e, page)}
            handleChangeRowsPerPageCallback={(e: any) => handleChangeRowsPerPage(e)}
        />
    )

    const TableCrudDialogHelper = showCrudDialogData.show && (
        <CrudDialog
            title={dialogTitle[showCrudDialogData.mode]}
            crud={data.crud}
            keyField={tableKeyField}
            crudColumns={getCrudColumns(tableConfig?.columns)}
            editRowId={editRowId}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            mode={showCrudDialogData.mode}
            refetch={refetchHelper}
            onHide={() => {
                setShowCrudDialogData({ mode: '', show: false })
                setSelectedRow({})
            }}
        />
    )

    const paperContainerAttributes = {
        className: `${classes?.paperContainer} ${classNames?.root}`,
        style: {
            height: height > 0 ? `${height}px` : 'fit-content'
        }
    }

    const tableContainerStyle = {
        boxShadow: 'none',
        height: height ? height - OFFSET_HEADER - OFFSET_FOOTER : 'content-fit'
    }

    return {
        TableBody,
        TableHeader,
        TableFooter,
        TableControlBar,
        tableContainerStyle,
        TableCrudDialogHelper,
        paperContainerAttributes,
        tableClass: classes.table
    }
}

const useStyles = makeStyles()((theme: Theme) => ({
    paperContainer: {
        padding: 0
    },
    table: {
        position: 'relative',
        color: 'black'
    },
    controlBarWrapper: {
        backgroundColor: theme.palette.background.default
    }
}))

export default useDataGrid
