// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */

//PAM: Capability API Wrapper Class
export default class QixBookmarkApi {
    dBookmark: EngineAPI.IGenericBookmark

    constructor(bookmark: EngineAPI.IGenericBookmark) {
        this.dBookmark = bookmark
    }

    async getProperties(): Promise<EngineAPI.IGenericBookmarkProperties> {
        let prop = null
        try {
            prop = await this.dBookmark.getProperties()
            return prop
        } catch (error) {}
    }

    async getLayout(): Promise<EngineAPI.IGenericBookmarkLayout> {
        try {
            prop = await this.dBookmark.getLayout()
            return prop
        } catch (error) {}
    }

    async getInfo(): Promise<EngineAPI.INxInfo> {
        try {
            prop = await this.dBookmark.getInfo()
            return prop
        } catch (error) {}
    }

    async apply(): boolean {
        try {
            prop = await this.dBookmark.apply()
            return prop
        } catch (error) {}
    }

    async setProperties(qProp: EngineAPI.IGenericBookmarkProperties): Promise<void> {
        try {
            prop = await this.dBookmark.setProperties(qProp)
            return prop
        } catch (error) {}
    }

    async applyPatches(qPatches: EngineAPI.INxPatch[]): Promise<void> {
        try {
            prop = await this.dBookmark.applyPatches(qPatches)
            return prop
        } catch (error) {}
    }

    async approve(): Promise<void> {
        try {
            return await this.dBookmark.approve()
        } catch (error) {}
    }

    async unApprove(): Promise<void> {
        try {
            return await this.dBookmark.unApprove()
        } catch (error) {}
    }

    async publish(): Promise<void> {
        try {
            return await this.dBookmark.publish()
        } catch (error) {}
    }

    async unPublish(): Promise<void> {
        try {
            return await this.dBookmark.unPublish()
        } catch (error) {}
    }
}
