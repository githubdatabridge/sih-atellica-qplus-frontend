import { useState, useCallback } from 'react'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

import useQlikFieldUnlock from '../field/useQlikFieldUnlock'

const useQlikUnlockSelectionsExcept = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()
    const { setFieldUnlock } = useQlikFieldUnlock()

    const setUnlockSelectionsExcept = useCallback(
        async (qlikSelections: any, fieldName = '', hiddenFields = [], qlikAppId?: string) => {
            let r = null
            const qApp = qAppMap.get(qlikAppId || qAppId)
            if (qApp?.qApi) {
                try {
                    setQAction({ loading: true, qResponse: null, error: null })
                    for (const selection of qlikSelections) {
                        let inHiddenFields = false
                        for (let index = 0; index < hiddenFields.length; index++) {
                            const hiddenField = hiddenFields[index]
                            if (selection.fieldName === hiddenField) {
                                inHiddenFields = true
                                break
                            }
                        }
                        if (!inHiddenFields && selection.fieldName !== fieldName) {
                            r = await setFieldUnlock(selection.fieldName, qlikAppId)
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

    return { qAction, setUnlockSelectionsExcept }
}

export default useQlikUnlockSelectionsExcept
