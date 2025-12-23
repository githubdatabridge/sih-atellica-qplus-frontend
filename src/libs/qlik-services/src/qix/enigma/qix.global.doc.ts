// @ts-nocheck

import QixBookmarkApi from './qix.global.doc.bookmark'
import QixDimensionApi from './qix.global.doc.dimension'
import QixFieldApi from './qix.global.doc.field'
import QixMeasureApi from './qix.global.doc.measure'
import QixObjectApi from './qix.global.doc.object'
import QixVariableApi from './qix.global.doc.variable'

/**
 * @packageDocumentation
 * @module QixServices
 */

//PAM: Capability API Wrapper Class
export default class QixDocApi {
    dApp: EngineAPI.IApp
    dSession: any
    $apiBookmark: QixBookmarkApi

    constructor(app: EngineAPI.IApp) {
        this.dApp = app
        this.dSession = app.session
    }

    static async create(app: EngineAPI.IApp): QixDocApi {
        try {
            const o = new QixDocApi(app)
            return o
        } catch (error) {
            //Handle Error
        }
    }

    async publish(qStreamId: string, qName?: string): Promise<void> {
        return await this.dApp.publish(qStreamId, qName)
    }

    async removeAlternateState(qStateName: string): Promise<void> {
        return await this.dApp.removeAlternateState(qStateName)
    }

    async redo(): Promise<boolean> {
        return await this.dApp.redo()
    }

    async undo(): Promise<boolean> {
        return await this.dApp.undo()
    }

    async resume(): Promise<void> {
        return await this.dApp.resume()
    }

    async saveObjects(): Promise<void> {
        return await this.dApp.saveObjects()
    }

    async setAppProperties(qProp: EngineAPI.INxAppProperties): Promise<void> {
        return await this.dApp.setAppProperties(qProp)
    }

    async setFavoriteVariables(qNames: string[]): Promise<void> {
        return await this.dApp.setFavoriteVariables(qNames)
    }

    async setFetchLimit(qLimit: number): Promise<void> {
        return await this.dApp.setFetchLimit(qLimit)
    }

    async scramble(qFieldName: string): Promise<void> {
        return await this.dApp.scramble(qFieldName)
    }

    async searchObjects(
        qOptions: EngineAPI.ISearchObjectOptions,
        qTerms: string[],
        qPage: EngineAPI.ISearchPage
    ): Promise<EngineAPI.ISearchResult> {
        return await this.dApp.searchObjects(qOptions, qTerms, qPage)
    }

    async searchResults(
        qOptions: EngineAPI.ISearchCombinationOptions,
        qTerms: string[],
        qPage: EngineAPI.ISearchPage
    ): Promise<EngineAPI.ISearchResult> {
        return await this.dApp.searchResults(qOptions, qTerms, qPage)
    }

    async searchSuggest(
        qOptions: EngineAPI.ISearchCombinationOptions,
        qTerms: string[]
    ): Promise<EngineAPI.ISearchSuggestionResult> {
        return await this.dApp.searchSuggest(qOptions, qTerms)
    }

    async unlockAll(qStateName?: string): Promise<void> {
        return await this.dApp.unlockAll(qStateName)
    }

    async lockAll(qStateName?: string): Promise<void> {
        return await this.dApp.lockAll(qStateName)
    }

    async clearAll(qLockedAlso?: boolean, qStateName?: string): Promise<EngineAPI.ISearchResult> {
        return await this.dApp.clearAll(qLockedAlso, qStateName)
    }

    async clearUndoBuffer(): Promise<void> {
        return await this.dApp.clearUndoBuffer()
    }

    async back(): Promise<void> {
        return await this.dApp.back()
    }

    async forward(): Promise<void> {
        return await this.dApp.forward()
    }

    async backCount(): Promise<number> {
        return await this.dApp.backCount()
    }

    async forwardCount(): Promise<number> {
        return await this.dApp.forwardCount()
    }

    async getAllInfos(): Promise<EngineAPI.INxInfo[]> {
        return await this.dApp.getAllInfos()
    }

    async getAppLayout(): Promise<EngineAPI.INxAppLayout> {
        return await this.dApp.getAppLayout()
    }

    async getAppProperties(): Promise<EngineAPI.INxAppProperties> {
        return await this.dApp.getAppProperties()
    }

    async getAssociationScores(
        qTable1: string,
        qTable2: string
    ): Promise<EngineAPI.IAssociationScore> {
        return await this.dApp.getAssociationScores(qTable1, qTable2)
    }

    async checkExpression(
        qExpr: string,
        qLabels?: string[]
    ): Promise<EngineAPI.ICheckExpressionResult> {
        return await this.dApp.checkExpression(qExpr, qLabels)
    }

    async checkNumberOrExpression(
        qExpr: string
    ): Promise<EngineAPI.ICheckNumberOrExpressionResult> {
        return await this.dApp.checkNumberOrExpression(qExpr)
    }

    async checkScriptSyntax(): Promise<EngineAPI.IScriptSyntaxError> {
        return await this.dApp.checkScriptSyntax()
    }

    async createSessionObject(qProp: any): Promise<EngineAPI.IGenericObject> {
        return new QixObjectApi(this.dApp.createSessionObject(qProp))
    }

    async getBookmark(qId): EngineAPI.IGenericBookmark {
        return new QixBookmarkApi(await this.dApp.getBookmark(qId))
    }

    async applyBookmark(qId): Promise<boolean> {
        return await this.dApp.applyBookmark(qId)
    }

    async $removeBookmark(bookmarkId: string) {
        return new Promise((resolve, reject) => {
            this.dApp.getBookmark(bookmarkId).then(bookmarkToBeDeleted => {
                bookmarkToBeDeleted.unPublish().then(res => {
                    this.dApp
                        .destroyBookmark(bookmarkId)
                        .then(r => {
                            resolve(r)
                        })
                        .catch(err => reject(err))
                })
            })
        })
    }

    async $createBookmark(bookmark: any) {
        const bookmarkDefinition = {
            qMetaDef: {
                title: bookmark.name,
                creationDate: new Date().toISOString(),
                class: bookmark.class
            },
            qInfo: {
                qType: bookmark.type
            }
        }

        try {
            const createdBookmark = await this.dApp.createBookmark(bookmarkDefinition)

            return createdBookmark.id
        } catch (error) {
            console.error(error)
        }
    }

    async createBookmark(qProp: any): Promise<any> {
        return new QixBookmarkApi(await this.dApp.createBookmark(qProp))
    }

    async cloneBookmark(qId: string): Promise<string> {
        return await this.dApp.cloneBookmark(qId)
    }

    async destroyBookmark(qId: string): Promise<boolean> {
        return await this.dApp.destroyBookmark(qId)
    }

    async getBookmarks(
        qOptions: EngineAPI.INxGetBookmarkOptions
    ): Promise<EngineAPI.INxContainerEntry<any>> {
        let bookmarks = null
        try {
            bookmarks = await this.dApp.getBookmarks(qOptions)
            return bookmarks
        } catch (error) {
            console.error(error)
        }
    }

    async createDimension(
        qProp: EngineAPI.IGenericDimensionProperties
    ): EngineAPI.IGenericDimension {
        return new QixDimensionApi(await this.dApp.createDimension(qProp))
    }

    async createMeasure(qProp: EngineAPI.IGenericMeasureProperties): EngineAPI.IGenericMeasure {
        return await new QixMeasureApi(this.dApp.createMeasure(qProp))
    }

    async createObject(qProp: EngineAPI.IGenericObjectProperties): EngineAPI.IGenericObject {
        return await new QixObjectApi(this.dApp.createObject(qProp))
    }

    async getVariableById(qId: string): EngineAPI.IVariable {
        return new QixVariableApi(await this.dApp.getVariableById(qId))
    }

    async getVariableByName(qName: string): EngineAPI.IVariable {
        return new QixVariableApi(await this.dApp.getVariableByName(qName))
    }

    async getVariables(qListDef: EngineAPI.IVariableListDef): EngineAPI.INxVariableListItem {
        return await this.dApp.getVariables(qListDef)
    }

    async removeVariable(qName: string): Promise<boolean> {
        return await this.dApp.removeVariable(qName)
    }

    async createSessionVariable(
        qProp: EngineAPI.IGenericVariableProperties
    ): EngineAPI.IGenericVariable {
        return new QixVariableApi(await this.dApp.createSessionVariable(qProp))
    }

    async createVariableEx(qProp: EngineAPI.IGenericVariableProperties): EngineAPI.INxInfo {
        return await this.dApp.createVariableEx(qProp)
    }

    async cloneDimension(qId: string): Promise<string> {
        return await this.dApp.cloneDimension(qId)
    }

    async cloneMeasure(qId: string): Promise<string> {
        return await this.dApp.cloneMeasure(qId)
    }

    async cloneObject(qId: string): Promise<string> {
        return await this.dApp.cloneObject(qId)
    }

    async commitDraft(qId: string): Promise<void> {
        return await this.dApp.commitDraft(qId)
    }

    async destroyDimension(qId: string): Promise<boolean> {
        return await this.dApp.destroyDimension(qId)
    }

    async destroyDraft(qId: string, qSourceId: string): Promise<boolean> {
        return await this.dApp.destroyDraft(qId, qSourceId)
    }

    async destroyMeasure(qId: string): Promise<boolean> {
        return await this.dApp.destroyMeasure(qId)
    }

    async destroyObject(qId: string): Promise<boolean> {
        return await this.dApp.destroyObject(qId)
    }

    async destroySessionObject(qId: string): Promise<boolean> {
        return await this.dApp.destroySessionObject(qId)
    }

    async destroySessionVariable(qId: string): Promise<boolean> {
        return await this.dApp.destroySessionVariable(qId)
    }

    async destroySessionVariableById(qId: string): Promise<boolean> {
        return await this.dApp.destroySessionVariableById(qId)
    }

    async destroySessionVariableByName(qName: string): Promise<boolean> {
        return await this.dApp.destroySessionVariableByName(qName)
    }

    async destroyVariableById(qId: string): Promise<boolean> {
        return await this.dApp.destroyVariableById(qId)
    }

    async destroyVariableByName(qName: string): Promise<boolean> {
        return await this.dApp.destroyVariableByName(qName)
    }

    async doReload(qMode?: number, qPartial?: boolean, qDebug?: boolean): Promise<boolean> {
        return await this.dApp.doReload(qMode, qPartial, qDebug)
    }

    async doReloadEx(
        qMode?: number,
        qPartial?: boolean,
        qDebug?: boolean
    ): Promise<EngineAPI.IDoReloadExResult> {
        return await this.dApp.doReloadEx(qMode, qPartial, qDebug)
    }

    async doSave(qFileName?: string): Promise<void> {
        return await this.dApp.doSave(qFileName)
    }

    async evaluate(qExpression: string): Promise<string> {
        return await this.dApp.evaluate(qExpression)
    }

    async evaluateEx(qExpression: string): Promise<EngineAPI.IFieldValue> {
        return await this.dApp.evaluateEx(qExpression)
    }

    async expandExpression(qExpression: string): Promise<string> {
        return await this.dApp.expandExpression(qExpression)
    }

    async findMatchingFields(
        qFieldName: string,
        qTags: string[]
    ): Promise<EngineAPI.INxMatchingFieldInfo[]> {
        return await this.dApp.findMatchingFields(qFieldName, qTags)
    }

    async modifyConnection(
        qConnectionId: string,
        qConnection: EngineAPI.IConnection,
        qOverrideCredentials?: boolean
    ): Promise<void> {
        return await this.dApp.modifyConnection(qConnectionId, qConnectionId, qOverrideCredentials)
    }

    async getConnection(qConnectionId: string): Promise<EngineAPI.IConnection> {
        return await this.dApp.getConnection(qConnectionId)
    }

    async getConnections(): Promise<EngineAPI.IConnection[]> {
        return await this.dApp.getConnections(qConnectionId)
    }

    async getContentLibraries(): Promise<EngineAPI.IContentLibraryList[]> {
        return await this.dApp.getContentLibraries()
    }

    async getDatabaseInfo(qConnectionId: string): Promise<EngineAPI.IDatabaseInfo> {
        return await this.dApp.getDatabaseInfo(qConnectionId)
    }

    async getDatabaseOwners(
        qConnectionId: string,
        qDatabase?: string
    ): Promise<EngineAPI.IDatabaseOwner> {
        return await this.dApp.getDatabaseOwners(qConnectionId, qDatabase)
    }

    async getDatabaseTableFields(
        qConnectionId: string,
        qDatabase?: string,
        qOwner?: string,
        qTable: string
    ): Promise<EngineAPI.IDataField[]> {
        return await this.dApp.getDatabaseTableFields(qConnectionId, qDatabase, qOwner, qTable)
    }

    async getDatabaseTablePreview(
        qConnectionId: string,
        qDatabase?: string,
        qOwner?: string,
        qTable: string,
        qConditions: any
    ): Promise<EngineAPI.IDataRecord[]> {
        return await this.dApp.getDatabaseTablePreview(
            qConnectionId,
            qDatabase,
            qOwner,
            qTable,
            qConditions
        )
    }

    async getDatabaseTables(
        qConnectionId: string,
        qDatabase?: string,
        qOwner?: string
    ): Promise<EngineAPI.IDataTable[]> {
        return await this.dApp.getDatabaseTables(qConnectionId, qDatabase, qOwner)
    }

    async getDatabases(qConnectionId: string): Promise<EngineAPI.IDatabase[]> {
        return await this.dApp.getDatabases(qConnectionId)
    }

    async getDimension(qId: string): Promise<EngineAPI.IGenericDimension> {
        return new QixDimensionApi(await this.dApp.getDimension(qId))
    }

    async getMeasure(qId: string): Promise<EngineAPI.IGenericMeasure> {
        return new QixMeasureApi(await this.dApp.getMeasure(qId))
    }

    async getMediaList(): Promise<EngineAPI.IMediaList[]> {
        return await this.dApp.getMediaList()
    }

    async getObject(qId: string): Promise<EngineAPI.IGenericObject> {
        return await this.dApp.getObject(qId)
    }

    async getObjects(
        qOptions: EngineAPI.INxGetObjectOptions
    ): Promise<EngineAPI.INxContainerEntry> {
        return await this.dApp.getObjects(qOptions)
    }

    async setScript(qScript: string): Promise<void> {
        return await this.dApp.setScript(qScript)
    }

    async getScript(): Promise<string> {
        return await this.dApp.getScript()
    }

    async getScriptEx(): Promise<any> {
        return await this.dApp.getScriptEx()
    }

    async getEmptyScript(qLocalizedMainSection?: string): Promise<string> {
        return await this.dApp.getEmptyScript(qLocalizedMainSection)
    }

    async getSetAnalysis(qStateName?: string, qBookmarkId?: string): Promise<string> {
        return await this.dApp.getSetAnalysis(qStateName, qBookmarkId)
    }

    async getTableData(
        qOffset: number,
        qRows: number,
        qSyntheticMode: boolean,
        qTableName: string
    ): Promise<EngineAPI.ITableRow[]> {
        return await this.dApp.getTableData(qOffset, qRows, qSyntheticMode, qTableName)
    }

    async getTablesAndKeys(
        qWindowSize: EngineAPI.ISize,
        qNullSize: EngineAPI.ISize,
        qCellHeight: number,
        qSyntheticMode: boolean,
        qIncludeSysVars: boolean
    ): Promise<{ qtr: EngineAPI.ITableRecord[]; qk: EngineAPI.ISourceKeyRecord[] }> {
        return await this.dApp.getTablesAndKeys(
            qWindowSize,
            qNullSize,
            qCellHeight,
            qSyntheticMode,
            qIncludeSysVars
        )
    }

    async getTextMacros(): Promise<EngineAPI.ITextMacro[]> {
        return await this.dApp.getTextMacros()
    }

    async getFavoriteVariables(): Promise<string[]> {
        return await this.dApp.getFavoriteVariables()
    }

    async getField(qFieldName: string, qStateName?: string): Promise<EngineAPI.IField> {
        return new QixFieldApi(await this.dApp.getField(qFieldName, qStateName))
    }

    async getFieldDescription(qFieldName: string): Promise<EngineAPI.IFieldDescription> {
        return await this.dApp.getFieldDescription(qFieldName)
    }

    async getFieldOnTheFlyByName(qReadableName: string): Promise<{ qName: string }> {
        return await this.dApp.getFieldOnTheFlyByName(qReadableName)
    }

    async getFieldAndColumnSamples(
        qFieldsOrColumnsWithWildcards: any,
        qMaxNumberOfValues: number,
        qRandSeed?: number
    ): Promise<any> {
        return await this.dApp.getFieldAndColumnSamples(
            qFieldsOrColumnsWithWildcards,
            qMaxNumberOfValues,
            qRandSeed,
            qStateName
        )
    }

    async getFileTableFields(
        qConnectionId: string,
        qRelativePath?: string,
        qDataFormat: EngineAPI.IFileDataFormat,
        qTable: string
    ): Promise<{ qFields: EngineAPI.IDataField[]; qFormatSpec: string }> {
        return await this.dApp.getFileTableFields(qConnectionId, qRelativePath, qDataFormat, qTable)
    }

    async getFileTablePreview(
        qConnectionId: string,
        qRelativePath?: string,
        qDataFormat: EngineAPI.IFileDataFormat,
        qTable: string
    ): Promise<{ qPreview: EngineAPI.IDataRecord[]; qFormatSpec: string }> {
        return await this.dApp.getFileTablePreview(
            qConnectionId,
            qRelativePath,
            qDataFormat,
            qTable
        )
    }

    async getFileTables(
        qConnectionId: string,
        qRelativePath?: string,
        qDataFormat: EngineAPI.IFileDataFormat
    ): Promise<EngineAPI.IDataTable[]> {
        return await this.dApp.getFileTables(qConnectionId, qRelativePath, qDataFormat)
    }

    async getFileTablesEx(
        qConnectionId: string,
        qRelativePath?: string,
        qDataFormat: EngineAPI.IFileDataFormat
    ): Promise<EngineAPI.IDataTableEx[]> {
        return await this.dApp.getFileTablesEx(qConnectionId, qRelativePath, qDataFormat)
    }

    async getFolderItemsForConnection(
        qConnectionId: string,
        qRelativePath?: string
    ): Promise<EngineAPI.IFolderItem> {
        return await this.dApp.getFolderItemsForConnection(qConnectionId, qRelativePath)
    }

    async getIncludeFileContent(qPath: string): Promise<string> {
        return await this.dApp.getIncludeFileContent(qPath, qRelativePath)
    }

    async getLibraryContent(qName: string): Promise<EngineAPI.IStaticContentList> {
        return await this.dApp.getLibraryContent(qName)
    }

    async getLineage(): Promise<any[]> {
        return await this.dApp.getLineage()
    }

    async getLocaleInfo(): Promise<EngineAPI.ILocaleInfo> {
        return await this.dApp.getLocaleInfo()
    }

    async getMatchingFields(
        qTags: string[],
        qMatchingFieldMode?: string
    ): Promise<EngineAPI.INxMatchingFieldInfo[]> {
        return await this.dApp.getMatchingFields(qTags, qMatchingFieldMode)
    }

    registerEvent(event: string, callback): void {
        if (this.qApp) this.qApp.on(event, callback)
    }

    unregisterEvent(event: string): void {
        if (this.qApp) this.qApp.off(event)
    }
}
