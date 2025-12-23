import { useState, useCallback } from 'react'

import { QMasterVisualization } from '@libs/qlik-models'
import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikGetMasterVisualizations = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setMasterVisualizationList = useCallback(
        async (tags = [], type = null, qlikAppId?: string): Promise<QMasterVisualization[]> => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qMixinsApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qMixinsApi?._qPlusGetMasterVisualizations(
                        qApp?.qApi,
                        tags,
                        type
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

    return { qAction, setMasterVisualizationList }
}

export default useQlikGetMasterVisualizations
