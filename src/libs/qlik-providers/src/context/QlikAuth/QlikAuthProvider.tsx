import { ReactNode, useState } from 'react'

import { useMount } from 'react-use'

import { useQlikContext } from '../Qlik/QlikContext'
import { useQlikLoaderContext } from '../QlikLoader/QlikLoaderContext'
import { QlikAuthContext, QlikAuthContextType } from './QlikAuthContext'

export interface QlikAuthProviderProps {
    value?: QlikAuthContextType
    children: ReactNode
    shouldAuthenticate?: boolean
}

const QlikAuthProvider = ({
    value,
    children,
    shouldAuthenticate = false
}: QlikAuthProviderProps) => {
    const { settings } = useQlikContext()
    const { setQlikLoaderMessage } = useQlikLoaderContext()

    if (!settings.qUserId && shouldAuthenticate)
        throw new Error('QlikAuth is enabled, but `settings.qUserId` is not defined')

    if (!settings.qAttributes && shouldAuthenticate)
        throw new Error('QlikAuth is enabled, but `settings.qAttributes` is not defined')

    if (!settings.qUserDirectory && shouldAuthenticate)
        throw new Error('QlikAuth is enabled, but `settings.qUserDirectory` is not defined')

    if (!settings.qConfig.host && shouldAuthenticate)
        throw new Error('QlikAuth is enabled, but `settings.qConfig.host` is not defined')

    if (!settings.qConfig.prefix && shouldAuthenticate)
        throw new Error('QlikAuth is enabled, but `settings.qConfig.virtualProxy` is not defined')

    if (!settings.qCookie && shouldAuthenticate)
        throw new Error('QlikAuth is enabled, but `settings.qCookie` is not defined')

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    useMount(async () => {
        try {
            setIsLoading(true)
            // TODO Implement Auth Logic
            setIsAuthenticated(true)
            setQlikLoaderMessage('Qlik authentication succeeded!')
        } catch (error) {
            throw new Error(error)
        } finally {
            setIsLoading(false)
        }
    })

    const providerValues: QlikAuthContextType = {
        isAuthenticated,
        ...value
    }

    if (isLoading) return null

    if (!isAuthenticated && settings.NoAuthComponent) {
        const { NoAuthComponent } = settings

        return <NoAuthComponent />
    }

    if (!isAuthenticated) return null

    return <QlikAuthContext.Provider value={providerValues}>{children}</QlikAuthContext.Provider>
}

export default QlikAuthProvider
