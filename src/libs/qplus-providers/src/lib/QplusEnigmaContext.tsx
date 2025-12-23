import { useContext, createContext } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface QplusEnigmaContextType {}

export const QplusEnigmaContext = createContext<QplusEnigmaContextType>({})

export const useQplusEnigmaContext = () => {
    const context = useContext(QplusEnigmaContext)

    if (context === undefined) {
        throw new Error('useQplusEnigmaContext must be used within a QplusEnigmaContext')
    }

    return context
}
