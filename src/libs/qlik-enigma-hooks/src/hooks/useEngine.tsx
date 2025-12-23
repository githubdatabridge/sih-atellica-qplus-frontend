// @ts-nocheck

import { useState, useEffect } from 'react'

import { default as enigma } from 'enigma.js'

const schema = import('enigma.js/schemas/12.170.2')

const MAX_RETRIES = 3

const useEngine = config => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [engineError, setDocError] = useState<boolean>(false)
    const [errorCode, seErrorCode] = useState(null)
    const [isSuspended] = useState<boolean>(false)
    const [isClosed] = useState<boolean>(false)
    const [doc, setDoc] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loginUri, setLoginUri] = useState<any>(null)

    const responseInterceptors = [
        {
            // We only want to handle failed responses from QIX Engine:
            onRejected: function retryAbortedError(sessionReference, request, error) {
                console.warn(
                    'QPLUS',
                    'Captured Request: Rejected',
                    `Error Code: ${error.code} : ${error}`
                )
                // We only want to handle aborted QIX errors:
                if (error.code === schema.enums.LocalizedErrorCode.LOCERR_GENERIC_ABORTED) {
                    // We keep track of how many consecutive times we have tried to do this call:
                    request.tries = (request.tries || 0) + 1
                    console.warn('QPLUS', `Captured Request: Retry #${request.tries}`)
                    // We do not want to get stuck in an infinite loop here if something has gone
                    // awry, so we only retry until we have reached MAX_RETRIES:
                    if (request.tries <= MAX_RETRIES) {
                        return request.retry()
                    }
                }
                if (
                    error.code === schema.enums.LocalizedErrorCode.LOCERR_GENERIC_INVALID_PARAMETERS
                ) {
                    return error.code
                }
                if (error.code === schema.enums.LocalizedErrorCode.LOCERR_HC_MODAL_OBJECT_ERROR) {
                    return error.code
                }
                // If it was not an aborted QIX call, or if we reached MAX_RETRIES, we let the error
                // trickle down to potential other interceptors, and finally down to resolving/rejecting
                // the initial promise that the user got when invoking the QIX method:
                // console.warn(error);

                return this.Promise.resolve(console.warn(error))
            }
        }
    ]

    const initQixConnection = async config => {
        try {
            setIsLoading(true)
            if (!config) {
                seErrorCode(null)
                setDocError(null)

                return 4
            }

            if (config && config.qsServerType === 'cloud' && !config.accessToken) {
                const tenantUri = config.host
                const webIntegrationId = config.webIntegrationId

                const urlLoggedIn = '/api/v1/audits' //Use GET request to see if you are authenticated

                await fetch(`https://${tenantUri}${urlLoggedIn}`, {
                    credentials: 'include',
                    headers: {
                        'Qlik-Web-Integration-ID': webIntegrationId
                    }
                })
                    .then(async function (response) {
                        //check if user is authenticated; if not, redirect to login page
                        if (response.status === 401) {
                            const url = new URL(`https://${tenantUri}/login`)
                            url.searchParams.append(
                                'returnto',
                                config?.returnTo || window.location.origin
                            )
                            url.searchParams.append('qlik-web-integration-id', webIntegrationId)
                            window.location.href = url.toString()
                        }
                    })
                    .catch(function (error) {
                        console.error(error)
                    })

                const getCsrfToken = async () => {
                    try {
                        const csrfTokenUrl = new URL(
                            `https://${tenantUri}/api/v1/csrf-token?qlik-web-integration-id=${webIntegrationId}`
                        )

                        const csrfTokenInfo = await fetch(csrfTokenUrl, {
                            credentials: 'include',
                            headers: {
                                'Qlik-Web-Integration-ID': webIntegrationId
                            }
                        })

                        return csrfTokenInfo ? csrfTokenInfo.headers.get('qlik-csrf-token') : ''
                    } catch (error) {
                        throw new Error(error)
                    }
                }

                const csrfToken = await getCsrfToken()

                if (csrfToken == null) {
                    console.log('QPLUS', '---- Not logged in ----')
                    seErrorCode(-1)
                    return -1
                }

                const url = `wss://${tenantUri}/app/${config.appId}?qlik-web-integration-id=${webIntegrationId}&qlik-csrf-token=${csrfToken}`

                // create the enigma.js session:
                const session = enigma.create({ url, schema, responseInterceptors })

                session.on('suspended', () => {
                    console.warn('QPLUS', 'Captured session suspended')
                })
                session.on('error', () => {
                    console.warn('QPLUS', 'Captured session error')
                })
                session.on('closed', () => {
                    console.warn('QPLUS', 'Session was closed')
                    seErrorCode(-3)

                    return -3
                })
                const _global = (await session.open()) as any
                const _user = await _global.getAuthenticatedUser()

                if (!config.global) {
                    const _doc = await _global.openDoc(config.appId)
                    setDoc(_doc)
                } else {
                    setDoc(_global)
                }
                setUser(_user)
                seErrorCode(1)

                return 1
            }

            if (config && config.qsServerType === 'cloud' && config.accessToken) {
                const tenantUri = config.host

                const url = `wss://${tenantUri}/app/${config.appId}`

                // create the enigma.js session:
                const session = enigma.create({
                    url,
                    createSocket: url => new WebSocket(url),
                    schema,
                    responseInterceptors
                })

                session.on('suspended', () => {
                    console.warn('QPLUS', 'Captured session suspended')
                })
                session.on('error', () => {
                    console.warn('QPLUS', 'Captured session error')
                })
                session.on('closed', () => {
                    console.warn('QPLUS', 'Session was closed')
                    seErrorCode(-3)

                    return -3
                })
                const _global = (await session.open()) as any
                const _user = await _global.getAuthenticatedUser()

                if (!config.global) {
                    const _doc = await _global.openDoc(config.appId)
                    setDoc(_doc)
                } else {
                    setDoc(_global)
                }
                setUser(_user)
                seErrorCode(1)

                return 1
            }

            if (config && config.qsServerType === 'onPrem' && config.authType !== 'ticket') {
                const reloadURI = encodeURIComponent(
                    `https://${config.host}${
                        config.prefix ? '/' + config.prefix : ''
                    }/content/Default/${config.redirectUri}`
                )
                const url = `wss:/${config.host}${config.prefix ? '/' + config.prefix : ''}/app/${
                    config.appId
                }?reloadURI=${reloadURI}`

                const session = enigma.create({
                    schema,
                    url: url,
                    suspendOnClose: false,
                    responseInterceptors
                })

                session.on('notification:OnAuthenticationInformation', authInfo => {
                    if (authInfo.mustAuthenticate) {
                        console.warn('Not logged in')
                        setLoginUri(authInfo.loginUri)
                        seErrorCode(-1)
                        return -1
                    } else {
                        session.on('closed', t => {
                            console.warn('QPLUS', 'Session was closed')
                            seErrorCode(-3)
                            return -3
                        })
                    }
                })

                session.on('error', () => {
                    console.warn('QPLUS', 'Captured session error')
                })

                session.on('suspended', () => {
                    console.log('QPLUS', 'Session was suspended')
                    session.resume()
                })

                try {
                    const _global = (await session.open()) as any
                    const _user = await _global.getAuthenticatedUser()

                    if (!config.global) {
                        const _doc = await _global.openDoc(config.appId)
                        setDoc(_doc)
                    } else {
                        setDoc(_global)
                    }
                    setUser(_user)
                    seErrorCode(1)
                    return 1
                } catch (err) {
                    if (err.code) {
                        console.log('QPLUS', 'Tried to communicate on a session that is closed')
                    }
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        initQixConnection(config)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config])

    return { doc, isLoading, engineError, errorCode, user, loginUri, isSuspended, isClosed }
}

export default useEngine
