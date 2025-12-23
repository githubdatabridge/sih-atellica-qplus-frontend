import { useState, useCallback } from 'react'

import { QMasterMeasure } from '@libs/qlik-models'
import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikGetMasterMeasures = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setMasterMeasureList = useCallback(
        async (qlikAppId?: string): Promise<QMasterMeasure[]> => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qMixinsApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qMixinsApi?._qPlusGetMasterMeasures(
                        qApp?.qApi,
                        qApp?.qEnigmaApi
                    )

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

    return { qAction, setMasterMeasureList }
}

export default useQlikGetMasterMeasures
