import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikDestroySessionObject = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setDestroySessionObject = useCallback(
        async (id: string, qlikAppId?: string) => {
            const qApp = qAppMap.get(qlikAppId || qAppId)
            let r: any

            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qApi.destroySessionObject(id)
                    setQAction({ loading: false, qResponse: r, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                    return null
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setDestroySessionObject }
}

export default useQlikDestroySessionObject
