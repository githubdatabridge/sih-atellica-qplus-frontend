import { makeStyles } from 'tss-react/mui'

export const useTableStyles = (): Record<string, Record<string, string | number | undefined>> => {
    const useStyles = makeStyles()(theme => ({
        tableHeader: {},
        tableCell: {},
        tableFooter: {},
        root: {},
        paperContainer: {},
        table: {},
        tableEmptyText: {},
        tablePagination: {
            fontSize: '0.825rem'
        },
        tablePaginationToolbar: {},
        tablePaginationSelectLabel: {},
        tablePaginationDisplayedRows: {},
        tablePaginationSelect: {},
        tablePaginationActions: {},
        tablePaginationMenuItem: {},
        centralBox: {}
    }))

    const { classes } = useStyles()

    return { classesTable: classes }
}
