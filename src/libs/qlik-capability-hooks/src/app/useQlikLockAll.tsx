import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikLockAll = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setQlikLockAll = useCallback(
        async (qlikAppId?: string) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qApi?.lockAll()
                    setQAction({ loading: false, qResponse: { r }, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                    return null
                }
            }
            return null
        },
        [qAppId, qAppMap]
    )

    return { qAction, setQlikLockAll }
}

export default useQlikLockAll
