import React, { FC, useState, useEffect, useCallback, useMemo } from 'react'

import { Box, CircularProgress } from '@mui/material'

import { useI18n } from '@libs/common-providers'
import { useAlertContext, AlertType } from '@libs/common-ui'
import { DataGridClientTable, HeadCell } from '@libs/data-grid-ui'
import {
    useQlikApplyBookmark,
    useQlikGetBookmarks,
    useQlikRemoveBookmark
} from '@libs/qlik-capability-hooks'
import { QBookmark } from '@libs/qlik-models'

import translations from '../../constants/translations'
import { TQlikBookmarkClasses } from '../../types'
import { ColumnActionsList } from '../menu/ActionList'

interface IBookmarkTableProps {
    qlikAppId: string
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    classNames?: TQlikBookmarkClasses
    onRestoreCallback: () => void
}

const BookmarkTable: FC<IBookmarkTableProps> = React.memo(
    ({ qlikAppId, color = 'secondary', classNames, onRestoreCallback }) => {
        const [isLoading, setIsLoading] = useState<boolean>(true)
        const [qAppId, setQAppId] = useState<string>('')
        const [recordId, setRecordId] = useState<string>('')
        const [data, setData] = useState<QBookmark[]>([])

        const { setGetBookmarkList } = useQlikGetBookmarks()
        const { setApplyBookmark } = useQlikApplyBookmark()
        const { setRemoveBookmark } = useQlikRemoveBookmark()
        const { showToast } = useAlertContext()
        const { t } = useI18n()

        const columns: HeadCell<QBookmark>[] = useMemo(() => {
            return [
                { id: 'id', label: t(translations.id), minWidth: 100, hide: true },
                { id: 'name', label: t(translations.name), minWidth: 300 },
                { id: 'description', label: t(translations.description), minWidth: 400 },
                {
                    id: 'actions',
                    label: t(translations.actions),
                    minWidth: 50,
                    render: value => renderActions(value)
                }
            ]
        }, [])

        const options = useMemo(() => {
            return [
                { value: 'name', label: t(translations.name) },
                { value: 'description', label: t(translations.description) }
            ]
        }, [])

        const fetchData = useCallback(async () => {
            try {
                const data = (await setGetBookmarkList(qAppId)) as QBookmark[]
                setData(data || [])
            } finally {
                setIsLoading(false)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [qAppId])

        useEffect(() => {
            setQAppId(qlikAppId)
        }, [qlikAppId])

        useEffect(() => {
            if (qAppId) {
                fetchData()
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [qAppId])

        const handleListItemLoadingClick = (id: string) => {
            setRecordId(id)
        }

        const handleRestoreBookmark = async (value: QBookmark) => {
            try {
                if (value) {
                    await setApplyBookmark(value.id, qAppId)
                    showToast(t(translations.restoreSuccessMsg), AlertType.SUCCESS)
                    onRestoreCallback()
                }
            } catch (error) {
                showToast(t(translations.restoreErrorMsg), AlertType.ERROR)
            }
        }

        const handleDeleteBookmark = async (value: QBookmark) => {
            try {
                if (value) {
                    setIsLoading(true)
                    await setRemoveBookmark(value.id, qAppId)
                    showToast(t(translations.deleteSuccessMsg), AlertType.SUCCESS)
                    await fetchData()
                    setIsLoading(false)
                }
            } catch (error) {
                showToast(t(translations.deleteErrorMsg), AlertType.ERROR)
            }
        }

        const renderActions = (row: QBookmark) => {
            const actionList = [
                { label: t(translations.restore), handleOnClickCallback: handleRestoreBookmark },
                { label: t(translations.delete), handleOnClickCallback: handleDeleteBookmark }
            ]
            return recordId === row.id ? (
                <Box p={1}>
                    <CircularProgress color={color} size={20} />
                </Box>
            ) : (
                <ColumnActionsList
                    record={row}
                    handleListItemLoadingCallback={handleListItemLoadingClick}
                    index={row.id}
                    actions={actionList}
                />
            )
        }

        return (
            <DataGridClientTable
                height={520}
                isDataLoading={isLoading}
                data={data}
                searchOptions={options}
                columns={columns}
                classNames={classNames.table}
            />
        )
    }
)

export default BookmarkTable
