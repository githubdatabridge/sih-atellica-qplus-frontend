import { useState, useCallback } from 'react'

import { useQlikApp } from '@libs/qlik-providers'

import useQlikGetVisualization from './useQlikGetVisualization'
import useQlikVisualizationExportData from './useQlikVisualizationExportData'
import useQlikVisualizationExportImg from './useQlikVisualizationExportImg'
import useQlikVisualizationExportPdf from './useQlikVisualizationExportPdf'

const useQlikVisualizationExport = (config: any) => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { setVisualization } = useQlikGetVisualization()
    const { setVisualizationExportData } = useQlikVisualizationExportData()
    const { setVisualizationExportImg } = useQlikVisualizationExportImg()
    const { setVisualizationExportPdf } = useQlikVisualizationExportPdf()
    const { qAppId } = useQlikApp()

    const setVisualizationExport = useCallback(
        async (id: string, type: string, qlikAppId?: string) => {
            const element = document.getElementById(id)
            const appId = qlikAppId || qAppId
            const viz = await setVisualization(id, appId)
            let r = null
            if (viz) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    const vis = await setVisualization(id, appId)
                    if (type === 'png')
                        r = await setVisualizationExportImg(
                            vis,
                            {
                                format: 'png',
                                height: element?.offsetHeight,
                                width: element?.offsetWidth
                            },
                            config.prefix
                        )
                    else if (type === 'pdf') {
                        r = await setVisualizationExportPdf(
                            vis,
                            { documentSize: 'a4', aspectRatio: 2, orientation: 'landscape' },
                            config.prefix
                        )
                    } else {
                        r = await setVisualizationExportData(
                            vis,
                            { format: 'OOXML', state: 'A' },
                            config.prefix
                        )
                    }
                    setQAction({ loading: false, qResponse: r, error: null })
                    return r
                } catch (error) {
                    setQAction({ loading: false, qResponse: null, error: error })
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [config.prefix, qAppId]
    )

    return { qAction, setVisualizationExport }
}

export default useQlikVisualizationExport
