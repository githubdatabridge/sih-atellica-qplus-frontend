import { useContext, createContext } from 'react'

export interface QlikAuthContextType {
    isAuthenticated: boolean
}

export const QlikAuthContext = createContext<QlikAuthContextType>({
    isAuthenticated: false
})

export const useQlikAuthContext = () => {
    const context = useContext(QlikAuthContext)

    if (context === undefined) {
        throw new Error('useQlikAuthContext must be used within a QlikAuthContext')
    }

    return context
}
