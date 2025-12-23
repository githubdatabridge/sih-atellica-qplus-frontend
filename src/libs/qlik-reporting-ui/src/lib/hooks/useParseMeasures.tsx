import { useState, useCallback } from 'react'

import { ReportMeasures } from '@libs/core-models'

const useParseMeasures = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })

    const setParseMeasures = useCallback(
        (sMeasures: string[], measures: ReportMeasures[]): ReportMeasures[] => {
            const mArray = []
            for (const sMeasure of sMeasures) {
                for (const masterMeasure of measures) {
                    if (sMeasure === masterMeasure.qLibraryId) {
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

            setQAction({ loading: false, qResponse: { mArray }, error: null })
            return mArray
        },
        []
    )

    return { qAction, setParseMeasures }
}

export default useParseMeasures
