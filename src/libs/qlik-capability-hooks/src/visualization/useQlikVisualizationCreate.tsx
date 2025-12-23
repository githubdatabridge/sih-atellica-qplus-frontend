import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikVisualizationCreate = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setVisualizationCreate = useCallback(
        async (type: string, cols: any[], options: any, qlikAppId?: string) => {
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qVisualizationApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    const r = await qApp.qVisualizationApi.create(type, cols, options)
                    setQAction({ loading: false, qResponse: r, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setVisualizationCreate }
}

export default useQlikVisualizationCreate
