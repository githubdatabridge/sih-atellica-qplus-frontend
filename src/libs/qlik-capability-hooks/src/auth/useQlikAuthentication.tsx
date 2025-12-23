import { useState, useCallback } from 'react'

import { qlikAuthService } from '@libs/qlik-services'

const useQlikAuthentication = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })

    const setQlikAuthentication = useCallback(
        async (
            userDirectory: string,
            userId: string,
            host: string,
            port: number,
            vp: string,
            qCookie: any
        ) => {
            try {
                const authPayload = {
                    userInfo: {
                        userId: userId,
                        userDirectory: userDirectory
                    },
                    qsInfo: {
                        host: host,
                        port: port,
                        vp: vp
                    },
                    qCookie: qCookie
                }

                const r = await qlikAuthService.authenticate(authPayload)
                setQAction({ loading: false, qResponse: r, error: null })
                return r
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
                return null
            }
        },
        []
    )

    return { qAction, setQlikAuthentication }
}

export default useQlikAuthentication
