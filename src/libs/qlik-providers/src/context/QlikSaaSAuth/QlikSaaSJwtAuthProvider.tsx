import { ReactNode, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useMount } from 'react-use'

import querystring from 'query-string'

import { KEYS, storage } from '@libs/common-utils'

import { QLIK_SAAS_CSRF_TOKEN_PATH, QLIK_SAAS_JWT_LOGIN_PATH } from '../../constants'
import { useQlikContext } from '../Qlik/QlikContext'
import { useQlikLoaderContext } from '../QlikLoader/QlikLoaderContext'
import { QlikSaaSJwtAuthContext, QlikSaaSJwtAuthContextType } from './QlikSaaSJwtAuthContext'

export interface QlikAuthJwtProviderProps {
    oAuthUrl: string
    returnTo?: string
    value?: QlikSaaSJwtAuthContextType
    children: ReactNode
}

const QlikSaaSJwtAuthProvider = ({
    value,
    children,
    oAuthUrl,
    returnTo = ''
}: QlikAuthJwtProviderProps) => {
    const { settings, setCsrfToken } = useQlikContext()
    const { setQlikLoaderMessage } = useQlikLoaderContext()
    const navigate = useNavigate()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)
    const accessToken = useRef<string>('')

    if (!settings.qConfig.host)
        throw new Error('QlikSaaSJwtAuth is enabled, but `settings.qConfig.host` is not defined')

    if (!settings.qConfig.webIntegrationId)
        throw new Error(
            'QlikSaaSJwtAuth is enabled, but `settings.qConfig.webIntegrationId` is not defined'
        )

    if (!settings.qConfig.returnTo)
        throw new Error(
            'QlikSaaSJwtAuth is enabled, but `settings.qConfig.returnTo` is not defined'
        )

    useMount(async () => {
        let token = ''
        try {
            setIsLoading(true)
            const query = querystring.parse(window.location.search)
            token = query?.token?.toString()
            if (!token) {
                token = storage.load(KEYS.QPLUS_SAAS_TOKEN) || ''
            }
            accessToken.current = token
            await connect()
            setQlikLoaderMessage('Qlik SaaS JWT authentication succeeded!')
        } catch (error) {
            throw new Error(error)
        }
    })

    const connect = async () => {
        const jwtUrl = new URL(
            settings.qConfig?.loginUrl ||
                `${settings.qConfig.isSecure ? 'https' : 'http'}://${
                    settings.qConfig.host
                }/${QLIK_SAAS_JWT_LOGIN_PATH}`
        ) as any

        //Check to see if logged in 404
        return await fetch(`${jwtUrl}`, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Qlik-Web-Integration-ID': settings?.qConfig?.webIntegrationId,
                Authorization: `Bearer ${accessToken.current}`
            }
        })
            .then(async response => {
                //check if user is authenticated; if not, redirect to login page
                if (response.status === 401 || response.status === 404) {
                    await doOAuthLogin()
                } else {
                    await storeLoginInformation()
                    setIsLoading(false)
                    setIsAuthenticated(true)
                    navigate(returnTo, { replace: true })
                }
            })
            .catch(error => {
                throw new Error(error)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    const storeLoginInformation = async () => {
        try {
            storage.save(KEYS.QPLUS_SAAS_TOKEN, accessToken.current)
            const csrfToken = await getCsrfToken()
            setCsrfToken(csrfToken)
        } catch (error) {
            throw new Error(error)
        }
    }

    const doOAuthLogin = async () => {
        window.location.href = oAuthUrl
    }

    const getCsrfToken = async () => {
        try {
            const csrfTokenUrl = new URL(
                settings.qConfig?.loginUrl ||
                    `${settings.qConfig.isSecure ? 'https' : 'http'}://${
                        settings.qConfig.host
                    }/${QLIK_SAAS_CSRF_TOKEN_PATH}${settings?.qConfig?.webIntegrationId}`
            ) as any

            const csrfTokenInfo = await fetch(csrfTokenUrl, {
                credentials: 'include',
                headers: {
                    'Qlik-Web-Integration-ID': settings?.qConfig?.webIntegrationId
                }
            })

            return csrfTokenInfo ? csrfTokenInfo.headers.get('qlik-csrf-token') : ''
        } catch (error) {
            throw new Error(error)
        }
    }

    const providerValues: QlikSaaSJwtAuthContextType = {
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
        <QlikSaaSJwtAuthContext.Provider value={providerValues}>
            {children}
        </QlikSaaSJwtAuthContext.Provider>
    )
}

export default QlikSaaSJwtAuthProvider
