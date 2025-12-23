// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */

//PAM: Capability API Wrapper Class
export default class QixDimensionApi {
    dDimension: EngineAPI.IGenericDimension

    constructor(dimension: EngineAPI.IGenericDimension) {
        this.dDimension = dimension
    }

    async getDimension(): Promise<EngineAPI.IGenericDimensionProperties> {
        let prop = null
        try {
            prop = await this.dDimension.getDimension()
            return prop
        } catch (error) {}
    }

    async getLinkedObjects(): Promise<EngineAPI.INxLinkedObjectInfo[]> {
        let prop = null
        try {
            prop = await this.dDimension.getLinkedObjects()
            return prop
        } catch (error) {}
    }

    async getProperties(): Promise<EngineAPI.IGenericDimensionProperties> {
        let prop = null
        try {
            prop = await this.dDimension.getProperties()
            return prop
        } catch (error) {}
    }

    async getLayout(): Promise<EngineAPI.IGenericDimensionLayout> {
        try {
            prop = await this.dDimension.getLayout()
            return prop
        } catch (error) {}
    }

    async getInfo(): Promise<EngineAPI.INxInfo> {
        try {
            prop = await this.dDimension.getInfo()
            return prop
        } catch (error) {}
    }

    async setProperties(qProp: EngineAPI.IGenericDimensionProperties): Promise<void> {
        try {
            prop = await this.dDimension.setProperties(qProp)
            return prop
        } catch (error) {}
    }

    async applyPatches(qPatches: EngineAPI.INxPatch[]): Promise<void> {
        try {
            prop = await this.dDimension.applyPatches(qPatches)
            return prop
        } catch (error) {}
    }

    async approve(): Promise<void> {
        try {
            return await this.dDimension.approve()
        } catch (error) {}
    }

    async unApprove(): Promise<void> {
        try {
            return await this.dDimension.unApprove()
        } catch (error) {}
    }

    async publish(): Promise<void> {
        try {
            return await this.dDimension.publish()
        } catch (error) {}
    }

    async unPublish(): Promise<void> {
        try {
            return await this.dDimension.unPublish()
        } catch (error) {}
    }
}
