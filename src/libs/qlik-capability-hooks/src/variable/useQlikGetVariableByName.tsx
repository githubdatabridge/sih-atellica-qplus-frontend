import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikGetVariableByName = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const getVariableByName = useCallback(
        async (name: string, qlikAppId?: string) => {
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    const r = await qApp.qApi?.$apiVariable.getByName(name)
                    setQAction({ loading: false, qResponse: r, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, getVariableByName }
}

export default useQlikGetVariableByName
