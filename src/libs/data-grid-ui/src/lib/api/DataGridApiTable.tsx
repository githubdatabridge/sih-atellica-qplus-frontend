import React from 'react'

import { Paper } from '@mui/material'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'

import { AlertProvider } from '@libs/common-ui'

import useDataGrid from './hooks/useDataGrid'
import { IDataGridProps } from './types'

const isBoolean = (val: any) => 'boolean' === typeof val

const DataGrid = ({
    rowsPerPage = 5,
    data = {
        columns: [],
        components: {},
        customActions: [],
        customNewClickAction: undefined,
        customEditClickAction: undefined,
        customDeleteClickAction: undefined,
        defaults: {},
        activeRowKeyId: ''
    },
    isCellWithBorder = false,
    showOptions = {
        isControlBarVisible: true,
        isHeaderVisible: true
    },
    height = 0,
    borderColor = '',
    classNames,
    labels,
    color = 'secondary',
    LoaderComponent
}: IDataGridProps) => {
    const {
        tableClass,
        TableHeader,
        TableBody,
        TableFooter,
        tableContainerStyle,
        TableControlBar,
        paperContainerAttributes,
        TableCrudDialogHelper
    } = useDataGrid(
        isCellWithBorder,
        rowsPerPage,
        borderColor,
        classNames,
        height,
        data,
        {
            isHeaderVisible: isBoolean(showOptions?.isHeaderVisible)
                ? showOptions?.isHeaderVisible
                : true,
            isControlBarVisible: isBoolean(showOptions?.isControlBarVisible)
                ? showOptions?.isControlBarVisible
                : true
        },
        labels,
        color,
        LoaderComponent
    )
    return (
        <Paper
            className={paperContainerAttributes.className}
            elevation={0}
            style={paperContainerAttributes.style}>
            {TableCrudDialogHelper}
            {TableControlBar}
            <TableContainer component={Paper} style={tableContainerStyle}>
                <Table
                    stickyHeader
                    className={tableClass}
                    sx={{ height: 'max-content' }}
                    aria-label="DataGrid">
                    {TableHeader}
                    {TableBody}
                </Table>
            </TableContainer>
            {TableFooter}
        </Paper>
    )
}

const DataGridApiTable = ({
    rowsPerPage = 5,
    data = {
        columns: [],
        components: {},
        customActions: [],
        customNewClickAction: undefined,
        customEditClickAction: undefined,
        customDeleteClickAction: undefined,
        defaults: {}
    },
    isCellWithBorder = false,
    showOptions = {
        isControlBarVisible: true
    },
    height = 0,
    borderColor = '',
    classNames,
    labels,
    color = 'secondary',
    LoaderComponent
}: IDataGridProps) => (
    <AlertProvider>
        <DataGrid
            rowsPerPage={rowsPerPage}
            data={data}
            isCellWithBorder={isCellWithBorder}
            showOptions={showOptions}
            height={height}
            borderColor={borderColor}
            classNames={classNames}
            labels={labels}
            color={color}
            LoaderComponent={LoaderComponent}
        />
    </AlertProvider>
)

export default DataGridApiTable
