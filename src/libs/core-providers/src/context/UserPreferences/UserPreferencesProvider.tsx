import React, { useState, FC, ReactNode } from "react";

import { useMount } from 'react-use'

import { UserPreferences } from '@libs/core-models'
import { userPreferenceService } from '@libs/core-services'

import { UserPreferencesContext, UserPreferencesContextType } from './UserPreferencesContext'

interface Props {
    value?: UserPreferencesContextType
    children: ReactNode
}

export const UserPreferencesProvider: FC<Props> = ({ value, children }) => {
    const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)

    const [isLoading, setIsLoading] = useState(false)

    const loadPreferences = async () => {
        setIsLoading(true)
        const preferences = await userPreferenceService.getPreferences()
        setUserPreferences(preferences)
        setIsLoading(false)
    }

    useMount(async () => {
        await loadPreferences()
    })

    const refreshPreferences = async () => {
        const preferences = await userPreferenceService.getPreferences()
        setUserPreferences(preferences)
        return preferences
    }

    const providerValues: UserPreferencesContextType = {
        userPreferences: userPreferences,
        setUserPreferences,
        loadPreferences,
        refreshPreferences
    }

    return (
        <UserPreferencesContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </UserPreferencesContext.Provider>
    )
}

export default UserPreferencesProvider
