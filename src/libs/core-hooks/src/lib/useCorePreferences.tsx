import { useState, useCallback } from 'react'

import { userPreferenceService } from '@libs/core-services'

const useCorePreferences = () => {
    const [iAction, setIAction] = useState<any>({ loading: false, qResponse: null, error: null })

    const setUserPreferences = useCallback(async (preferences: any) => {
        if (userPreferenceService) {
            try {
                setIAction({ loading: true, qResponse: null, error: null })
                const r = await userPreferenceService.updatePreferences(preferences)
                setIAction({ loading: false, qResponse: r, error: null })
            } catch (error) {
                setIAction({ loading: false, qResponse: null, error: error })
            }
        }
    }, [])

    return { iAction, setUserPreferences }
}

export default useCorePreferences
