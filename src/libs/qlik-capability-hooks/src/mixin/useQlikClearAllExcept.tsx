import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

import useQlikFieldClear from '../field/useQlikFieldClear'

const useQlikClearAllExcept = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()
    const { setFieldClear } = useQlikFieldClear()

    const setClearAllExcept = useCallback(
        async (qlikSelections: any, fieldNames: string[] = [], qlikAppId?: string) => {
            let r = false
            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    for (const selection of qlikSelections) {
                        let shouldClear = true
                        if (fieldNames.includes(selection.fieldName)) {
                            shouldClear = false
                        }

                        if (shouldClear) {
                            r = await setFieldClear(selection.fieldName, qlikAppId)
                        }
                    }
                    setQAction({ loading: false, qResponse: true, error: null })
                    return !r
                } catch (error) {
                    setQAction({ loading: false, qResponse: false, error: error })
                    return r
                }
            }
            return r
        },
        [qAppId, qAppMap]
    )

    return { qAction, setClearAllExcept }
}

export default useQlikClearAllExcept
