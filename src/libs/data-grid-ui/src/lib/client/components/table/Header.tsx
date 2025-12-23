import React from 'react'

import { Box, TableCell, TableHead, TableRow, TableSortLabel, Theme, useTheme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import SvgSortIcon from '../../icons/SvgSortIcon'
import { Order } from '../../services/dataGridClientService'
import { HeadCell, TDataGridClientClasses } from '../../types'

type Props<T> = {
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
    order: Order
    orderBy: string
    headCells: HeadCell<T>[]
    classNames?: Partial<TDataGridClientClasses>
}

const useStyles = makeStyles()((theme: Theme) => ({
    cell: {
        fontStyle: 'italic',
        fontSize: '0.825rem',
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`
    }
}))

export function Header<T>({ onRequestSort, order, orderBy, headCells, classNames }: Props<T>) {
    const theme = useTheme()
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property)
    }

    const { classes } = useStyles()

    return (
        <TableHead
            classes={{
                root: `${classNames?.tableHeadRoot}`
            }}>
            <TableRow>
                {headCells.map(hcell => (
                    <TableCell
                        key={hcell.id}
                        align={hcell?.align || 'left'}
                        padding={hcell?.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === hcell.id ? order : false}
                        className={`${classes.cell} ${classNames?.tableCellHead}`}
                        style={{
                            minWidth: hcell?.minWidth || 'inherit',
                            display: hcell?.hide ? 'none' : 'table-cell'
                        }}>
                        <TableSortLabel
                            active={orderBy === hcell.id}
                            direction={orderBy === hcell.id ? order : 'asc'}
                            onClick={createSortHandler(hcell.id)}
                            IconComponent={() => (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center">
                                    {orderBy === hcell.id ? (
                                        <SvgSortIcon
                                            colorDown={
                                                order === 'desc'
                                                    ? (theme.palette.secondary
                                                          .main as unknown as string)
                                                    : (theme.palette.divider as unknown as string)
                                            }
                                            colorUp={
                                                order === 'asc'
                                                    ? (theme.palette.secondary
                                                          .main as unknown as string)
                                                    : (theme.palette.divider as unknown as string)
                                            }
                                        />
                                    ) : (
                                        <SvgSortIcon
                                            colorDown={theme.palette.divider as unknown as string}
                                            colorUp={theme.palette.divider as unknown as string}
                                        />
                                    )}
                                </Box>
                            )}>
                            {hcell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}
