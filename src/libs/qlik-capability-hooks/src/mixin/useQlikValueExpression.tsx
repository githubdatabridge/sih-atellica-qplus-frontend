import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikValueExpression = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setValueExpression = useCallback(
        async (id: string, value: string, callback: any, qlikAppId?: string) => {
            let r: any[] = []
            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qApi?.createGenericObject(
                        {
                            [id]: {
                                qValueExpression: value
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

    return { qAction, setValueExpression }
}

export default useQlikValueExpression
