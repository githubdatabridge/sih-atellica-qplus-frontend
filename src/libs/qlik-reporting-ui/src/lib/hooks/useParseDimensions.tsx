import { useState, useCallback } from 'react'

import { ReportDimensions } from '@libs/core-models'

const useParseDimensions = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })

    const setParseDimensions = useCallback(
        (sDimensions: string[], dimensions: ReportDimensions[]): ReportDimensions[] => {
            const dArray = []
            for (const sDim of sDimensions) {
                for (const masterDim of dimensions) {
                    if (sDim === masterDim.qLibraryId) {
                        dArray.push(masterDim)
                        break
                    }
                }
            }
            dArray.sort((a, b) => {
                if (a.label < b.label) {
                    return -1
                }
                if (a.label > b.label) {
                    return 1
                }
                return 0
            })

            setQAction({ loading: false, qResponse: { dArray }, error: null })
            return dArray
        },
        []
    )

    return { qAction, setParseDimensions }
}

export default useParseDimensions
