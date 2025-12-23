export type SearchOption = { value: string | number; label: string }

export type HeadCell<T> = {
    id: string
    label: string
    minWidth: number
    align?: 'left' | 'center' | 'right'
    hide?: boolean
    numeric?: boolean
    disablePadding?: boolean
    render?: (value: T) => React.ReactNode
}

export type TSearchClasses = {
    search?: string
}

export type TDataGridClientClasses = {
    tableLoader: string
    tableEmptyText: string
    tableSearch: string
    tableRoot: string
    tableHeadRoot: string
    tableStickyHeader: string
    tableCellAlignCenter: string
    tableCellAlignJustify: string
    tableCellAlignLeft: string
    tableRowSelected: string
    tableCellAlignRight: string
    tableCellBody: string
    tableCellFooter: string
    tableCellHead: string
    tableCellPaddingNone: string
    tableCellPaddingCheckbox: string
    tableCellRoot: string
    tableCellSizeMedium: string
    tableCellSizeSmall: string
    tableCellStickyHeader: string
    tableRow: string
    tableRowRoot: string
    tableRowHover: string
    tableRowHead: string
    tableRowFooter: string
    tablePagination: string
    tablePaginationSelectLabel: string
    tablePaginationDisplayedRows: string
    tablePaginationSelect: string
    tablePaginationActions: string
    tablePaginationMenuItem: string
    tablePaginationToolbar: string
}
