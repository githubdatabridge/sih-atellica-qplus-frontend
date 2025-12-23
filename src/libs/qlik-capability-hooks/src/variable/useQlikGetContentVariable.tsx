import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikGetContentVariable = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setGetContentVariable = useCallback(
        async (variable: string, callback: any, qlikAppId?: string) => {
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    const r = await qApp?.qApi?.$apiVariable.getContent(variable, callback)
                    setQAction({ loading: false, qResponse: r, error: null })
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        [qAppId, qAppMap]
    )

    return { qAction, setGetContentVariable }
}

export default useQlikGetContentVariable
