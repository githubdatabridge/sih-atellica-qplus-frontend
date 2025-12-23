import { useState, useCallback } from 'react'

import { QMasterMeasure } from '@libs/qlik-models'
import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikGetMasterMeasure = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setMasterMeasure = useCallback(
        async (qId: string, qlikAppId?: string): Promise<QMasterMeasure> => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qMixinsApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qMixinsApi?._qPlusGetMasterMeasure(
                        qId,
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

    return { qAction, setMasterMeasure }
}

export default useQlikGetMasterMeasure
