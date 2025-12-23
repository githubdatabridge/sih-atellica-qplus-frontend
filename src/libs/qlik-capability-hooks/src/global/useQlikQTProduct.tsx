import { useState, useCallback } from 'react'

import { useQlikBootstrapContext } from '@libs/qlik-providers'

const useQlikQTProduct = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qlikCapabilityApi } = useQlikBootstrapContext()

    const setQTProduct = useCallback(async () => {
        if (qlikCapabilityApi) {
            try {
                setQAction({ loading: true, qResponse: null, error: null })
                const r = await qlikCapabilityApi.$apiRoot.$apiGlobal.dQTProduct
                setQAction({ loading: false, qResponse: { r }, error: null })
                return r
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
                return null
            }
        }
        return null
    }, [qlikCapabilityApi])

    return { qAction, setQTProduct }
}

export default useQlikQTProduct
