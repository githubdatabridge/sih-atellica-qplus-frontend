import { useState, useCallback } from 'react'

const useQlikVisualizationExportImg = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })

    const setVisualizationExportImg = useCallback(async (viz: any, settings: any, prefix = '') => {
        let r = null
        if (viz) {
            try {
                setQAction({ loading: true, qResponse: null, error: null })
                r = await viz.exportImg(settings, prefix)
                if (r) {
                    const link = r.replace(prefix, `/${prefix}`)
                    window.open(link, '_blank')
                }
                setQAction({ loading: false, qResponse: r, error: null })
                return r
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
            }
        }
    }, [])

    return { qAction, setVisualizationExportImg }
}

export default useQlikVisualizationExportImg
