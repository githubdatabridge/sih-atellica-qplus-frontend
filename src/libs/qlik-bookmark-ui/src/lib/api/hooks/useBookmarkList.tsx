import React, { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import PublicIcon from '@mui/icons-material/Group'
import { Box } from '@mui/material'

import { useI18n } from '@libs/common-providers'
import { useAlertContext, AlertType } from '@libs/common-ui'
import { BookmarkResponse } from '@libs/core-models'
import { ColumnTypeEnum, DataTypesEnum, OrderByDirectionEnum } from '@libs/data-grid-ui'
import { useQlikBookmarkContext } from '@libs/qlik-providers'
import { useQlikAppContext } from '@libs/qlik-providers'

import translations from '../constants/translations'

interface IUseBookmarkList {
    bookmarksTableData: {
        crud: {
            read: (
                perPage?: number,
                page?: number,
                searchColumns?: string,
                searchOperator?: string,
                searchQuery?: string,
                orderByColumn?: string,
                orderByOperator?: string,
                filter?: string
            ) => Promise<BookmarkResponse>
        }
        customDeleteClickAction?: (id: number) => Promise<any>
        customActions: any[]
        // eslint-disable-next-line @typescript-eslint/ban-types
        components: {}
        defaults: { orderByDirection: OrderByDirectionEnum; orderByColumn: string }
        columns: (
            | {
                  columnType: ColumnTypeEnum
                  visible: boolean
                  accessor: string
                  isKey: boolean
                  label: string
              }
            | {
                  visible: boolean
                  dataType: DataTypesEnum
                  accessor: string
                  width: string
                  filterOperator?: string[]
                  label: string
              }
        )[]
    }
}

const useBookmarkList = (
    isSharedWithMe = false,
    scopedToPath = false,
    onRestoreCallback: any
): IUseBookmarkList => {
    const [refreshInMilliseconds, setRefreshInMilliseconds] = useState<number>(0)
    const { qAppMap } = useQlikAppContext()
    const {
        getBookmarks,
        getSharedBookmarksWithMe,
        deleteBookmark,
        getBookmarkById,
        applySelections,
        restoreVariables,
        refreshVariables,
        restoreDockedFields
    } = useQlikBookmarkContext()
    const { showToast } = useAlertContext()
    const navigate = useNavigate()
    const { t } = useI18n()

    const customDeleteBookmark = async (id: number) => {
        try {
            const bookmark = await getBookmarkById(id)
            if (bookmark) {
                for (const item of bookmark.bookmarkItems) {
                    if (item?.qlikState?.qsBookmarkId) {
                        const app = qAppMap.get(item.qlikAppId)
                        await app?.qApi?.$apiBookmark?.remove(item.qlikState.qsBookmarkId)
                    }
                }
                await deleteBookmark(bookmark.id)
                setRefreshInMilliseconds(new Date().valueOf())
                showToast(t(translations.deleteSuccessMsg), AlertType.SUCCESS)
            }
        } catch (error: any) {
            showToast(t(translations.deleteErrorMsg), AlertType.ERROR)
            throw new Error(error)
        }
    }

    const customActionRestore = async (record: any) => {
        let hasVariableToRestore = false
        try {
            const bookmark = await getBookmarkById(record.id)
            if (bookmark) {
                if (bookmark.meta?.dockedFields && bookmark?.meta?.dockedFields.length > 0) {
                    restoreDockedFields(bookmark?.meta?.dockedFields)
                }

                for (const item of bookmark.bookmarkItems) {
                    if (item?.qlikState?.qsBookmarkId) {
                        const app = qAppMap.get(item.qlikAppId)
                        await app?.qApi?.$apiBookmark?.apply(item.qlikState.qsBookmarkId)
                    } else {
                        if (item.qlikState?.selections && item.qlikState?.selections.length > 0) {
                            await applySelections(item.qlikAppId, item.qlikState.selections)
                        }
                    }
                    if (
                        item.qlikState?.meta?.variables &&
                        item.qlikState?.meta?.variables.length > 0
                    ) {
                        hasVariableToRestore = true
                        await restoreVariables(item.qlikAppId, item.qlikState.meta.variables)
                    }
                }

                if (hasVariableToRestore) refreshVariables()
                if (bookmark?.path && bookmark.path !== '/') {
                    const searchParams = bookmark?.meta?.search ? `${bookmark?.meta?.search}` : ''
                    navigate(`${bookmark.path}${searchParams}`)
                }
                if (onRestoreCallback) onRestoreCallback()
                showToast(t(translations.restoreSuccessMsg), AlertType.SUCCESS)
            }
        } catch (error: any) {
            showToast(t(translations.restoreErrorMsg), AlertType.ERROR)
            throw new Error(error)
        }
    }

    const bookmarksTableData = {
        crud: {
            read: isSharedWithMe ? getSharedBookmarksWithMe : getBookmarks
        },
        refreshTimestamp: refreshInMilliseconds,
        customDeleteClickAction: isSharedWithMe ? undefined : customDeleteBookmark,
        customActions: [
            { label: t(translations.gridActionRestore), handleOnClickCallback: customActionRestore }
        ],
        columns: [
            {
                accessor: 'id',
                label: t(translations.gridColumnId),
                dataType: DataTypesEnum.INTEGER,
                columnType: ColumnTypeEnum.CRUD,
                isKey: true,
                sortable: false,
                visible: false,
                width: '10%'
            },
            {
                accessor: 'name',
                label: t(translations.gridColumnName),
                dataType: DataTypesEnum.STRING,
                sortable: false,
                visible: true,
                filterOperator: ['eq', 'not', 'like'],
                searchable: true,
                width: isSharedWithMe ? '30%' : '50%'
            },
            {
                accessor: 'isPublic',
                label: t(translations.gridColumnIsPublic),
                dataType: DataTypesEnum.BOOLEAN,
                sortable: false,
                visible: isSharedWithMe,
                filterOperator: ['eq'],
                searchable: false,
                width: '10%'
            },
            {
                accessor: 'user',
                label: t(translations.gridColumnCreatedBy),
                dataType: DataTypesEnum.STRING,
                sortable: false,
                visible: isSharedWithMe,
                searchable: false,
                width: '20%'
            },

            {
                accessor: 'createdAt',
                label: t(translations.gridColumnCreatedAt),
                dataType: DataTypesEnum.DATE,
                filterOperator: ['eq', 'lt', 'gt', 'lte', 'gte', 'not'],
                sortable: true,
                visible: true,
                width: isSharedWithMe ? '20%' : '30%'
            }
        ],
        components: {
            isPublic: (_: any, row: any) => {
                return (
                    row?.isPublic && (
                        <Box width="100%">
                            <PublicIcon />
                        </Box>
                    )
                )
            },
            user: (_: any, row: any) => {
                return row?.user && isSharedWithMe && <Box width="100%">{row?.user?.name}</Box>
            }
        },
        defaults: {
            orderByColumn: 'createdAt',
            orderByDirection: OrderByDirectionEnum.DESC
        }
    }

    return { bookmarksTableData }
}

export default useBookmarkList
