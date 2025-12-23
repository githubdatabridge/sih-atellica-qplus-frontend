import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikFieldSelect = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setFieldSelect = useCallback(
        async (
            fieldName: string,
            values: any,
            qlikAppId?: string,
            toggle = false,
            softLock = true
        ) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })

                    const v = values.map(x => {
                        return parseInt(x, 10)
                    })
                    const f = await qApp?.qApi?.getField(fieldName)
                    if (f) r = await f.$apiField.select(v, toggle, softLock)

                    setQAction({ loading: false, qResponse: r, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setFieldSelect }
}

export default useQlikFieldSelect
