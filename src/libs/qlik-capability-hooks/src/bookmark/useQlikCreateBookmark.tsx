import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikCreateBookmark = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setCreateBookmark = useCallback(
        async (title: string, description: string, qlikAppId?: string) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)

            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    r = await qApp?.qApi?.$apiBookmark.create(title, description)
                    setQAction({ loading: false, qResponse: r, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                    return r
                }
            }
            return r
        },
        [qAppId, qAppMap]
    )

    return { qAction, setCreateBookmark }
}

export default useQlikCreateBookmark
