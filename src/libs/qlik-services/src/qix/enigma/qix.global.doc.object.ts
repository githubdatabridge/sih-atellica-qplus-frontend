// @ts-nocheck

import QixBookmarkApi from './qix.global.doc.bookmark'

/**
 * @packageDocumentation
 * @module QixServices
 */

//PAM: Capability API Wrapper Class
export default class QixObjectApi {
    dObject: EngineAPI.IGenericObject
    dLayout: EngineAPI.IGeneric

    constructor(object: EngineAPI.IGenericObject) {
        this.dObject = object
    }

    async abortListObjectSearch(): Promise<void> {
        return await this.dObject.abortListObjectSearch()
    }

    async acceptListObjectSearch(
        qPath = '/qListObjectDef',
        qToggleMode = false,
        qSoftLock?: boolean
    ): Promise<void> {
        return await this.dObject.acceptListObjectSearch(qPath, qToggleMode, qSoftLock)
    }

    async beginSelections(qPaths: string[]): Promise<void> {
        return await this.dObject.beginSelections(qPaths)
    }

    async endSelections(qAccept: boolean): Promise<void> {
        return await this.dObject.endSelections(qAccept)
    }

    async searchListObjectFor(qPath: string, qMatch: string): Promise<boolean> {
        return await this.dObject.searchListObjectFor(qPath, qMatch)
    }

    async selectListObjectAll(qPath = '/qListObjectDef', qSoftLock?: boolean): Promise<boolean> {
        return await this.dObject.selectListObjectAll(qPath, qSoftLock)
    }

    async selectListObjectAlternative(
        qPath = '/qListObjectDef',
        qSoftLock?: boolean
    ): Promise<boolean> {
        return await this.dObject.selectListObjectAlternative(qPath, qSoftLock)
    }

    async selectListObjectExcluded(
        qPath = '/qListObjectDef',
        qSoftLock?: boolean
    ): Promise<boolean> {
        return await this.dObject.selectListObjectExcluded(qPath, qSoftLock)
    }

    async selectListObjectValues(
        qPath = '/qListObjectDef',
        qValues: number[],
        qToggleMode = true,
        qSoftLock?: boolean
    ): Promise<boolean> {
        return await this.dObject.selectListObjectValues(qPath, qValues, qToggleMode, qSoftLock)
    }

    async selectListObjectPossible(
        qPath = '/qListObjectDef',
        qSoftLock?: boolean
    ): Promise<boolean> {
        return await this.dObject.selectListObjectPossible(qPath, qSoftLock)
    }

    async selectListObjectContinuousRange(
        qPath = '/qListObjectDef',
        qRanges: EngineAPI.IRange[],
        qSoftLock?: boolean
    ): Promise<boolean> {
        return await this.dObject.selectListObjectContinuousRange(qPath, qRanges, qSoftLock)
    }

    async selectPivotCells(
        qPath = '/qHypercubeDef',
        qSelections: EngineAPI.INxSelectionCell[],
        qSoftLock?: boolean,
        qDeselectOnlyOneSelected?: boolean
    ): Promise<boolean> {
        return await this.dObject.selectPivotCells(
            qPath,
            qSelections,
            qSoftLock,
            qDeselectOnlyOneSelected
        )
    }

    async selectHyperCubeValues(
        qPath: string,
        qDimInfo: number,
        qValues: number[],
        qToggleMode = true
    ): Promise<boolean> {
        return await this.dObject.selectHyperCubeValues(qPath, qDimInfo, qValues, qToggleMode)
    }

    async selectHyperCubeContinuousRange(
        qPath: string,
        qRanges: EngineAPI.INxContinuousRangeSelectInfo,
        qSoftLock?: boolean
    ): Promise<boolean> {
        return await this.dObject.selectHyperCubeContinuousRange(qPath, qRanges, qSoftLock)
    }

    async selectHyperCubeCells(
        qPath: string,
        qRowIndices: number[],
        qColIndices: number[],
        qSoftLock?: boolean,
        qDeselectOnlyOneSelected?: boolean
    ): Promise<boolean> {
        return await this.dObject.selectHyperCubeCells(
            qPath,
            qRowIndices,
            qColIndices,
            qSoftLock,
            qDeselectOnlyOneSelected
        )
    }

    async lock(qPath: string, qColIndices?: number[]): Promise<void> {
        return await this.dObject.lock(qPath, qColIndices)
    }

    async clearSelections(qPath: string, qColIndices?: number[]): Promise<void> {
        return await this.dObject.clearSelections(qPath, qColIndices)
    }

    async clearSoftPatches(): Promise<void> {
        return await this.dObject.clearSoftPatches()
    }

    async copyFrom(qFromId: string): Promise<void> {
        return await this.dObject.copyFrom(qFromId)
    }

    async getChild(qId: string): Promise<QixObjectApi> {
        return await new QixObjectApi(await this.dObject.getChild(qId))
    }

    async getChildInfos(): Promise<EngineAPI.INxInfo[]> {
        return await this.dObject.getChildInfos()
    }

    async createChild(
        qProp: EngineAPI.IGenericObjectProperties,
        qPropForThis?: EngineAPI.IGenericObjectProperties
    ): Promise<QixObjectApi> {
        return new QixObjectApi(await this.dObject.createChild(qProp, qPropForThis))
    }

    async getProperties(): Promise<EngineAPI.IGenericObjectProperties> {
        return await this.dObject.getProperties()
    }

    async getSnapshotObject(): EngineAPI.IGenericObjectProperties {
        return new QixBookmarkApi(this.dObject.getSnapshotObject())
    }

    async getHyperCubeData(
        qPath: string,
        qPages: EngineAPI.INxPage[]
    ): Promise<EngineAPI.INxDataPage[]> {
        return await this.dObject.getHyperCubeData(qPath, qPages)
    }

    async getHyperCubePivotData(
        qPath: string,
        qPages: EngineAPI.INxPage
    ): Promise<EngineAPI.INxPivotPage[]> {
        return await this.dObject.getHyperCubePivotData(qPath, qPages)
    }

    async getHyperCubeStackData(
        qPath: string,
        qPages: EngineAPI.INxPage,
        qMaxNbrCells = 10000
    ): Promise<EngineAPI.INxStackPage[]> {
        return await this.dObject.getHyperCubeStackData(qPath, qPages, qMaxNbrCells)
    }

    async getHyperCubeReducedData(
        qPath: string,
        qPages: EngineAPI.INxPage,
        qZoomFactor: number,
        qReductionMode: string
    ): Promise<EngineAPI.INxDataPage[]> {
        return await this.dObject.getHyperCubeReducedData(
            qPath,
            qPages,
            qZoomFactor,
            qReductionMode
        )
    }

    async setChildArrayOrder(qIds: string[]): Promise<void> {
        return await this.dObject.setChildArrayOrder(qIds)
    }

    async setFullPropertyTree(qPropEntry: EngineAPI.IGenericObjectEntry): Promise<void> {
        return await this.dObject.setFullPropertyTree(qPropEntry)
    }

    async getFullPropertyTree(): Promise<EngineAPI.IGenericObjectEntry> {
        return await this.dObject.getFullPropertyTree()
    }

    async getEffectiveProperties(): Promise<EngineAPI.IGenericObjectProperties> {
        return await this.dObject.getEffectiveProperties()
    }

    async getInfo(): Promise<EngineAPI.INxInfo> {
        return await this.dObject.getInfo()
    }

    async getLayout(): Promise<EngineAPI.IGenericBaseLayout> {
        return await this.dObject.getLayout()
    }

    async getHypercubeLayout(): Promise<EngineAPI.IGenericHyperCubeLayout> {
        return (await this.dObject.getLayout()) as EngineAPI.IGenericHyperCubeLayout
    }

    async destroyAllChildren(qPropForThis?: EngineAPI.IGenericObjectProperties): Promise<void> {
        return await this.dObject.destroyAllChildren(qPropForThis)
    }

    async destroyChild(
        qId: string,
        qPropForThis?: EngineAPI.IGenericObjectProperties
    ): Promise<boolean> {
        return await this.dObject.destroyChild(qId, qPropForThis)
    }

    async getLinkedObjects(): Promise<EngineAPI.INxLinkedObjectInfo[]> {
        return await this.dObject.getLinkedObjects()
    }

    async embedSnapshotObject(qId: string): Promise<void> {
        return await this.dObject.embedSnapshotObject(qId)
    }

    async setProperties(qProp: EngineAPI.IGenericObjectProperties): Promise<void> {
        return await this.dObject.setProperties(qProp)
    }

    async applyPatches(qPatches: EngineAPI.INxPatch[]): Promise<void> {
        return await this.dObject.applyPatches(qPatches)
    }

    async approve(): Promise<void> {
        return await this.dObject.approve()
    }

    async unApprove(): Promise<void> {
        return await this.dObject.unApprove()
    }

    async publish(): Promise<void> {
        return await this.dObject.publish()
    }

    async unPublish(): Promise<void> {
        return await this.dObject.unPublish()
    }
}
