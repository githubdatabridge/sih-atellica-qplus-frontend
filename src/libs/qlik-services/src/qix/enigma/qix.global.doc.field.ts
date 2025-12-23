/// <reference types="@types/qlik-engineapi" />

//PAM: Capability API Wrapper Class
export default class QixFieldApi {
    dField: EngineAPI.IField

    constructor(field: EngineAPI.IField) {
        this.dField = field
    }

    async lock(): Promise<boolean> {
        return await this.dField.lock()
    }

    async unLock(): Promise<boolean> {
        return await this.dField.unlock()
    }

    async clear(): Promise<boolean> {
        return await this.dField.clear()
    }

    async select(
        qValues: number[],
        qSoftLock?: boolean,
        qExcludedValuesMode?: boolean
    ): Promise<boolean> {
        return await this.dField.lowLevelSelect(qValues, Boolean(qSoftLock), qExcludedValuesMode)
    }

    async toggleSelect(
        qMatch: string,
        qSoftLock?: boolean,
        qExcludedValuesMode?: number
    ): Promise<boolean> {
        return await this.dField.toggleSelect(qMatch, qSoftLock, qExcludedValuesMode)
    }

    async selectValues(
        qFieldValues: EngineAPI.IFieldValue[],
        qToggleMode?: boolean,
        qSoftLock?: boolean
    ): Promise<boolean> {
        return await this.dField.selectValues(qFieldValues, qToggleMode, qSoftLock)
    }

    async selectAll(qSoftLock?: boolean): Promise<boolean> {
        return await this.dField.selectAll(qSoftLock)
    }

    async selectAlternative(qSoftLock?: boolean): Promise<boolean> {
        return await this.dField.selectAlternative(qSoftLock)
    }

    async selectExcluded(qSoftLock?: boolean): Promise<boolean> {
        return await this.dField.selectExcluded(qSoftLock)
    }

    async selectPossible(qSoftLock?: boolean): Promise<boolean> {
        return await this.dField.selectPossible(qSoftLock)
    }

    async lowLevelSelect(
        qValues: number[],
        qToggleMode = false,
        qSoftLock?: boolean
    ): Promise<boolean> {
        return await this.dField.lowLevelSelect(qValues, qToggleMode, qSoftLock)
    }

    async clearAllButThis(): Promise<boolean> {
        return await this.dField.clearAllButThis()
    }

    async getAndMode(): Promise<boolean> {
        return await this.dField.getAndMode()
    }

    async setAndMode(qAndMode: boolean): Promise<void> {
        return await this.dField.setAndMode(qAndMode)
    }

    async getCardinal(): Promise<number> {
        return await this.dField.getCardinal()
    }

    async getNxProperties(): Promise<EngineAPI.INxFieldProperties> {
        return await this.dField.getNxProperties()
    }

    async setNxProperties(qProperties: EngineAPI.INxFieldProperties): Promise<void> {
        return await this.dField.setNxProperties(qProperties)
    }
}
