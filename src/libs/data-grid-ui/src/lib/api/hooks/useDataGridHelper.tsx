import { useCallback } from 'react'

import { ColumnTypeEnum, DataTypesEnum } from '../types'

export const useDataGridHelper = () => {
    const isActiveFilter = (filter: any, el: any) =>
        filter.findIndex((element: any) => element.includes(el)) !== -1

    const getDictionaryFromColumns = useCallback((columns: any[]) => {
        const dictionaryOfSearchableColumns: any = {}
        columns?.map((item: any) => {
            if (item.searchable) {
                return (dictionaryOfSearchableColumns[item.accessor] = item.label)
            }
        })
        return dictionaryOfSearchableColumns
    }, [])

    const getIdentifiersFromSearchableColumns = useCallback((columns: any[]) => {
        return columns?.map((item: any) => item.searchable && `${item.accessor}`).filter(Boolean)
    }, [])

    const getCrudColumns = useCallback((columns: any[]) => {
        return columns
            ?.map(
                (el: any) =>
                    el.columnType === ColumnTypeEnum.CRUD && {
                        type: el.dataType,
                        label: el.label,
                        accessor: el.accessor,
                        lookup: el.lookup,
                        validate: el.validate
                    }
            )
            .filter(Boolean)
    }, [])

    const getSelectedCrudColumns = useCallback((columns: any[]) => {
        return columns
            ?.map(
                (i: any) =>
                    i.columnType && {
                        accessor: i.accessor,
                        columnType: i.columnType,
                        dataType: i.dataType,
                        validate: i.validate
                    }
            )
            .filter(Boolean)
    }, [])

    const setInitStateCrud = (el: any) => {
        let init
        switch (el) {
            case DataTypesEnum.STRING:
                init = ''
                break
            case DataTypesEnum.MULTILINE:
                init = ''
                break
            case DataTypesEnum.INTEGER:
                init = 0
                break
            case DataTypesEnum.DATE:
                init = new Date()
                break
            case DataTypesEnum.BOOLEAN:
                init = false
                break
            case DataTypesEnum.ARRAY:
                init = []
                break
        }
        return init
    }

    const isRowSelected = (rows: any, page: number, key: string) =>
        rows.get(page) ? rows.get(page).indexOf(key) !== -1 : false

    const sortDirection = (accessor: string, orderByColumn: string, orderByOperator: string) =>
        orderByColumn === accessor ? orderByOperator : 'asc'

    const getTableKeyField = (columns: any[]) => {
        return columns
            ?.map(item => item.isKey && `${item.accessor}`)
            .filter(Boolean)
            ?.join('')
    }

    return {
        isActiveFilter,
        isRowSelected,
        sortDirection,
        getDictionaryFromColumns,
        getIdentifiersFromSearchableColumns,
        getCrudColumns,
        getSelectedCrudColumns,
        getTableKeyField,
        setInitStateCrud
    }
}

export default useDataGridHelper
