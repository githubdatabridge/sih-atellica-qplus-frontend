import { useState, useCallback } from 'react'

import { ReportDataset, ReportMeasures } from '@libs/core-models'
import { QMasterMeasure } from '@libs/qlik-models'

const useReloadMeasures = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })

    const setReloadMeasures = useCallback(
        (dataset: ReportDataset, measures: QMasterMeasure[]): ReportMeasures[] => {
            const mArray = []
            if (dataset?.measures) {
                for (const m of dataset.measures) {
                    for (const masterMeasure of measures) {
                        if (m.qLibraryId === masterMeasure.qLibraryId) {
                            mArray.push(masterMeasure)
                            break
                        }
                    }
                }
                mArray.sort((a, b) => {
                    if (a.label < b.label) {
                        return -1
                    }
                    if (a.label > b.label) {
                        return 1
                    }
                    return 0
                })
            }
            setQAction({ loading: false, qResponse: { mArray }, error: null })
            return mArray
        },
        []
    )

    return { qAction, setReloadMeasures }
}

export default useReloadMeasures
