// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */

import QlikAppFieldQFieldApi from './qlik.root.app.field.qfield'

// https://help.qlik.com/en-US/sense-developer/April2020/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/qlik-field-interface.htm
export default class QlikAppFieldApi {
    $apiField: QlikAppFieldQFieldApi

    constructor(field) {
        this.$apiField = new QlikAppFieldQFieldApi(field)
    }
}

export { QlikAppFieldApi }
