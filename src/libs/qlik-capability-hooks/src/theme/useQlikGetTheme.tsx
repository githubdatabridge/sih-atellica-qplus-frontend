import { useState, useCallback } from 'react'

import { useQlikBootstrapContext } from '@libs/qlik-providers'

const useQlikGetTheme = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qlikCapabilityApi } = useQlikBootstrapContext()

    const setGetTheme = useCallback(
        async (id: string) => {
            try {
                const r = await qlikCapabilityApi.$apiRoot.$apiTheme?.get(id)
                await setQAction({ loading: false, qResponse: r, error: null })
                return r
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
                return null
            }
        },
        [qlikCapabilityApi.$apiRoot.$apiTheme]
    )

    return { qAction, setGetTheme }
}

export default useQlikGetTheme
