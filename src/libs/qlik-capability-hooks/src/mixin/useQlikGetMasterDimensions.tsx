import { useState, useCallback } from 'react'

import { QMasterDimension } from '@libs/qlik-models'
import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikGetMasterDimensions = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setMasterDimensionList = useCallback(
        async (qlikAppId?: string): Promise<QMasterDimension[]> => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qMixinsApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qMixinsApi?._qPlusGetMasterDimensions(qApp?.qApi)

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

    return { qAction, setMasterDimensionList }
}

export default useQlikGetMasterDimensions
