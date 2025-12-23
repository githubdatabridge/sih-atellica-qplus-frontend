// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */

//PAM: Capability API Wrapper Class
export default class QlikAppSelectionQSelectionStateApi {
    qSelectionState

    constructor(selectionState) {
        this.qSelectionState = selectionState
    }

    async clearAll(lockedAlso = false): Promise<any> {
        return await this.qSelectionState.clearAll(lockedAlso)
    }

    async lockAll(): Promise<any> {
        return await this.qSelectionState.lockAll()
    }

    async unlockAll(): Promise<any> {
        return await this.qSelectionState.unlockAll()
    }

    async registerSelectionListener(callback) {
        await this.qSelectionState.OnData.bind(callback)
        return this.qSelectionState
    }

    async unregisterSelectionListener(callback) {
        return await this.qSelectionState.OnData.unbind(callback)
    }

    getSelectionState(): any {
        return this.qSelectionState
    }

    setSelectionState(selectionState): void {
        this.qSelectionState = selectionState
    }
}
