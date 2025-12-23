import { useState, useEffect, useCallback } from 'react'

import { useQixContext } from '../contexts/QixContext'

const useApp = () => {
    const { engine } = useQixContext()
    const [qApp, setApp] = useState<any>({})

    const doReload = async (qMode, qPartial) => {
        const qDoc = await engine.doc
        qDoc.doReload(qMode, qPartial, false)
    }

    const getApp = useCallback(async engine => {
        const qDoc = await engine.doc

        const appProperties = await qDoc.getAppProperties()

        setApp({
            app: qDoc,
            appProperties,
            ...appProperties,
            doReload
        })
    }, [])

    useEffect(() => {
        if (!engine?.doc) return
        getApp(engine)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [engine])

    return {
        ...qApp
    }
}

export default useApp
