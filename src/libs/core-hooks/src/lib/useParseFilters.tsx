import { useState, useCallback } from 'react'

import { ReportDimensions, ReportFilters } from '@libs/core-models'
import { QFieldFilter } from '@libs/qlik-models'

const useParseFilters = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })

    const setParseFilters = useCallback(
        (
            sFilters: string[],
            dimensions: ReportDimensions[],
            defaultFilters: QFieldFilter[],
            isFixed = false
        ): ReportFilters[] => {
            const filters: ReportFilters[] = []
            for (const d of defaultFilters) {
                if (d.isFixed) {
                    filters.push(d)
                }
            }
            for (let i = 0; i < sFilters?.length; i++) {
                for (const masterDim of dimensions) {
                    if (
                        masterDim.qLibraryId === sFilters[i] ||
                        masterDim.qFieldName === sFilters[i]
                    )
                        filters.push({
                            id: masterDim.qLibraryId,
                            qAppId: masterDim.qAppId,
                            qLibraryId: masterDim.qLibraryId,
                            qFieldName: masterDim.fieldDef,
                            label: masterDim.label,
                            type: masterDim.type,
                            tags: masterDim.tags,
                            isDocked: true,
                            isFixed,
                            toggle: false,
                            softLock: true,
                            rank: i + 1
                        })
                }
            }
            setQAction({ loading: false, qResponse: { filters }, error: null })
            return filters
        },
        []
    )

    return { qAction, setParseFilters }
}

export default useParseFilters
