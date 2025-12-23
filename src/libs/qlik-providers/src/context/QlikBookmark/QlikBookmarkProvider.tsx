import React, { FC, ReactNode, useCallback, useState } from 'react'

import { useLocation } from 'react-router-dom'
import { useMount } from 'react-use'

import { useAuthContext } from '@libs/common-providers'
import { AlertType, useAlertContext } from '@libs/common-ui'
import {
    BookmarkData,
    BookmarkPayload,
    BookmarkSelection,
    BookmarkShare,
    BookmarkVariable,
    ShareBookmarkPayload
} from '@libs/core-models'
import { bookmarkService } from '@libs/core-services'
import { QFieldFilter } from '@libs/qlik-models'

import { useQlikAppContext } from '../QlikApp/QlikAppContext'
import { useQlikSelectionContext } from '../QlikSelection/QlikSelectionContext'
import {
    QBookmarkVariable,
    QlikBookmarkContext,
    QlikBookmarkContextType
} from './QlikBookmarkContext'

interface Props {
    value?: QlikBookmarkContextType
    children: ReactNode
}

const QlikBookmarkProvider: FC<Props> = ({ value = {}, children }) => {
    const [animation, setIsAnimation] = useState<boolean>(false)
    const [qBookmarkList, setBookmarkList] = useState<BookmarkData[]>([])
    const [qBookmarkVariableMap, setBookmarkVariableMap] = useState<
        Map<string, QBookmarkVariable[]>
    >(new Map())
    const [qBookmarkCount, setBookmarkCount] = useState<number>(0)
    const [qBookmarkScopeToPath, setBookmarkScopeToPath] = useState<boolean>(false)
    const [qBookmarkRefreshVariable, setBookmarkVariableRefresh] = useState<number>(0)
    const [qBookmarkPublicCount, setBookmarkPublicCount] = useState<number>(0)
    const { qAppMap } = useQlikAppContext()
    const { qGlobalDockedFields, setDockedFields } = useQlikSelectionContext()
    const { showToast } = useAlertContext()
    const { appUser } = useAuthContext()
    const { pathname } = useLocation()

    const setAnimation = useCallback((animation: boolean) => {
        setIsAnimation(animation)
    }, [])

    const setBookmarkContext = useCallback((qBookmarkScopeToPath: boolean) => {
        setBookmarkScopeToPath(qBookmarkScopeToPath)
    }, [])

    const getBookmarks = useCallback(
        async (
            perPage = 10,
            page = 1,
            searchColumns?: string,
            searchOperator?: string,
            searchQuery?: string,
            orderByColumn = 'createdAt',
            orderByOperator = 'desc',
            filter?: string
        ) => {
            let r = null
            try {
                r = await bookmarkService.getBookmarks(
                    perPage,
                    page,
                    searchColumns,
                    searchOperator,
                    searchQuery,
                    orderByColumn,
                    orderByOperator,
                    filter,
                    appUser.appUserId,
                    false,
                    qBookmarkScopeToPath ? pathname : ''
                )
                return r
            } catch (error: any) {
                showToast('Error during bookmark retrieval', AlertType.ERROR)
                throw new Error(error)
            }
        },
        [appUser.appUserId, pathname, qBookmarkScopeToPath, showToast]
    )

    const getPublicBookmarks = useCallback(
        async (
            perPage = 10,
            page = 1,
            searchColumns?: string,
            searchOperator?: string,
            searchQuery?: string,
            orderByColumn = 'createdAt',
            orderByOperator = 'desc',
            filter?: string
        ) => {
            let r = null
            try {
                r = await bookmarkService.getBookmarks(
                    perPage,
                    page,
                    searchColumns,
                    searchOperator,
                    searchQuery,
                    orderByColumn,
                    orderByOperator,
                    filter,
                    appUser.appUserId,
                    false,
                    qBookmarkScopeToPath ? pathname : ''
                )
                return r
            } catch (error: any) {
                showToast('Error during bookmark retrieval', AlertType.ERROR)
                throw new Error(error)
            }
        },
        [appUser.appUserId, pathname, qBookmarkScopeToPath, showToast]
    )

    const getSharedBookmarksWithMe = useCallback(
        async (
            perPage = 10,
            page = 1,
            searchColumns?: string,
            searchOperator?: string,
            searchQuery?: string,
            orderByColumn = 'createdAt',
            orderByOperator = 'desc',
            filter?: string
        ) => {
            let r = null
            try {
                r = await bookmarkService.getBookmarks(
                    perPage,
                    page,
                    searchColumns,
                    searchOperator,
                    searchQuery,
                    orderByColumn,
                    orderByOperator,
                    filter,
                    appUser.appUserId,
                    true,
                    qBookmarkScopeToPath ? pathname : ''
                )
                return r
            } catch (error: any) {
                showToast('Error during bookmark retrieval', AlertType.ERROR)
                throw new Error(error)
            }
        },
        [appUser.appUserId, pathname, qBookmarkScopeToPath, showToast]
    )

    const loadBookmarks = useCallback(async () => {
        const publicBookmarks = []
        const b = await getBookmarks(1000)

        if (b.data && b?.data?.length > 0) {
            for (const bookmark of b.data) {
                const filteredBookmarks = bookmark.bookmarkItems.filter(
                    b => !b.qlikState?.qsBookmarkId
                )
                // eslint-disable-next-line no-empty-pattern
                for (const f of filteredBookmarks) {
                    publicBookmarks.push(f)
                }
            }
            setBookmarkCount(b.pagination.total)
            setBookmarkPublicCount(publicBookmarks.length)
            setBookmarkList(b.data)
        }
    }, [getBookmarks])

    const createBookmark = useCallback(
        async (payload: BookmarkPayload, isWithLayout = false) => {
            let r = null

            try {
                if (isWithLayout) {
                    for (const item of payload.bookmarkItems) {
                        const qVariables = []
                        const app = qAppMap.get(item.qlikAppId)
                        const variables = qBookmarkVariableMap.get(item.qlikAppId) || []
                        for (const variable of variables) {
                            const v = await app.qApi.$apiVariable.getByName(variable.name)
                            qVariables.push({
                                name: variable.name,
                                qNum: v?.layout?.qNum,
                                qText: v?.layout?.qText
                            })
                        }
                        item.qlikState.meta.variables = qVariables
                    }

                    payload.meta = {
                        ...payload?.meta,
                        dockedFields: [...(qGlobalDockedFields ?? [])]
                    }
                }
                r = await bookmarkService.createBookmark(payload)
                showToast('Bookmark created successfully', AlertType.SUCCESS)
                return r
            } catch (error: any) {
                showToast('Error during bookmark creation', AlertType.ERROR)
                throw new Error(error)
            } finally {
                // We do not need to wait on the re-fetching of the bookmarks
                loadBookmarks()
            }
        },
        [loadBookmarks, qAppMap, qBookmarkVariableMap, qGlobalDockedFields, showToast]
    )

    const updateBookmark = useCallback(
        async (id: number, payload: BookmarkPayload) => {
            let r = null
            try {
                r = await bookmarkService.updateBookmark(id, payload)
                showToast('Bookmark updated successfully', AlertType.SUCCESS)
                return r
            } catch (error: any) {
                showToast('Error during bookmark creation', AlertType.ERROR)
                throw new Error(error)
            }
        },
        [showToast]
    )

    const shareBookmark = useCallback(
        async (id: number, payload: ShareBookmarkPayload) => {
            let r = null
            try {
                r = await bookmarkService.shareBookmark(id, payload)
                showToast('Bookmark shared successfully', AlertType.SUCCESS)
                return r
            } catch (error: any) {
                showToast('Error during bookmark sharing', AlertType.ERROR)
                throw new Error(error)
            }
        },
        [showToast]
    )

    const unShareBookmark = useCallback(async (id: number, payload: ShareBookmarkPayload) => {
        try {
            await bookmarkService.unShareBookmark(id, payload)
        } catch (error) {
            console.log('Qplus Error', error)
            throw new Error(error)
        }
    }, [])

    const deleteBookmark = useCallback(
        async (id: number, cascade = true) => {
            let r = null
            try {
                r = await bookmarkService.deleteBookmark(id)
                showToast('Bookmark deleted successfully', AlertType.SUCCESS)
                return r
            } catch (error: any) {
                showToast('Error during bookmark creation', AlertType.ERROR)
                throw new Error(error)
            } finally {
                await loadBookmarks()
            }
        },
        [loadBookmarks, showToast]
    )

    const getBookmarkById = useCallback(
        async (id: number) => {
            try {
                return await bookmarkService.getBookmarkById(id)
            } catch (error: any) {
                if (error?.status !== 404)
                    showToast('Error during bookmark retrieval', AlertType.ERROR)
                throw new Error(error)
            }
        },
        [showToast]
    )

    const getSharedUsersByBookmarkId = useCallback(
        async (id: number): Promise<BookmarkShare[]> => {
            try {
                return await bookmarkService.getSharedUsersByBookmarkId(id)
            } catch (error: any) {
                console.log('Error', error)
                if (error?.status !== 404)
                    showToast('Error during bookmark retrieval', AlertType.ERROR)
                throw new Error(error)
            }
        },
        [showToast]
    )

    const applySelections = useCallback(
        async (qAppId: string, qSelections: BookmarkSelection[]) => {
            try {
                const app = qAppMap.get(qAppId)
                if (app) {
                    for (const selection of qSelections) {
                        await app.qApi?.selectFieldValues(selection.fieldName, selection.values)
                    }
                }
                console.log('Bookmark', qAppId, qSelections)
            } catch (error: any) {
                showToast('Error during bookmark restoring', AlertType.ERROR)
                throw new Error(error)
            }
        },
        [qAppMap, showToast]
    )

    const restoreVariables = useCallback(
        async (qAppId: string, qVariables: BookmarkVariable[]) => {
            try {
                const app = qAppMap.get(qAppId)
                if (app) {
                    for (const variable of qVariables) {
                        if (variable?.qNum && !isNaN(variable.qNum)) {
                            await app.qApi.$apiVariable.setNumValue(variable.name, variable.qNum)
                        } else {
                            if (variable?.qText)
                                await app.qApi.$apiVariable.setStringValue(
                                    variable.name,
                                    variable.qText
                                )
                        }
                    }
                }
            } catch (error: any) {
                showToast('Error during bookmark variable restoring', AlertType.ERROR)
                throw new Error(error)
            }
        },
        [qAppMap, showToast]
    )

    const restoreDockedFields = useCallback(async (dockedFields: QFieldFilter[]) => {
        setDockedFields(dockedFields)
    }, [])

    const refreshVariables = useCallback(() => {
        setBookmarkVariableRefresh(new Date().valueOf())
    }, [])

    const subscribe = useCallback(
        async (qAppId: string, name: string) => {
            const qVariablesMap = new Map(qBookmarkVariableMap)
            const qOldVariables = qVariablesMap.get(qAppId) || []
            const qNewVariables = [...qOldVariables]
            qNewVariables.push({ name, content: '' })
            qVariablesMap.set(qAppId, qNewVariables)
            setBookmarkVariableMap(qVariablesMap)
        },
        [qBookmarkVariableMap]
    )

    const unSubscribe = useCallback(
        async (qAppId: string, name: string) => {
            const qVariablesMap = new Map(qBookmarkVariableMap)
            const qOldVariables = qVariablesMap.get(qAppId) || []
            const qNewVariables = [...qOldVariables]
            qNewVariables.filter(v => {
                return v.name !== name
            })
            qVariablesMap.set(qAppId, qNewVariables)
            setBookmarkVariableMap(qVariablesMap)
        },
        [qBookmarkVariableMap]
    )

    useMount(async () => {
        loadBookmarks()
    })

    return (
        <QlikBookmarkContext.Provider
            value={{
                animation,
                qBookmarkCount,
                qBookmarkPublicCount,
                qBookmarkList,
                qBookmarkVariableMap,
                qBookmarkRefreshVariable,
                qBookmarkScopeToPath,
                setAnimation,
                setBookmarkContext,
                createBookmark,
                updateBookmark,
                deleteBookmark,
                getBookmarks,
                getPublicBookmarks,
                getSharedBookmarksWithMe,
                getBookmarkById,
                getSharedUsersByBookmarkId,
                shareBookmark,
                unShareBookmark,
                applySelections,
                restoreVariables,
                restoreDockedFields,
                refreshVariables,
                subscribe,
                unSubscribe,
                ...value
            }}>
            {children}
        </QlikBookmarkContext.Provider>
    )
}

export default QlikBookmarkProvider
