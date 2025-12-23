import { useState, useCallback } from 'react'

import {
    useQlikApp,
    useQlikAppContext,
    useQlikBookmarkContext,
    useQlikMasterItemContext,
    useQlikSelectionContext,
    useQlikSheetContext
} from '@libs/qlik-providers'

export const useQlikAppClose = () => {
    const [qAction, setQAction] = useState<any>({
        loading: false,
        qResponse: null,
        error: null
    })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()
    const { qSelectionMap } = useQlikSelectionContext()
    const { qMasterDimensionsMap, qMasterMeasuresMap, qMasterVisualizationsMap } =
        useQlikMasterItemContext()
    const { qSheetMap } = useQlikSheetContext()
    const { qBookmarkVariableMap } = useQlikBookmarkContext()

    const setAppClose = useCallback(
        async (qlikAppId?: string) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)

            try {
                setQAction({ loading: true, qResponse: null, error: null })
                if (qApp?.qApi) {
                    r = await qApp?.qApi?.close()
                    qAppMap.delete(qlikAppId || qAppId)
                }
                qAppMap?.delete(qlikAppId || qAppId)
                qSelectionMap?.delete(qlikAppId || qAppId)
                qMasterDimensionsMap?.delete(qlikAppId || qAppId)
                qMasterMeasuresMap?.delete(qlikAppId || qAppId)
                qMasterVisualizationsMap?.delete(qlikAppId || qAppId)
                qSheetMap?.delete(qlikAppId || qAppId)
                qBookmarkVariableMap?.delete(qlikAppId || qAppId)
                setQAction({ loading: false, qResponse: { r }, error: null })
                return r
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
            }
        },
        [
            qAppId,
            qAppMap,
            qSheetMap,
            qMasterDimensionsMap,
            qMasterMeasuresMap,
            qMasterVisualizationsMap,
            qSelectionMap,
            qBookmarkVariableMap
        ]
    )

    return { qAction, setAppClose }
}

export default useQlikAppClose
