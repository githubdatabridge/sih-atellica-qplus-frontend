import { useState, useCallback } from 'react'

import { useQlikBootstrapContext } from '@libs/qlik-providers'

const useQlikGetAppliedTheme = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qlikCapabilityApi } = useQlikBootstrapContext()

    const setGetAppliedTheme = useCallback(async () => {
        try {
            const r = await qlikCapabilityApi.$apiRoot.$apiTheme?.getApplied()
            await setQAction({ loading: false, qResponse: r, error: null })
            return r
        } catch (error) {
            setQAction({ loading: false, qResponse: null, error: error })
            return null
        }
    }, [qlikCapabilityApi.$apiRoot.$apiTheme])

    return { qAction, setGetAppliedTheme }
}

export default useQlikGetAppliedTheme
