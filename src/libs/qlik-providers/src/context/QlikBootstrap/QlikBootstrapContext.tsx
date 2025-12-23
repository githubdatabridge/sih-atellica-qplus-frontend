import { useContext, createContext } from 'react'

import { QixCapabilityApi, QixEnigmaApi } from '@libs/qlik-services'

export type QlikBootstrapContextType = {
    q: any
    qlikEnigmaApi: QixEnigmaApi | null
    qlikCapabilityApi: QixCapabilityApi | null
    config: any
}

export const QlikBootstrapContext = createContext<QlikBootstrapContextType>({
    q: null,
    qlikEnigmaApi: null,
    qlikCapabilityApi: null,
    config: null
})

export const useQlikBootstrapContext = () => {
    const context = useContext(QlikBootstrapContext)

    if (context === undefined) {
        throw new Error('useQlikBootstrapContext must be used within a QlikBootstrapContext')
    }

    return context
}
