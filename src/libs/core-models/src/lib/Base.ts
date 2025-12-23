export type BasePagination = {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    from: number
    to: number
}

export type BaseOperators = {
    filter: any
    search: any
    orderBy: string
}
