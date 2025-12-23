//PAM: Capability API Wrapper Class
export default class QlikGlobalApi {
    global: any
    qGlobal: any
    dAuthenticatedUser: string
    dPersonalMode: boolean
    dProductVersion: string
    dEngineVersion: string
    dQTProduct: string

    static async create(environment, qlik, config): Promise<QlikGlobalApi> {
        const o = new QlikGlobalApi()
        if (environment === 'QES') {
            o.qGlobal = await qlik.getGlobal(config)
            o.dAuthenticatedUser = await o.getAuthenticatedUser()
            o.dPersonalMode = await o.isPersonalMode()
            o.dQTProduct = await o.getQTProduct()
        }
        return o
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getAuthenticatedUser() {
        const authenticatedUser = await this.qGlobal.getAuthenticatedUser()
        return authenticatedUser?.qReturn
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getQTProduct() {
        return await this.qGlobal.getQTProduct()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async isPersonalMode() {
        return await this.qGlobal.isPersonalMode()
    }

    registerEvent(event: string, callback): void {
        this.qGlobal.on(event, callback)
    }

    unregisterEvent(event: string): void {
        this.qGlobal.off(event)
    }

    getGlobal(): Promise<any> {
        return this.global
    }

    setGlobal(global): void {
        this.global = global
    }
}
