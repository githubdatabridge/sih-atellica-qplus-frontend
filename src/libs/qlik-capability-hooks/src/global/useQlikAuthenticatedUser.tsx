import { useState, useCallback } from 'react'

import { useQlikBootstrapContext } from '@libs/qlik-providers'

const useQlikAuthenticatedUser = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qlikCapabilityApi } = useQlikBootstrapContext()

    const setAuthenticatedUser = useCallback(async () => {
        if (qlikCapabilityApi) {
            try {
                setQAction({ loading: true, qResponse: null, error: null })
                const r = await qlikCapabilityApi.$apiRoot.$apiGlobal.dAuthenticatedUser
                setQAction({ loading: false, qResponse: { r }, error: null })
                return r
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
                return null
            }
        }
        return null
    }, [qlikCapabilityApi])

    return { qAction, setAuthenticatedUser }
}

export default useQlikAuthenticatedUser
