import React, { FC, useState } from 'react'

import {
    Box,
    Checkbox,
    CircularProgress,
    TableBody,
    TableCell,
    TableRow,
    Theme,
    Typography
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import translations from '../../constants/translations'
import { useDataGridHelper } from '../../hooks/useDataGridHelper'
import { IDataGridListItemAction, TColumnRecord, TTableSelectedItemsMap } from '../../types'
import { ColumnActionsList } from '../list/ActionsList'
import { ContextMenuPopper } from '../popper/ContextMenuPopper'

interface IBodyProps {
    isLoading: boolean
    keyField: string
    data: any
    isCellWithBorder?: boolean
    borderColor?: string
    classNames?: any
    columns: TColumnRecord[]
    height: number
    currentPage: number
    components: Record<string, any>
    checkedRows?: TTableSelectedItemsMap
    customActions?: IDataGridListItemAction[]
    crudActions?: any[]
    isBulkDeleteAction?: boolean
    activeRowKeyId?: string
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    LoaderComponent?: JSX.Element
    handleOnEditStateCrudCallback: (row: any) => void
    handleTableCellCheckBoxClickCallback: (event: any, currentPage: number, row: any) => void
}

const Body: FC<IBodyProps> = ({
    data,
    height,
    columns,
    keyField,
    components,
    classNames,
    borderColor,
    currentPage,
    checkedRows,
    activeRowKeyId,
    LoaderComponent,
    isCellWithBorder,
    crudActions = [],
    isLoading = false,
    customActions = [],
    color = 'secondary',
    isBulkDeleteAction = true,
    handleOnEditStateCrudCallback,
    handleTableCellCheckBoxClickCallback
}) => {
    const [recordId, setRecordId] = useState<number>(-1)
    const { isRowSelected } = useDataGridHelper()
    const { classes } = useStyles()
    const { t } = useI18n()

    const handleListItemLoadingClick = (index: number) => {
        setRecordId(index)
    }

    return (
        <TableBody>
            {isLoading ? (
                <TableRow>
                    <TableCell
                        colSpan={columns.length || 0}
                        className={`${classes.tableRow} ${classNames?.tableRow}`}>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                            className={`${classes.tableSpinner} ${classNames?.tableLoader}`}
                            style={{ height: height > 0 ? `${height - 100}px` : 'fit-content' }}>
                            {LoaderComponent || <CircularProgress color={color} size={40} />}
                        </Box>
                    </TableCell>
                </TableRow>
            ) : data?.rows && data?.rows?.length > 0 ? (
                data?.rows.map((row: any, index: number) => {
                    const isItemSelected =
                        row[keyField] && isRowSelected(checkedRows, currentPage, row[keyField])

                    return (
                        <TableRow
                            key={`${row.accessor}+${index}`}
                            hover
                            tabIndex={-1}
                            className={`${classes.tableRow} ${classNames?.tableRow}`}
                            selected={
                                row[keyField] && activeRowKeyId && row[keyField] === activeRowKeyId
                            }>
                            {isBulkDeleteAction && (
                                <TableCell
                                    key="action"
                                    className={`${classes.cell} ${classNames?.tableCell}`}
                                    classes={{ root: classes.tableCell }}
                                    style={{
                                        borderWidth: !isCellWithBorder ? '0px' : undefined,
                                        borderColor: borderColor || undefined,
                                        width: '5%'
                                    }}
                                    component="td">
                                    <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                        classes={{
                                            root: isItemSelected
                                                ? `${classes.tableCheckboxChecked} ${classNames?.tableCheckboxChecked}`
                                                : `${classes.tableCheckboxUnchecked} ${classNames?.tableCheckboxUnchecked}`
                                        }}
                                        inputProps={{ 'aria-labelledby': row[keyField] }}
                                        onClick={event =>
                                            handleTableCellCheckBoxClickCallback(
                                                event,
                                                currentPage,
                                                row[keyField]
                                            )
                                        }
                                    />
                                </TableCell>
                            )}
                            {columns?.map(
                                column =>
                                    column.visible && (
                                        <TableCell
                                            key={column.accessor}
                                            className={`${classes.cell} ${classNames?.tableCell}`}
                                            classes={{ root: classes.tableCell }}
                                            style={{
                                                borderWidth: !isCellWithBorder ? '0px' : undefined,
                                                borderColor: borderColor || undefined,
                                                width: column.width || undefined
                                            }}
                                            component="td">
                                            <ContextMenuPopper cellValue={row[column.accessor]}>
                                                {components?.[column.accessor]?.(
                                                    row[column.accessor],
                                                    row,
                                                    data
                                                ) ?? row[column.accessor]}
                                            </ContextMenuPopper>
                                        </TableCell>
                                    )
                            )}
                            {(customActions?.length > 0 || crudActions?.length > 0) && (
                                <TableCell
                                    key="action"
                                    className={`${classes.cell} ${classNames?.tableCell}`}
                                    classes={{ root: classes.tableCell }}
                                    style={{
                                        borderWidth: !isCellWithBorder ? '0px' : undefined,
                                        borderColor: borderColor || undefined,
                                        width: '5%'
                                    }}
                                    component="td">
                                    {recordId === index ? (
                                        <Box p={1}>
                                            <CircularProgress color={color} size={20} />
                                        </Box>
                                    ) : (
                                        <ColumnActionsList
                                            record={handleOnEditStateCrudCallback(row)}
                                            handleListItemLoadingCallback={
                                                handleListItemLoadingClick
                                            }
                                            index={index}
                                            classNames={classNames}
                                            customActions={[
                                                ...crudActions,
                                                ...(customActions || [])
                                            ]}
                                        />
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    )
                })
            ) : (
                <TableRow>
                    <TableCell
                        colSpan={
                            columns.length +
                                ((customActions && customActions.length > 0) ||
                                crudActions?.length > 0
                                    ? 1
                                    : 0) || 0
                        }
                        className={classes.tableCellEmpty}>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                            width="100%"
                            style={{ height: height > 0 ? `${height - 100}px` : 'fit-content' }}>
                            <Typography
                                className={`${classes.tableEmptyText} ${classNames?.tableEmptyText}`}>
                                {t(translations.DataGridNoDataAvailable)}
                            </Typography>
                        </Box>
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    )
}

export default Body

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
    cell: {
        color: theme.palette.text.primary,
        fontSize: '0.825rem',
        textOverflow: 'ellipsis',
        overflow: 'visible',
        '@media (max-width: 992px)': {
            borderBottom: 'none',
            height: '38px'
        },
        wordWrap: 'break-word',
        whiteSpace: 'normal'
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
