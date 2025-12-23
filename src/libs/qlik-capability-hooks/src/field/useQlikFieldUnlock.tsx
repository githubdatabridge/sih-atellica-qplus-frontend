import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikFieldUnLock = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setFieldUnlock = useCallback(
        async (fieldName: string, qlikAppId?: string) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    const f = await qApp?.qApi?.getField(fieldName)
                    if (f) r = await f.$apiField.unlock()
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
    return { qAction, setFieldUnlock }
}

export default useQlikFieldUnLock
