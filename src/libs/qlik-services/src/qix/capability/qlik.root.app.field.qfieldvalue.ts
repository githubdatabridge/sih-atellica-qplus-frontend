// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */

// https://help.qlik.com/en-US/sense-developer/April2020/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/qlik-field-interface.htm
export default class QlikAppFieldQFieldValueApi {
    qFieldValue: any

    constructor(fieldValue) {
        this.qFieldValue = fieldValue
    }

    async select(toggle?: boolean, softLock?: boolean) {
        return await this.qFieldValue.select(toggle, softLock)
    }
}
