import { useState, useCallback } from 'react'

import { useQlikBootstrapContext } from '@libs/qlik-providers'

const useQlikProductVersion = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qlikCapabilityApi } = useQlikBootstrapContext()

    const setProductVersion = useCallback(async () => {
        if (qlikCapabilityApi) {
            try {
                setQAction({ loading: true, qResponse: null, error: null })
                const r = await qlikCapabilityApi.$apiRoot.$apiGlobal.dProductVersion
                setQAction({ loading: false, qResponse: { r }, error: null })
                return r
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
                return null
            }
        }
        return null
    }, [qlikCapabilityApi])

    return { qAction, setProductVersion }
}

export default useQlikProductVersion
