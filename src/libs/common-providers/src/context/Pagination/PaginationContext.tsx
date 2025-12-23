import React, { useContext } from 'react'

export type PaginationState = {
    isLoadingMore: boolean
    hasMore: boolean
    page: number
}

type PaginationContextType = {
    hasMore: boolean
    page: number
    setPagination: (paginationData: any) => void
    loadMore: () => void
}

export const PaginationContext = React.createContext<PaginationContextType>({
    hasMore: true,
    page: 1,
    setPagination: (_paginationData: any) => {
        throw new Error('setPagination() not implemented')
    },
    loadMore: () => {
        throw new Error('loadMore() not implemented')
    }
})

export const usePaginationContext = (): PaginationContextType => {
    return useContext(PaginationContext)
}
