import { useState, useEffect, useCallback } from 'react'

import { useQixContext } from '../contexts/QixContext'

const useLayout = () => {
    const { engine } = useQixContext()

    const [layout, setLayout] = useState(null)
    const [error, setError] = useState(null)

    const getAppLayout = useCallback(async engine => {
        try {
            const qDoc = await engine.doc

            const appLayout = await qDoc.getAppLayout()
            setLayout({
                appLayout,
                ...appLayout
            })
        } catch (err) {
            setError(err)
        }
    }, [])

    useEffect(() => {
        if (!engine?.doc) return
        getAppLayout(engine)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [engine])

    return {
        ...layout,
        error
    }
}

export default useLayout
