// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */

//PAM: Capability API Wrapper Class
export default class QixMeasureApi {
    dMeasure: EngineAPI.IGenericMeasure

    constructor(measure: EngineAPI.IGenericMeasure) {
        this.dMeasure = measure
    }

    async getMeasure(): Promise<EngineAPI.IGenericMeasureProperties> {
        let prop = null
        try {
            prop = await this.dMeasure.getMeasure()
            return prop
        } catch (error) {}
    }

    async getLinkedObjects(): Promise<EngineAPI.INxLinkedObjectInfo[]> {
        let prop = null
        try {
            prop = await this.dMeasure.getLinkedObjects()
            return prop
        } catch (error) {}
    }

    async getProperties(): Promise<EngineAPI.IGenericMeasureProperties> {
        let prop = null
        try {
            prop = await this.dMeasure.getProperties()
            return prop
        } catch (error) {}
    }

    async getLayout(): Promise<EngineAPI.IGenericMeasureLayout> {
        try {
            prop = await this.dMeasure.getLayout()
            return prop
        } catch (error) {}
    }

    async getInfo(): Promise<EngineAPI.INxInfo> {
        try {
            prop = await this.dMeasure.getInfo()
            return prop
        } catch (error) {}
    }

    async setProperties(qProp: EngineAPI.IGenericMeasureProperties): Promise<void> {
        try {
            prop = await this.dMeasure.setProperties(qProp)
            return prop
        } catch (error) {}
    }

    async applyPatches(qPatches: EngineAPI.INxPatch[]): Promise<void> {
        try {
            prop = await this.dMeasure.applyPatches(qPatches)
            return prop
        } catch (error) {}
    }

    async approve(): Promise<void> {
        try {
            return await this.dMeasure.approve()
        } catch (error) {}
    }

    async unApprove(): Promise<void> {
        try {
            return await this.dMeasure.unApprove()
        } catch (error) {}
    }

    async publish(): Promise<void> {
        try {
            return await this.dMeasure.publish()
        } catch (error) {}
    }

    async unPublish(): Promise<void> {
        try {
            return await this.dMeasure.unPublish()
        } catch (error) {}
    }
}
