import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikApplyPatch = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setApplyPatch = useCallback(
        async (
            model: any,
            op: string,
            path: string,
            value: any,
            soft = true,
            qlikAppId?: string
        ) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)
            console.log(qlikAppId, qAppId)
            if (qApp?.qMixinsApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qMixinsApi?._qPlusApplyPatch(model, op, path, value, soft)
                    setQAction({ loading: false, qResponse: r, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setApplyPatch }
}

export default useQlikApplyPatch
