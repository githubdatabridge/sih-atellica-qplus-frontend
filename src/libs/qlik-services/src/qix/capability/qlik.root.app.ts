// @ts-nocheck

import QlikAppBookmarkApi from './qlik.root.app.bookmark'
import QlikAppFieldApi from './qlik.root.app.field'
import QlikAppSelectionApi from './qlik.root.app.selection'
import QlikAppVariableApi from './qlik.root.app.variable'
import QlikAppVisualizationApi from './qlik.root.app.visualization'

/**
 * @packageDocumentation
 * @module QixServices
 * https://help.qlik.com/en-US/sense-developer/April2020/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/qlik-app-interface.htm
 */
//PAM: Capability API Wrapper Class
export default class QlikAppApi {
    qApp: any
    $apiBookmark: QlikAppBookmarkApi
    $apiVisualization: QlikAppVisualizationApi
    $apiSelection: QlikAppSelectionApi
    $apiVariable: QlikAppVariableApi

    constructor(app) {
        this.qApp = app
        this.$apiBookmark = new QlikAppBookmarkApi(this.qApp.bookmark)
        this.$apiVisualization = new QlikAppVisualizationApi(this.qApp.visualization)
        this.$apiVariable = new QlikAppVariableApi(this.qApp.variable)
        this.$apiSelection = new QlikAppSelectionApi(this.qApp.selectionState())
    }

    async addAlternateState(stateName: string): Promise<any> {
        return await this.qApp.addAlternateState(stateName)
    }

    async back(): Promise<any> {
        return await this.qApp.back()
    }

    async clearAll(lockedAlso = false, state = '$'): Promise<any> {
        return await this.qApp.clearAll(lockedAlso, state)
    }

    async selectFieldValues(
        field: string,
        values: any[],
        toggle = false,
        softLock = true
    ): Promise<any> {
        return await this.qApp.field(field).selectValues(values, toggle, softLock)
    }

    getField(name: string): QlikAppFieldApi {
        return new QlikAppFieldApi(this.qApp.field(name))
    }

    async close(): void {
        await this.qApp.close()
    }

    async createCube(def, callback): Promise {
        return await this.qApp.createCube(def, callback)
    }

    async createGenericObject(def, callback): Promise<any> {
        const object = await this.qApp.createGenericObject(def, callback)
        return object
    }

    async createList(def, callback): Promise<any> {
        return await this.qApp.createList(def, callback)
    }

    async destroySessionObject(id: string): Promise<any> {
        return await this.qApp.destroySessionObject(id)
    }

    async forward(): Promise<any> {
        return await this.qApp.forward()
    }

    async getAppLayout(callback?: any): Promise<any> {
        return await this.qApp.getAppLayout(callback)
    }

    async getList(type: string, callback): Promise<any> {
        return await this.qApp.getList(type, callback)
    }

    async getObject(elem: string, id: string, options): Promise<any> {
        return await this.qApp.getObject(elem, id, options)
    }

    async getObjectProperties(id: string): Promise<any> {
        return await this.qApp.getObjectProperties(id)
    }

    async getAppObjectList(type: string, callback): Promise<any> {
        return await this.qApp.getAppObjectList(type, callback)
    }

    async getSnapshot(elem: string, id: string): Promise<any> {
        return await this.qApp.getSnapshot(elem, id)
    }

    async lockAll(): Promise<any> {
        return await this.qApp.lockAll()
    }

    async removeAlternateState(state: string): Promise<any> {
        return await this.qApp.removeAlternateState(state)
    }

    async selectionState(state = '$'): Promise<any> {
        return await this.qApp.selectionState(state)
    }

    async unlockAll(): Promise<any> {
        return await this.qApp.unlockAll()
    }

    async registerEvent(event: string, callback): void {
        if (this.qApp) await this.qApp.on(event, callback)
    }

    async unregisterEvent(event: string): void {
        if (this.qApp) await this.qApp.off(event)
    }

    get(): any {
        return this.qApp
    }

    set(app: any) {
        this.qApp = app
    }
}
