import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikObject = () => {
    const [qAction, setQAction] = useState<any>({
        loading: false,
        qResponse: null,
        error: null
    })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setObject = useCallback(
        async (elemId: string, id: string, options: any, qlikAppId?: string) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })

                    r = await qApp?.qApi?.getObject(elemId, id, options)

                    setQAction({ loading: false, qResponse: { r }, error: null })

                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setObject }
}

export default useQlikObject
