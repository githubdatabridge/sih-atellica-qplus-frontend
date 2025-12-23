import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

const useQlikFieldListData = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    const setFieldListData = useCallback(
        async (
            qlikAppId?: string,
            showHidden = true,
            showSystem = false,
            showSrcTable = false,
            showSemantic = false,
            showDerivedFields = false
        ) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qEnigmaApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    const model = await qApp?.qEnigmaApi.dApp.createSessionObject({
                        qInfo: { qId: 'FieldList', qType: 'FieldList' },
                        qFieldListDef: {
                            qShowSystem: showSystem,
                            qShowHidden: showHidden,
                            qShowSrcTables: showSrcTable,
                            qShowSemantic: showSemantic,
                            qShowDerivedFields: showDerivedFields
                        }
                    })
                    const layout = (await model.getLayout()) as any
                    r = layout.qFieldList.qItems
                    if (model) qApp?.qEnigmaApi.dApp.destroySessionObject(layout.qInfo.qId)
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

    return { qAction, setFieldListData }
}

export default useQlikFieldListData
