import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikUnAttachSelectionListener = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setUnAttachSelectionListener = useCallback(
        async (callback: any, qlikAppId?: string) => {
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qSelectionApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    const r =
                        await qApp?.qSelectionApi?.$apiSelectionState.unregisterSelectionListener(
                            callback
                        )
                    setQAction({ loading: false, qResponse: r, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setUnAttachSelectionListener }
}

export default useQlikUnAttachSelectionListener
