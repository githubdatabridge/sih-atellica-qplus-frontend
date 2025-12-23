import { useContext, createContext } from 'react'

import { UserPreferences } from '@libs/core-models'

export type UserPreferencesContextType = {
    userPreferences: UserPreferences | null
    setUserPreferences: (u: UserPreferences) => void
    loadPreferences: () => void
    refreshPreferences: () => void
}

export const UserPreferencesContext = createContext<UserPreferencesContextType>({
    userPreferences: null,
    setUserPreferences: (u: any) => {
        throw new Error('setUserPreferences() not implemented')
    },
    loadPreferences: () => {
        throw new Error('loadPreferences() not implemented')
    },
    refreshPreferences: () => {
        throw new Error('refreshPreferences() not implemented')
    }
})

export const useUserPreferencesContext = () => {
    const context = useContext(UserPreferencesContext)

    if (context === undefined) {
        throw new Error('useUserPreferencesContext must be used within a UserPreferencesContext')
    }

    return context
}
