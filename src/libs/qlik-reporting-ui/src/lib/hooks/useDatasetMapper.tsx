import { useState, useCallback } from 'react'

import { useI18n } from '@libs/common-providers'

const useDatasetMapper = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { t } = useI18n()

    const setDatasetMapper = useCallback(
        (data: any, masterData: any, shouldOverwriteLabel = true) => {
            const mappedData = []
            data.forEach(element => {
                const item = masterData?.find(md => md.qLibraryId === element.qId)
                if (item) {
                    if (element.label && shouldOverwriteLabel) item.label = t(element.label)
                    else item.label = item?.label || item?.fieldDef || item?.title
                    mappedData.push(item)
                }
            })

            setQAction({ loading: false, qResponse: { mappedData }, error: null })
            return mappedData
        },
        []
    )

    return { qAction, setDatasetMapper }
}

export default useDatasetMapper
