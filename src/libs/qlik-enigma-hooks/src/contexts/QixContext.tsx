import { createContext, useContext } from 'react'

export interface QixContextType {
    engine?: any
}

export const QixContext = createContext<QixContextType>({
    engine: null
})

export const useQixContext = () => {
    const context = useContext(QixContext)

    if (context === undefined) {
        throw new Error('useQixContext must be used within a QlikContext')
    }

    return context
}
