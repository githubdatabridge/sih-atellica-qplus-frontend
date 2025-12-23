import { useContext, createContext } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { QDeviceTypeEnum, QSettings } from '@libs/qlik-models'

export interface QlikContextType {
    settings: QSettings
    csrfToken?: string
    setCsrfToken?: (csrfToken: string) => void
}

export const QlikContext = createContext<QlikContextType>({
    settings: {
        qUserId: '',
        qAttributes: [],
        qAuthMode: undefined,
        qDeviceType: QDeviceTypeEnum.AUTO,
        LoadingComponent: undefined,
        NoAuthComponent: undefined,
        qInitGlobalEventHandler: false,
        qCookie: {
            name: '',
            settings: {
                ttl: 0,
                path: '',
                clearInvalid: false,
                sameSite: 'lax',
                secure: false,
                httpOnly: false,
                domain: ''
            }
        },
        qGlobalEvents: [],
        qApi: undefined,
        qAssetPaths: {
            requireJs: '',
            qStyles: '',
            hubChartUiJs: ''
        },
        qConfig: {
            host: '',
            identity: '',
            prefix: '',
            port: 443,
            protocol: 'https',
            isSecure: true,
            uid: uuidv4(),
            sameIdentity: true,
            token: '',
            loginUrl: '',
            returnTo: ''
        },
        qApps: [],
        qMultiAppFields: [],
        qLang: '',
        qTheme: ''
    },
    csrfToken: '',
    setCsrfToken: undefined
})

export const useQlikContext = () => {
    const context = useContext(QlikContext)

    if (context === undefined) {
        throw new Error('useQlikContext must be used within a QlikContext')
    }

    return context
}
