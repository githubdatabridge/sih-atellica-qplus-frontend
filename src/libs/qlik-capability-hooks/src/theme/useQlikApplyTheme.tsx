import { useState, useCallback } from 'react'

import { useQlikBootstrapContext } from '@libs/qlik-providers'
import { QlikThemeApi } from '@libs/qlik-services'

const useQlikApplyTheme = (theme: QlikThemeApi) => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qlikCapabilityApi } = useQlikBootstrapContext()

    const setApplyTheme = useCallback(
        async (id: string) => {
            try {
                const r = await qlikCapabilityApi.$apiRoot.$apiTheme?.apply(id)
                await setQAction({ loading: false, qResponse: r, error: null })
                return r
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
                return null
            }
        },
        [qlikCapabilityApi.$apiRoot.$apiTheme]
    )

    return { qAction, setApplyTheme }
}

export default useQlikApplyTheme
