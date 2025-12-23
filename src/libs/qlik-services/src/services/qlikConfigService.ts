/**
 * @ignore
 */

export interface QsGetConfig {
    host: string
    identity?: string
    port: number
    prefix?: string
    protocol?: string
    isSecure?: boolean
    uid?: string
    urlParams?: any
    appId?: string
    sameIdentity?: boolean
    webIntegrationId?: string
    clientId?: string
    token?: string
}

export class QlikConfigService {
    config: any

    constructor() {
        this.config = null
    }

    setConfig(config: QsGetConfig): QsGetConfig {
        this.config = {
            ...config
        }
        return this.config as QsGetConfig
    }
}

export const qlikConfigService = new QlikConfigService()
