declare module 'enigma.js'

export type QixConfig = {
    protocol?: string
    host: string
    identity?: string
    isSecure?: boolean
    port?: number
    prefix?: string
    appId: string
    clientId?: string
    accessToken?: string
    webIntegrationId?: string
    returnTo?: string
    uid?: string
    urlParams?: any
    sameIdentity?: boolean
    qsServerType?: string
    redirectUri?: string
}
export type QixCalculationCondition = { qCond: string; qMsg: string }
export function isEmpty(d: Array<number>): boolean
