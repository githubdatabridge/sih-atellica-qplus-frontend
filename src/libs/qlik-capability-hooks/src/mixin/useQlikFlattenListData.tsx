import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikFlattenListData = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setFlattenListData = useCallback(
        (qData: any, qlikAppId?: string) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qMixinsApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = qApp?.qMixinsApi?._qPlusGetFlattenListData(qData)
                    setQAction({ loading: false, qResponse: r, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                    return r
                }
            }
            return r
        },
        [qAppId, qAppMap]
    )

    return { qAction, setFlattenListData }
}

export default useQlikFlattenListData
