// @ts-nocheck

import * as enigma from 'enigma.js'
import schema from 'enigma.js/schemas/12.170.2'
import SenseUtilities from 'enigma.js/sense-utilities'

import { QsGetConfig } from '../../services/qlikConfigService'
import QixDocApi from './qix.global.doc'
import { docMixin } from './qix.mixins.docs'

/**
 * @packageDocumentation
 * @module QixServices
 */

//PAM: Capability API Wrapper Class
export default class QixGlobalApi {
    session: any
    $apiDoc: QixDocApi
    $apiDocs: Map<string, QixDocApi>
    qGlobal: EngineAPI.IGlobal
    dAuthenticatedUser: string
    dEngineVersion: string
    dProductVersion: string
    dQTProduct: string

    static async create(environment, config, onQlikEngineSessionErrorCallback: any): QixGlobalApi {
        try {
            const o = new QixGlobalApi()
            o.qGlobal = await o.initialize(config, onQlikEngineSessionErrorCallback)
            o.dEngineVersion = await o.getEngineVersion()
            o.dQTProduct = await o.getQTProduct()
            o.dAuthenticatedUser = await o.getAuthenticatedUser()
            o.$apiDocs = new Map<string, QixDocApi>()
            return o
        } catch (error) {
            //Handle Error
        }
    }

    static async createInternal(): QixGlobalApi {
        try {
            const o = new QixGlobalApi()
            o.$apiDocs = new Map<string, QixDocApi>()
            return o
        } catch (error) {
            //Handle Error
        }
    }

    async initialize(
        config: QsGetConfig,
        onQlikEngineSessionErrorCallback?: any
    ): EngineAPI.IGlobal {
        try {
            const url: string = SenseUtilities.buildUrl(config)
            const session = enigma.create({
                schema,
                mixins: [docMixin],
                url,
                responseInterceptors: [
                    {
                        onRejected: function logError(sessionReference, request, error) {
                            if (onQlikEngineSessionErrorCallback) {
                                onQlikEngineSessionErrorCallback(
                                    config.appId,
                                    sessionReference,
                                    request,
                                    error.code,
                                    error.parameter,
                                    error.message
                                )
                                console.log(
                                    'Error returned from QIX engine',
                                    error,
                                    'Originating request:',
                                    request
                                )
                                // throw error so it's continued to be rejected:
                                throw error
                            }
                        }
                    }
                ],
                suspendOnClose: true
            })
            return await session.open()
        } catch (error) {
            //Handle Error
        }
    }

    async setDoc(enigmaApp: any): EngineAPI.IApp {
        this.$apiDoc = await QixDocApi.create(enigmaApp)
        return this.$apiDoc
    }

    async openDoc(qDocName: string): EngineAPI.IApp {
        this.$apiDoc = new QixDocApi(await this.qGlobal.openDoc(qDocName))
        return this.$apiDoc
    }

    async getActiveDoc(): EngineAPI.IApp {
        this.$apiDoc = new QixDocApi(await this.qGlobal.getActiveDoc())
        return this.$apiDoc
    }

    async registerApp(name: string, doc: any): Promise<Map<string, QixDocApi>> {
        this.$apiDocs.set(name, doc as QixDocApi)

        return this.$apiDocs
    }

    async unregisterApp(name: string, events?: string[]): Promise<Map<string, QixDocApi>> {
        const doc = this.$apiDocs.get(name)
        events.forEach(event => {
            doc?.unregisterEvent(event)
        })
        doc.dSession.close()
        this.$apiDocs.delete(name)
        return this.$apiDocs
    }

    async getAuthenticatedUser(): any {
        return await this.qGlobal.getAuthenticatedUser()
    }

    async getEngineVersion(): any {
        const engineVersion = await this.qGlobal.engineVersion()
        return engineVersion?.qComponentVersion
    }

    async getOsVersion(): any {
        return await this.qGlobal.OSVersion()
    }

    async getOsName(): any {
        return await this.qGlobal.OSName()
    }

    async getQTProduct(): any {
        return await this.qGlobal.qTProduct()
    }

    async isDesktopMode(): any {
        return await this.qGlobal.IsDesktopMode()
    }

    async getAppEntry(): EngineAPI.IAppEntry {
        return await this.qGlobal.getAppEntry(this.appId)
    }

    registerEvent(event: string, callback): void {
        this.qGlobal.on(event, callback)
    }

    unregisterEvent(event: string): void {
        this.qGlobal.off(event)
    }
}
