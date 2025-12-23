import { useContext, createContext } from 'react'

export interface QlikSaaSJwtAuthContextType {
    isAuthenticated: boolean
}

export const QlikSaaSJwtAuthContext = createContext<QlikSaaSJwtAuthContextType>({
    isAuthenticated: false
})

export const useQlikSaaSJwtAuthContext = () => {
    const context = useContext(QlikSaaSJwtAuthContext)

    if (context === undefined) {
        throw new Error('useQlikSaaSJwtAuthContext must be used within a QlikSaaSJwtAuthContext')
    }

    return context
}
