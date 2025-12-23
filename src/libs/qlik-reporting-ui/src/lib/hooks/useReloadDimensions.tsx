import { useState, useCallback } from 'react'

import { ReportDataset, ReportDimensions } from '@libs/core-models'
import { QMasterDimension } from '@libs/qlik-models'

const useReloadDimensions = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })

    const setReloadDimensions = useCallback(
        (dataset: ReportDataset, dimensions: QMasterDimension[]): ReportDimensions[] => {
            const dArray = []
            if (dataset?.dimensions) {
                for (const dim of dataset.dimensions) {
                    for (const masterDim of dimensions) {
                        if (
                            dim.qLibraryId === masterDim.qLibraryId &&
                            dim.qAppId === masterDim.qAppId
                        ) {
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
            }

            setQAction({ loading: false, qResponse: { dArray }, error: null })
            return dArray
        },
        []
    )

    return { qAction, setReloadDimensions }
}

export default useReloadDimensions
