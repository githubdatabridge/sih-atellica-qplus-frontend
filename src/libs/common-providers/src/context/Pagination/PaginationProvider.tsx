import React, { ReactNode, useCallback, useState } from 'react'

import { PaginationContext, PaginationState } from './PaginationContext'

type Props = {
    children?: ReactNode
}

export const PaginationProvider: React.FC<Props> = (props: any) => {
    const [pagination, setPaginationData] = useState<PaginationState>({
        isLoadingMore: false,
        hasMore: false,
        page: 1
    })

    const loadMore = useCallback(() => {
        setPaginationData((pagination: any) => ({
            ...pagination,
            page: pagination.page + 1
        }))
    }, [])

    const setPagination = useCallback((paginationData: any) => {
        setPaginationData((paginationState: any) => ({
            ...paginationState,
            ...paginationData
        }))
    }, [])

    const providerValue = {
        ...pagination,
        loadMore,
        setPagination
    }

    return (
        <PaginationContext.Provider value={providerValue}>
            {props.children}
        </PaginationContext.Provider>
    )
}

export default PaginationProvider
