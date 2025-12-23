import { Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

export const useTableStyles = (): any => {
    const useStyles = makeStyles()((theme: Theme) => ({
        tableHeader: {
            fontStyle: 'italic'
        },
        tableCell: {
            fontSize: '12px',
            height: '60px !important'
        },
        tableCellAction: {}
    }))

    const { classes } = useStyles()
    const classesTable = classes

    return { classesTable }
}
