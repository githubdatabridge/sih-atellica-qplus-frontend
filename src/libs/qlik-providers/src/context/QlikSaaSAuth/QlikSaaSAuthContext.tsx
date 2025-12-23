import { useContext, createContext } from 'react'

export interface QlikSaaSAuthContextType {
    isAuthenticated: boolean
}

export const QlikSaaSAuthContext = createContext<QlikSaaSAuthContextType>({
    isAuthenticated: false
})

export const useQlikSaaSAuthContext = () => {
    const context = useContext(QlikSaaSAuthContext)

    if (context === undefined) {
        throw new Error('useQlikSaaSAuthContext must be used within a QlikSaaSAuthContext')
    }

    return context
}
