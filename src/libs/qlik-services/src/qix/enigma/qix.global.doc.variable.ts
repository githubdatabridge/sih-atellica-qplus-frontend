// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */

//PAM: Capability API Wrapper Class
export default class QixVariableApi {
    dVariable: EngineAPI.IGenericVariable

    constructor(variable: EngineAPI.IGenericVariable) {
        this.dVariable = variable
    }

    async getProperties(): Promise<EngineAPI.IGenericVariableProperties> {
        let prop = null
        try {
            prop = await this.dVariable.getProperties()
            return prop
        } catch (error) {}
    }

    async getLayout(): Promise<EngineAPI.IGenericVariableLayout> {
        try {
            prop = await this.dVariable.getLayout()
            return prop
        } catch (error) {}
    }

    async getInfo(): Promise<EngineAPI.INxInfo> {
        try {
            prop = await this.dVariable.getInfo()
            return prop
        } catch (error) {}
    }

    async setProperties(qProp: EngineAPI.IGenericVariableProperties): Promise<void> {
        try {
            prop = await this.dVariable.setProperties(qProp)
            return prop
        } catch (error) {}
    }

    async applyPatches(qPatches: EngineAPI.INxPatch[]): Promise<void> {
        try {
            prop = await this.dVariable.applyPatches(qPatches)
            return prop
        } catch (error) {}
    }

    async setDualValue(qText: string, qNum: string): Promise<void> {
        try {
            return await this.dVariable.setDualValue(qText, qNum)
        } catch (error) {}
    }

    async setNumValue(qVal: number): Promise<void> {
        try {
            return await this.dVariable.setNumValue(qVal)
        } catch (error) {}
    }

    async setStringValue(qVal: string): Promise<void> {
        try {
            return await this.dVariable.setStringValue(qVal)
        } catch (error) {}
    }

    async publish(): Promise<void> {
        try {
            return await this.dVariable.publish()
        } catch (error) {}
    }

    async unPublish(): Promise<void> {
        try {
            return await this.dVariable.unPublish()
        } catch (error) {}
    }
}
