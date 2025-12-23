import { ReactNode, useState } from 'react'

import { useMount } from 'react-use'

import { useQlikContext } from '../Qlik/QlikContext'
import { useQlikLoaderContext } from '../QlikLoader/QlikLoaderContext'
import { QlikSaaSAuthContext, QlikSaaSAuthContextType } from './QlikSaaSAuthContext'

export interface QlikAuthProviderProps {
    value?: QlikSaaSAuthContextType
    children: ReactNode
}

const QlikSaaSAuthProvider = ({ value, children }: QlikAuthProviderProps) => {
    const { settings } = useQlikContext()
    const { setQlikLoaderMessage } = useQlikLoaderContext()

    if (!settings.qConfig.host)
        throw new Error('QlikSaaSAuth is enabled, but `settings.qConfig.host` is not defined')

    if (!settings.qConfig.webIntegrationId)
        throw new Error(
            'QlikSaaSAuth is enabled, but `settings.qConfig.webIntegrationId` is not defined'
        )

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    useMount(async () => {
        try {
            setIsLoading(true)
            await connect()
            setQlikLoaderMessage('Qlik SaaS authentication succeeded!')
            setIsLoading(false)
            setIsAuthenticated(true)
        } catch (error) {
            throw new Error(error)
        }
    })

    async function connect() {
        const urlQlikServer = `${settings.qConfig.isSecure ? 'https' : 'http'}://${
            settings.qConfig.host
        }`
        const urlLoggedIn = '/qApi/v1/audits' //Use GET request to see if you are authenticated

        //Check to see if logged in
        return await fetch(`${urlQlikServer}${urlLoggedIn}`, {
            credentials: 'include',
            headers: {
                'Qlik-Web-Integration-ID': settings?.qConfig?.webIntegrationId
            }
        })
            .then(async function (response) {
                //check if user is authenticated; if not, redirect to login page
                if (response.status === 401) {
                    const url = new URL(
                        settings.qConfig?.loginUrl ||
                            `${settings.qConfig.isSecure ? 'https' : 'http'}://${
                                settings.qConfig.host
                            }/login`
                    ) as any
                    url.searchParams.append(
                        'returnto',
                        settings.qConfig.returnTo || window.location.origin
                    )
                    url.searchParams.append(
                        'qlik-web-integration-id',
                        settings?.qConfig?.webIntegrationId
                    )
                    window.location.href = url
                }
            })
            .catch(function (error) {
                console.error(error)
            })
    }

    const providerValues: QlikSaaSAuthContextType = {
        isAuthenticated,
        ...value
    }

    if (isLoading) return null

    if (!isAuthenticated && settings.NoAuthComponent) {
        const { NoAuthComponent } = settings

        return <NoAuthComponent />
    }

    if (!isAuthenticated) return null

    return (
        <QlikSaaSAuthContext.Provider value={providerValues}>
            {children}
        </QlikSaaSAuthContext.Provider>
    )
}

export default QlikSaaSAuthProvider
