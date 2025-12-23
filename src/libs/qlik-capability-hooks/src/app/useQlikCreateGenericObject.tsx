import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikCreateGenericObject = () => {
    const [qAction, setQAction] = useState<any>({
        loading: false,
        qResponse: null,
        error: null
    })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setGenericObject = useCallback(
        async (def: any, qlikAppId?: string) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })

                    r = await qApp?.qApi?.createGenericObject(def, null)

                    setQAction({ loading: false, qResponse: { r }, error: null })

                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setGenericObject }
}

export default useQlikCreateGenericObject
