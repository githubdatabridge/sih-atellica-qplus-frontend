import {
    BookmarkData,
    BookmarkResponse,
    BookmarkPayload,
    BookmarkShare,
    ShareBookmarkPayload
} from '@libs/core-models'

import { CoreService } from './core'

class BookmarkService {
    async getBookmarks(
        perPage = 10,
        page?: number,
        searchColumns?: string,
        searchOperator?: string,
        searchQuery?: string,
        orderByColumn = 'createdAt',
        orderByOperator?: string,
        filter?: string,
        appUserId?: string,
        isShared = false,
        path = ''
    ): Promise<BookmarkResponse> {
        const r = await CoreService.getApi().get(
            `/bookmarks?perPage=${perPage}&page=${page}${
                searchQuery?.length > 0
                    ? `&search${searchColumns}[${searchOperator}]=${searchQuery}`
                    : ''
            }${orderByColumn?.length > 0 ? `&orderBy[${orderByColumn}][${orderByOperator}]` : ''}${
                isShared
                    ? `&filter[appUserId][not]=${appUserId}`
                    : `&filter[appUserId][eq]=${appUserId}`
            }${path ? `&filter[path][eq]=${path}` : ``}${filter?.length > 0 ? filter : ''}`
        )
        return r
    }

    async getBookmarkById(id: number): Promise<BookmarkData> {
        const response = await CoreService.getApi().get(`/bookmarks/${id}`)
        return response
    }

    async getSharedUsersByBookmarkId(id: number): Promise<BookmarkShare[]> {
        return await CoreService.getApi().get(`/bookmarks/${id}/share`)
    }

    async createBookmark(payload: BookmarkPayload): Promise<BookmarkData> {
        const response = await CoreService.getApi().post('/bookmarks', payload)
        return response.data
    }

    async updateBookmark(id: number, payload: BookmarkPayload): Promise<BookmarkData> {
        const response = await CoreService.getApi().put(`/bookmarks/${id}`, payload)
        return response.data
    }

    async shareBookmark(id: number, payload: ShareBookmarkPayload) {
        return await CoreService.getApi().post(`/bookmarks/${id}/share`, payload)
    }

    async unShareBookmark(id: number, payload: ShareBookmarkPayload) {
        const config = {
            data: {
                ...payload
            }
        }
        await CoreService.getApi().delete(`/bookmarks/${id}/share`, config)
        return
    }

    async deleteBookmark(id: number, cascade = true) {
        return await CoreService.getApi().delete(`/bookmarks/${id}?cascade=${cascade}`)
    }
}

export const bookmarkService = new BookmarkService()
