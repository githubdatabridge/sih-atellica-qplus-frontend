import { useContext, createContext } from 'react'

import {
    BookmarkSelection,
    BookmarkPayload,
    BookmarkData,
    BookmarkResponse,
    BookmarkShare,
    ShareBookmarkPayload,
    BookmarkVariable
} from '@libs/core-models'
import { QFieldFilter } from '@libs/qlik-models'

export type QBookmarkVariable = {
    name: string
    content?: any
}

export type QlikBookmarkContextType = {
    animation?: boolean | null
    qBookmarkList?: BookmarkData[]
    qBookmarkVariableMap?: Map<string, QBookmarkVariable[]>
    qBookmarkCount?: number
    qBookmarkPublicCount?: number
    qBookmarkRefreshVariable?: number
    qBookmarkScopeToPath?: boolean
    createBookmark: (payload: BookmarkPayload, isWithLayout?: boolean) => Promise<BookmarkData>
    updateBookmark: (id: number, payload: BookmarkPayload) => Promise<BookmarkData>
    shareBookmark: (id: number, payload: ShareBookmarkPayload) => Promise<any>
    unShareBookmark: (id: number, payload: ShareBookmarkPayload) => Promise<any>
    deleteBookmark: (id: number, cascade?: boolean) => Promise<any>
    getBookmarks: () => Promise<BookmarkResponse>
    getSharedBookmarksWithMe: () => Promise<BookmarkResponse>
    getBookmarkById: (id: number) => Promise<BookmarkData>
    getSharedUsersByBookmarkId: (id: number) => Promise<BookmarkShare[]>
    getPublicBookmarks: () => Promise<BookmarkResponse>
    applySelections: (qAppId: string, qSelections: BookmarkSelection[]) => Promise<any>
    restoreVariables: (qAppId: string, qVariables: BookmarkVariable[]) => Promise<any>
    refreshVariables: () => void
    restoreDockedFields: (dockedFields: QFieldFilter[]) => void
    subscribe: (qAppId: string, name: string) => Promise<any>
    unSubscribe: (qAppId: string, name: string) => Promise<any>
    setBookmarkContext: (scopeToPath: boolean) => void
    setAnimation: (isLoading: boolean) => void
}

export const QlikBookmarkContext = createContext<QlikBookmarkContextType>({
    qBookmarkList: [],
    qBookmarkVariableMap: new Map<string, QBookmarkVariable[]>(),
    qBookmarkCount: 0,
    qBookmarkPublicCount: 0,
    animation: false,
    qBookmarkRefreshVariable: 0,
    qBookmarkScopeToPath: false,
    setAnimation: _animation => {
        throw new Error('setAnimation() must be used within a QlikBookmarkContext')
    },
    createBookmark: (_payload, _isWithLayout) => {
        throw new Error('createBookmark() must be used within a QlikBookmarkContext')
    },
    updateBookmark: (_id: number, _payload: BookmarkPayload) => {
        throw new Error('updateBookmark() must be used within a QlikBookmarkContext')
    },
    shareBookmark: (_id: number, _payload: ShareBookmarkPayload) => {
        throw new Error('shareBookmark() must be used within a QlikBookmarkContext')
    },
    unShareBookmark: (_id: number, _payload: ShareBookmarkPayload) => {
        throw new Error('unShareBookmark() must be used within a QlikBookmarkContext')
    },
    deleteBookmark: (_id: number, _cascade?: boolean) => {
        throw new Error('deleteBookmark() must be used within a QlikBookmarkContext')
    },
    getBookmarks: () => {
        throw new Error('getBookmarks() must be used within a QlikBookmarkContext')
    },
    getPublicBookmarks: () => {
        throw new Error('getPublicBookmarks() must be used within a QlikBookmarkContext')
    },
    getSharedBookmarksWithMe: () => {
        throw new Error('getSharedBookmarksWithMe() must be used within a QlikBookmarkContext')
    },
    getBookmarkById: (_id: number) => {
        throw new Error('getBookmarkById() must be used within a QlikBookmarkContext')
    },
    getSharedUsersByBookmarkId: (_id: number) => {
        throw new Error('getSharedUsersByBookmarkId() must be used within a QlikBookmarkContext')
    },
    applySelections: (_appId: string, _selections: BookmarkSelection[]) => {
        throw new Error('applySelections() must be used within a QlikBookmarkContext')
    },
    restoreVariables: (_appId: string, _variables: BookmarkVariable[]) => {
        throw new Error('restoreVariables() must be used within a QlikBookmarkContext')
    },
    refreshVariables: () => {
        throw new Error('refreshVariables() must be used within a QlikBookmarkContext')
    },
    restoreDockedFields: (_dockedFields: QFieldFilter[]) => {
        throw new Error('restoreDockedFields() must be used within a QlikBookmarkContext')
    },
    subscribe: (_appId: string, _name: string) => {
        throw new Error('subscribe() must be used within a QlikBookmarkContext')
    },
    unSubscribe: (_appId: string, _name: string) => {
        throw new Error('unSubscribe() must be used within a QlikBookmarkContext')
    },
    setBookmarkContext: (_scopeToPath: boolean) => {
        throw new Error('setBookmarkContext() must be used within a QlikBookmarkContext')
    }
})

export const useQlikBookmarkContext = () => useContext(QlikBookmarkContext)
