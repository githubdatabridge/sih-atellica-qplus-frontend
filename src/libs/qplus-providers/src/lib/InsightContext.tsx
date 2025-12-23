import { useContext, createContext } from 'react'

export type InsightConfig = {
    apiUrl: string
    gateway?: string
}

export interface InsightContextType {
    config: InsightConfig
    tenantId: string
    customerId: string
    mashupAppId: string
}

export const InsightContext = createContext<InsightContextType>({
    config: {
        apiUrl: '',
        gateway: ''
    },
    tenantId: '',
    customerId: '',
    mashupAppId: ''
})

export const useInsightContext = () => {
    const context = useContext(InsightContext)

    if (context === undefined) {
        throw new Error('useInsightContext must be used within a InsightContext')
    }

    return context
}
