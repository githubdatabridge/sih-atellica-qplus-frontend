import { useState, useCallback } from 'react'

import { useQlikBootstrapContext } from '@libs/qlik-providers'

const useQlikOpenApp = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qlikCapabilityApi } = useQlikBootstrapContext()

    const setQlikOpenApp = useCallback(
        async (qlikAppId: string, config: any = null) => {
            try {
                const app = qlikCapabilityApi?.$apiRoot.openApp(qlikAppId, config)
                await setQAction({ loading: false, qResponse: app, error: null })
                return app
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
                return null
            }
        },
        [qlikCapabilityApi?.$apiRoot]
    )

    return { qAction, setQlikOpenApp }
}

export default useQlikOpenApp
