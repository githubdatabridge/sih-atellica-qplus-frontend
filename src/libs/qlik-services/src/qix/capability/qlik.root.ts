// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */

import { QlikConfigService } from 'services/qlikConfigService'

import QlikGlobalApi from './qlik.global'
import QlikAppApi from './qlik.root.app'
import QlikThemeApi from './qlik.theme'

export { QlikAppApi }

//PAM: Capability API Wrapper Class
export default class QlikRootApi {
    qlik: any
    config: any
    $apiGlobal: QlikGlobalApi
    $apiApps: Map<string, QlikAppApi>
    $apiTheme: QlikThemeApi

    static async initialize(environment, qlik, config): QlikRootApi {
        const r = new QlikRootApi()
        r.qlik = qlik
        r.config = config
        r.$apiTheme = new QlikThemeApi(qlik.theme)
        r.$apiGlobal = null //await QlikGlobalApi.create(environment, qlik, config)
        r.$apiApps = new Map<string, QlikAppApi>()
        return r
    }

    getTheme(): any {
        return qlik
    }

    setTheme(qlik: any): void {
        this.$apiTheme = new QlikThemeApi(qlik.theme)
    }

    async getCurrentApp(): Promise<any> {
        return await this.qlik.currApp()
    }

    async getGlobal(): Promise<QlikGlobalApi> {
        return new QlikGlobalApi(await this.qlik.getGlobal())
    }

    async openApp(appId: string, config?: QlikConfigService): Promise<QlikAppApi> {
        return await new QlikAppApi(this.qlik.openApp(appId, config))
    }

    async getThemeList(): Promise<any> {
        return await this.qlik.getThemeList()
    }

    resize(): void {
        return this.qlik.resize()
    }

    async createsSessionApp(config): Promise<QlikAppApi> {
        return new QlikAppApi(this.qlik.sessionApp(config))
    }

    async createsSessionAppFromApp(appId: string, config?: QlikConfigService): Promise<QlikAppApi> {
        return await new QlikAppApi(this.qlik.sessionAppFromApp(appId, config))
    }

    async registerApp(name: string, app: any): Promise<Map<string, QlikAppApi>> {
        this.$apiApps.set(name, app as QlikAppApi)
        return this.$apiApps
    }

    async unregisterApp(name: string, events?: string[]): Promise<Map<string, QlikAppApi>> {
        const app = this.$apiApps.get(name)
        if (app) {
            await app.close()
            this.$apiApps.delete(name)
        }
        return this.$apiApps
    }

    async setDeviceType(type: string): void {
        return await this.qlik.setDeviceType(type)
    }

    async setLanguage(lang: string): void {
        return await this.qlik.setLanguage(lang)
    }
}
