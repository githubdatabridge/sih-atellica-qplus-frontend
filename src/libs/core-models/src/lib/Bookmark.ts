import { SocialUser } from '@libs/common-models'
import { QFieldFilter } from '@libs/qlik-models'

import { BaseOperators, BasePagination } from './Base'

export type BookmarkSelection = {
    fieldName: string
    values: any[]
}

export type BookmarkVariable = {
    name: string
    qNum?: number
    qText?: string
}

export type BookmarkStateMeta = {
    variables?: BookmarkVariable[]
}

export type BookmarkMeta = {
    dockedFields?: QFieldFilter[]
    search?: any
}

export type BookmarkState = {
    id?: number
    qsBookmarkId?: string
    qsSelectionHash?: number
    selections?: BookmarkSelection[]
    meta?: BookmarkStateMeta
    createdAt?: string
    updatedAt?: string
    deletedAt?: string
}

export type BookmarkItem = {
    id?: number
    bookmarkId?: number
    qlikStateId?: number
    qlikAppId: string
    qlikState?: BookmarkState
    createdAt?: string
    updatedAt?: string
}

export type BookmarkData = {
    id: number
    name: string
    path?: string
    appUserId: string
    tenantId: string
    appId: string
    customerId: string
    isPublic?: boolean
    meta?: BookmarkMeta
    bookmarkItems: BookmarkItem[]
    user?: SocialUser
    createdAt?: string
    updatedAt?: string
    deletedAt?: string
}

export type BookmarkPayload = {
    name: string
    path?: string
    meta?: BookmarkMeta
    bookmarkItems?: BookmarkItem[]
}

export type BookmarkShare = {
    appUserId: string
    name: string
    email: string
}

export interface ShareBookmarkPayload {
    appUserIds: string[]
}

export type BookmarkResponse = {
    pagination: BasePagination
    data: BookmarkData[]
    operators: BaseOperators
}

export class Bookmark {
    id?: number
    name: string
    path?: string
    appUserId: string
    tenantId: string
    appId: string
    customerId: string
    bookmarkItems: BookmarkItem[]
    createdAt: string
    updatedAt: string
    deletedAt: string

    constructor(bookmark: Bookmark) {
        this.id = bookmark.id
        this.appUserId = bookmark.appUserId
        this.name = bookmark.name
        this.path = bookmark.path
        this.appUserId = bookmark.appUserId
        this.tenantId = bookmark.tenantId
        this.appId = bookmark.appId
        this.bookmarkItems = bookmark.bookmarkItems
        this.customerId = bookmark.customerId
        this.createdAt = bookmark.createdAt
        this.updatedAt = bookmark.updatedAt
        this.deletedAt = bookmark.deletedAt
    }
}
