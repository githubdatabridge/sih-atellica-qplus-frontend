// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */

import QlikAppSelectionQSelectionApi from './qlik.root.app.selection.qselectionstate'

//PAM: Capability API Wrapper Class
export default class QlikAppSelectionApi {
    $apiSelectionState: QlikAppSelectionQSelectionApi

    constructor(selectionState: () => void) {
        this.$apiSelectionState = new QlikAppSelectionQSelectionApi(selectionState)
    }

    getSelectionState(): any {
        return this.apiSelectionState
    }

    setSelectionState(selectionState): void {
        this.apiSelectionState = selectionState
    }
}

export { QlikAppSelectionApi }
