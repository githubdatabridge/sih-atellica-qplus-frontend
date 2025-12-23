import React, { FC } from 'react'

import { Box, Typography, TablePagination, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import translations from '../../constants/translations'

interface IFooterProps {
    numberOfSelectedItems?: number
    totalNumberOfRows: number
    rowsPerPage: number
    currentPage: number
    handleChangePageCallback: (e: any, page: number) => void
    handleChangeRowsPerPageCallback: (e: any) => void
    classNames?: any
}

const Footer: FC<IFooterProps> = ({
    numberOfSelectedItems = 0,
    totalNumberOfRows,
    rowsPerPage,
    currentPage,
    classNames,
    handleChangePageCallback,
    handleChangeRowsPerPageCallback
}) => {
    const { t } = useI18n()
    const { classes } = useStyles()

    return (
        <Box
            display="flex"
            alignItems="center"
            className={`${classes.tableFooterWrapper} ${classNames?.tableFooter}`}>
            <Box flexGrow={1} pl={4}>
                <p>
                    {numberOfSelectedItems > 0 ? (
                        <Typography
                            className={`${classes.tableFooterText} ${classNames.tableFooterSelected}`}>
                            {t(translations.DataGridFooterRowSelected)} {numberOfSelectedItems}
                        </Typography>
                    ) : null}
                </p>
            </Box>
            <Box>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={totalNumberOfRows || 0}
                    rowsPerPage={rowsPerPage}
                    page={currentPage}
                    onPageChange={(e, page) => handleChangePageCallback(e, page)}
                    onRowsPerPageChange={e => handleChangeRowsPerPageCallback(e)}
                    className={classNames?.tablePagination}
                    classes={{
                        selectLabel: classes.tablePaginationSelectLabel,
                        displayedRows: classes.tablePaginationDisplayedRows,
                        select: classes.tablePaginationSelect,
                        actions: classes.tablePaginationActions,
                        menuItem: classes.tablePaginationMenuItem
                    }}
                />
            </Box>
        </Box>
    )
}

export default Footer

const useStyles = makeStyles()((theme: Theme) => ({
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
