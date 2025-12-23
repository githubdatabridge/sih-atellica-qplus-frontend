import { useContext, createContext } from 'react'

export type QlikPreferencesContextType = {
    appPreferences: Map<string, any>
}

export const QlikPreferencesContext = createContext<QlikPreferencesContextType>({
    appPreferences: new Map()
})

export const useQlikPreferencesContext = () => {
    const context = useContext(QlikPreferencesContext)

    if (context === undefined) {
        throw new Error('useQlikPreferencesContext must be used within a QlikPreferencesContext')
    }

    return context
}

export const useSelectionHash = (qlikAppId: string) => {
    const context = useContext(QlikPreferencesContext)

    if (context === undefined) {
        throw new Error('useQlikAppSelection must be used within a QlikPreferencesContext')
    }

    const { appPreferences } = context

    return appPreferences.get(qlikAppId)
}
