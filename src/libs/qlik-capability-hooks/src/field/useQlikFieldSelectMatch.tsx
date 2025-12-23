import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikFieldSelectMatch = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setFieldSelectMatch = useCallback(
        async (fieldName: string, value: any, qlikAppId?: string, softLock = true) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })

                    const f = await qApp?.qApi?.getField(fieldName)
                    if (f) r = await f.$apiField.selectMatch(value, softLock)

                    setQAction({ loading: false, qResponse: r, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setFieldSelectMatch }
}

export default useQlikFieldSelectMatch
