import { useState, useCallback } from 'react'

import { QMasterVisualization } from '@libs/qlik-models'
import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikGetVizColumns = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setVizColumns = useCallback(
        async (properties: any, qlikAppId?: string): Promise<QMasterVisualization[]> => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qMixinsApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qMixinsApi?._qPlusGetVizColumnsByVisualization(properties)

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

    return { qAction, setVizColumns }
}

export default useQlikGetVizColumns
