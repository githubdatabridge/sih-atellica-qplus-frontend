import React, { FC } from 'react'

import { useTheme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { DataGridApiTable } from '@libs/data-grid-ui'

import useQlikBookmarkList from '../../hooks/useBookmarkList'
import { TQlikApiBookmarkClasses } from '../../types'

const useStyles = makeStyles()({
    tableHeader: {
        fontStyle: 'italic'
    },
    tableCell: {}
})

interface IBookmarkTableProps {
    isSharedWithMe?: boolean
    scopedToPath?: boolean
    classNames?: TQlikApiBookmarkClasses
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    onRestoreCallback?: () => void
}

const BookmarkTable: FC<IBookmarkTableProps> = React.memo(
    ({
        isSharedWithMe = false,
        scopedToPath = false,
        color = 'secondary',
        classNames,
        onRestoreCallback
    }) => {
        const { bookmarksTableData } = useQlikBookmarkList(
            isSharedWithMe,
            scopedToPath,
            onRestoreCallback
        )

        const theme = useTheme()
        const { classes } = useStyles()

        return (
            <DataGridApiTable
                isCellWithBorder={true}
                borderColor={theme.palette.divider}
                rowsPerPage={5}
                data={bookmarksTableData}
                height={490}
                color={color}
                classNames={{
                    tableCellHeader: `${classes.tableHeader} ${classNames?.tableHeader}`,
                    tableCell: `${classes.tableCell} ${classNames?.tableCell}`
                }}
            />
        )
    }
)

export default BookmarkTable
