import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikGetVisualization = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setVisualization = useCallback(
        async (id: string, qlikAppId?: string) => {
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qVisualizationApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    const r = await qApp.qVisualizationApi.get(id)
                    setQAction({ loading: false, qResponse: r, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setVisualization }
}

export default useQlikGetVisualization
