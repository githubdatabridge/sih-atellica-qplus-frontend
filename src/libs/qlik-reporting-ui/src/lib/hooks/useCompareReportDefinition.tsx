import { useState, useCallback } from 'react'

import { ReportDataset, ReportMeasures, ReportDimensions } from '@libs/core-models'

const useCompareReportDefinition = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })

    const setCompareReportDefinition = useCallback(
        (
            dataset: ReportDataset,
            vizType: string,
            dimensions: ReportDimensions[],
            measures: ReportMeasures[],
            options?: any,
            filters?: any[]
        ): any => {
            const reportDef = {
                dataset,
                vizType,
                dimensions,
                measures,
                options,
                filters
            }

            setQAction({ loading: false, qResponse: JSON.stringify(reportDef), error: null })
            return JSON.stringify(reportDef)
        },
        []
    )

    return { qAction, setCompareReportDefinition }
}

export default useCompareReportDefinition
