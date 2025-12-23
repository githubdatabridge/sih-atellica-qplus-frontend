import { ReactNode } from 'react'

export enum ColumnTypeEnum {
    CRUD = 'CRUD',
    CALC = 'CALC',
    TRANSIENT = 'TRANSIENT'
}

export enum OrderByDirectionEnum {
    DESC = 'desc',
    ASC = 'asc'
}

export enum DataTypesEnum {
    INTEGER = 'INTEGER',
    STRING = 'STRING',
    MULTILINE = 'MULTILINE',
    DATE = 'DATE',
    ARRAY = 'ARRAY',
    BOOLEAN = 'BOOLEAN'
}

export type TColumnLookup = {
    data: any[]
    key: string
    value: string
}

export type TCrudOperation = {
    create?: (row: any) => Promise<any>
    read?: (
        perPage?: number,
        page?: number,
        query?: string,
        orderBy?: string,
        order?: string,
        searchBy?: string,
        operator?: string,
        filter?: string
    ) => Promise<any>
    delete?: (id: any) => Promise<any>
    update?: (id: any, row: any) => Promise<any>
    bulkDelete?: (ids: any[]) => Promise<any>
}

export type TTableData = {
    columns: TColumnRecord[]
    crud?: TCrudOperation
    components?: Record<string, any>
    customActions?: IDataGridListItemAction[]
    customNewClickAction?: () => void
    customEditClickAction?: (id: any, data: any) => void
    customDeleteClickAction?: (id: any) => void
    defaults?: ITableDefaults
    refreshTimestamp?: number
    activeRowKeyId?: string
}

export type TTableVisibility = {
    isControlBarVisible?: boolean
    isHeaderVisible?: boolean
}

export type TTableSelectedItemsMap = Map<number, string[]>

export type TLabels = {
    newButton?: string
    bulkDeleteButton?: string
    editAction?: string
    deleteAction?: string
}

export type TTableClasses = {
    root?: any
    controlBox?: any
    searchBox?: any
    searchSelect?: any
    paperContainer?: any
    table?: any
    tableCellHeader?: any
    tableCell?: any
    tablePagination?: any
    tableEmptyText?: any
    tableFooter?: any
    tableFooterSelected?: any
    tableCellAction?: any
    tableCheckboxUnchecked?: any
    tableCheckboxChecked?: any
    tableLoader?: any
    tableRow?: any
}

export interface IDataGridProps {
    height?: number
    isCellWithBorder?: boolean
    showOptions?: TTableVisibility
    borderColor?: string
    rowsPerPage: number
    data?: TTableData
    classNames?: Partial<TTableClasses>
    labels?: Partial<TLabels>
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    LoaderComponent?: JSX.Element
}

export interface ITableDefaultFilter {
    accessor: string
    value: string | number
    operator: string
}

export interface ITableDefaults {
    orderByDirection?: OrderByDirectionEnum
    orderByColumn?: string
    filters?: ITableDefaultFilter[]
}

export type TColumnRecord = {
    accessor: string
    label: string
    columnType?: ColumnTypeEnum
    dataType?: DataTypesEnum
    width?: string
    visible: boolean
    showFilter?: boolean
    sortable?: boolean
    filterOperator?: string[]
    searchable?: boolean
    lookup?: TColumnLookup
    isKey?: boolean
    validate?: {
        rule: any
        errorMessage: string
    }[]
}

export interface TColumnSearch {
    [key: string]: string
}

export type TGetter = (
    perPage?: number,
    page?: number,
    query?: string,
    orderBy?: string,
    order?: string,
    searchBy?: string,
    operator?: string,
    filter?: string,
    defaultFilter?: ITableDefaultFilter
) => any

export interface IDataGridConfig {
    getter: TGetter
    columns: TColumnRecord[]
}

export interface IDataGridListItemAction {
    icon?: ReactNode
    label: string
    handleOnClickCallback?: (record: any) => void
}

export interface IDataGridActionsListProps {
    record: any
    index: number
    handleListItemLoadingCallback: (index: number) => void
    customActions?: IDataGridListItemAction[]
    classNames?: any
}

export interface IDataGridCellSearchProps {
    column: TColumnRecord
    setFilter: any
    removeFilterHelper: any
    isActiveFilter: boolean
    align?: number
}

export interface IDataGridSearchFields {
    identifiers: string[]
    columns: TColumnSearch
    classNames?: Partial<TTableClasses>
    setItems: (record: any) => void
}

export interface IDataGridCrudDialog {
    keyField?: string
    title?: string
    crudColumns: any[]
    selectedRow: any
    mode: string
    crud: TCrudOperation
    editRowId: number
    setSelectedRow: (record: any) => void
    refetch: any
    onHide: () => void
}

export interface IDataGridShowCrudDialogData {
    show: boolean
    mode: '' | 'new' | 'edit' | 'delete'
}
