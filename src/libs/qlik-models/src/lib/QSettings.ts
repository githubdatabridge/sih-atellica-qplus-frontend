import { QApiEnum } from './QApi'
import { QApp } from './QApp'
import { QDeviceTypeEnum } from './QDeviceType'
import { QDoc } from './QDoc'
import { QMultiAppFields } from './QFieldSelection'

interface QAssetPaths {
    qStyles: string
    requireJs: string
    hubChartUiJs?: string
}

interface QCookieSettings {
    ttl: number
    path: string
    clearInvalid: boolean
    sameSite: string
    secure: boolean
    httpOnly: boolean
    domain: string
}
interface QCookie {
    name: string
    settings: QCookieSettings
}

interface QConfig {
    host: string
    identity?: string
    prefix: string
    port?: number
    protocol?: string
    isSecure?: boolean
    uid?: string
    sameIdentity?: boolean
    webIntegrationId?: string
    token?: string
    clientId?: string
    loginUrl?: string
    returnTo?: string
}

export enum QAuthMode {
    QES = 'QES',
    QSAAS = 'QSAAS',
    QSAAS_JWT = 'QSAAS_JWT',
    NONE = 'NONE'
}

export interface QSettings {
    qUserId?: string
    qUserDirectory?: string
    qAttributes?: unknown[]
    qAuthMode?: QAuthMode
    qDeviceType?: QDeviceTypeEnum
    qCookie?: QCookie
    qApi: QApiEnum
    qAssetPaths?: QAssetPaths
    qGlobalEvents?: string[]
    qConfig: QConfig
    qTheme: string
    qMultiAppFields?: QMultiAppFields[]
    qApps?: QApp[]
    qDocs?: QDoc[]
    qLang?: string
    qInitGlobalEventHandler?: boolean
    LoadingComponent?: () => JSX.Element | null
    NoAuthComponent?: () => JSX.Element | null
    onQlikErrorCallback?: (error: any) => void
    onQlikWarningCallback?: (warn: any) => void
    onQlikClosedCallback?: (close: any) => void
    onQlikGlobalSessionTimeoutCallback?: (
        isSessionExpired?: boolean,
        type?: string,
        event?: string
    ) => void
    onQlikGlobalErrorCallback?: (type: string, event: any) => void
    onQlikGlobalWarningCallback?: (type: string, event: any) => void
    onQlikGlobalClosedCallback?: (type: string, event: any) => void
    onQlikGlobalAccessDeniedCallback?: (message: string, appId?: string) => void
}
