import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

export const useQlikAppLayout = () => {
    const [qAction, setQAction] = useState<any>({
        loading: false,
        qResponse: null,
        error: null
    })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setAppLayout = useCallback(
        async (callback: any, qlikAppId?: string) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)

            try {
                setQAction({ loading: true, qResponse: null, error: null })
                if (qApp?.qApi) {
                    r = await qApp?.qApi?.getAppLayout(callback)
                }
                setQAction({ loading: false, qResponse: { r }, error: null })
                return r
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setAppLayout }
}

export default useQlikAppLayout
