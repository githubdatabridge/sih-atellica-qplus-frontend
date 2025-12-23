import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikStringExpression = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setStringExpression = useCallback(
        async (id: string, value: string, callback: any, qlikAppId?: string) => {
            let r: any[] = []

            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qApi?.createGenericObject(
                        {
                            [id]: {
                                qStringExpression: value
                            }
                        },
                        callback
                    )
                    setQAction({ loading: false, qResponse: r, error: null })
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                    return null
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setStringExpression }
}

export default useQlikStringExpression
