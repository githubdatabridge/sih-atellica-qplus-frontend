import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikCreateList = () => {
    const [qAction, setQAction] = useState<any>({
        loading: false,
        qResponse: null,
        error: null
    })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setCreateList = useCallback(
        async (def: any, qlikAppId?: string, callback?: any) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qApi?.createList(def, callback)
                    setQAction({ loading: false, qResponse: { r }, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setCreateList }
}

export default useQlikCreateList
