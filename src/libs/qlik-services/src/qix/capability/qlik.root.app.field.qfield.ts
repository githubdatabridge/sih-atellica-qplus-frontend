// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */
import { QAppFieldOptions } from '@libs/qlik-models'

import QlikAppFieldQFieldValueApi from './qlik.app.field.qfieldvalue'

// https://help.qlik.com/en-US/sense-developer/April2020/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/qlik-field-interface.htm
export default class QlikAppFieldQFieldApi {
    qField: any
    fieldValue: QlikAppFieldQFieldValueApi

    constructor(field) {
        this.qField = field
    }

    async clear(): Promise<any> {
        try {
            return await this.qField.clear()
        } catch (error) {}
    }

    async clearOther(softLock = false): Promise<any> {
        return await this.qField.clearOther(softLock)
    }

    async getData(options?: QAppFieldOptions): Promise<any> {
        return await this.qField.getData(options)
    }

    async getMoreData(): Promise<any> {
        return await this.qField.getMoreData()
    }

    registerOnData(fieldObject: any, callback): void {
        fieldObject.OnData.bind(callback)
    }

    unregisterOnData(): void {
        this.qField.OnData.unbind(callback)
    }

    async lock(): Promise<any> {
        return await this.qField.lock()
    }

    async unlock(): Promise<any> {
        return await this.qField.unlock()
    }

    async select(values: number[], toggle = false, softlock = false): Promise<any> {
        return await this.qField.select(values, toggle, softlock)
    }

    async selectAll(softlock = false): Promise<any> {
        return await this.qField.selectAll(softlock)
    }

    async selectAlternative(softlock = false): Promise<any> {
        return await this.qField.selectAlternative(softlock)
    }

    async selectExcluded(softlock = false): Promise<any> {
        return await this.qField.selectExcluded(softlock)
    }

    async selectMatch(match: string, softlock = false): Promise<any> {
        return await this.qField.selectMatch(match, softlock)
    }

    async selectPossible(softlock = false): Promise<any> {
        return await this.qField.selectPossible(softlock)
    }

    async selectValues(array: any[], toggle = false, softlock = false): Promise<any> {
        return await this.qField.selectValues(array, toggle, softlock)
    }

    async toggleSelect(match: string, softlock = false): Promise<any> {
        return await this.qField.toggleSelect(match, softlock)
    }

    getField(): Promise<any> {
        return this.field
    }

    setField(field): void {
        this.field = field
    }
}
