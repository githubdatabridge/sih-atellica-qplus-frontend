import { QMasterVisualization, QSheet } from '@libs/qlik-models'

import * as objectDefinitions from './qix.definitions'

async function _qPlusGetSheetList(): Promise<any> {
    const sheets: QSheet[] = []
    try {
        const model = await this.createSessionObject(objectDefinitions.sheetList)
        const layout = await model.getLayout()
        const allQItems = layout.qAppObjectList.qItems
        for (let i = 0; i <= allQItems.length - 1; i++) {
            const sheet = allQItems[i]
            sheets.push({
                id: sheet.qInfo.qId,
                title: sheet.qMeta.title,
                description: sheet.qMeta.description,
                labelExpression: sheet.qData.labelExpression,
                showCondition: sheet.qData.showCondition,
                approved: sheet.qMeta.approved,
                published: sheet.qMeta.published,
                type: sheet.qInfo.qType,
                cells: sheet?.qData?.cells?.map(c => ({
                    id: c.name,
                    type: c.type
                }))
            })
        }

        return sheets
    } catch (e) {
        throw new Error(e.message)
    }
}

async function _qPlusGetFieldList(fieldName: string): Promise<any> {
    try {
        const list = await this.createSessionObject(objectDefinitions.listObjectDef(fieldName))
        const layout = await list.getLayout()

        return (
            layout &&
            layout.qListObject &&
            layout.qListObject.qDataPages &&
            layout.qListObject.qDataPages[0] &&
            layout.qListObject.qDataPages[0].qMatrix &&
            layout.qListObject.qDataPages[0].qMatrix.map(opt => opt[0])
        )
    } catch (e) {
        throw new Error(e.message)
    }
}

async function _qPlusGetList(list: string, type?: string, tags?: string[]) {
    let object = null
    let layout = null
    let items = []
    const qItems = []
    try {
        switch (list) {
            case 'MasterDimensionList':
                object = await this.createSessionObject(objectDefinitions.dimensionList)
                layout = await object.getLayout()
                items = layout.qDimensionList.qItems
                for (let i = 0; i <= items.length - 1; i++) {
                    if (items[i].qData.grouping === 'N') {
                        const item = items[i]
                        qItems.push({
                            qLibraryId: item.qInfo.qId,
                            type: item.qInfo.qType,
                            title: item.qData.title,
                            tags: item.qData.tags,
                            grouping: item.qData.grouping,
                            fieldDef: item.qData.info[0].qName,
                            label: item.qData.labelExpression,
                            showTotal: true
                        })
                    }
                }
                break
            case 'MasterMeasureList':
                object = await this.createSessionObject(objectDefinitions.measureList)
                layout = await object.getLayout()
                items = layout.qMeasureList.qItems
                for (let i = 0; i <= items.length - 1; i++) {
                    const item = items[i]

                    const mMeasure = await this.getMeasure(item.qInfo.qId)
                    const mProp = await mMeasure.getProperties()

                    qItems.push({
                        qLibraryId: mProp.qInfo.qId,
                        type: mProp.qInfo.qType,
                        label: mProp.qMeasure.qLabel,
                        title: mProp.qMetaDef.title,
                        expression: mProp.qMeasure.qDef,
                        tags: mProp.qMetaDef.tags,
                        numFormat: mProp.qMeasure.qNumFormat,
                        total: true
                    })
                }
                break
            case 'MasterVisualizationList':
                object = await this.createSessionObject(objectDefinitions.visualizationList)
                layout = await object.getLayout()
                items = layout.qAppObjectList.qItems
                for (let i = 0; i <= items.length - 1; i++) {
                    const item = items[i]
                    if (tags && tags.length > 0) {
                        for (const tag of tags) {
                            if (item.qMeta.tags.includes(tag)) {
                                const mItem = checkMasterVisualizationType(item, type)
                                if (mItem) {
                                    qItems.push(mItem)
                                }
                            }
                        }
                    } else {
                        const mItem = checkMasterVisualizationType(item, type)
                        if (mItem) {
                            qItems.push(mItem)
                        }
                    }
                }

                break
            case 'VariableList':
                object = await this.createSessionObject(objectDefinitions.variableList)
                layout = await object.getLayout()
                return layout.qVariableList.qItems
                break
            default:
                break
        }

        return qItems
    } catch (e) {
        throw new Error(e.message)
    }
}

function getMasterVisualization(item: any): QMasterVisualization {
    return {
        qLibraryId: item.qInfo.qId,
        title: item.qMeta.title,
        description: item.qMeta.description,
        label: item.qMeta.title,
        type: item.qData.visualization,
        tags: item.qMeta.tags
    }
}

function checkMasterVisualizationType(item: any, type): QMasterVisualization {
    let mItem = null
    if (type) {
        if (item.qData.visualization === type) {
            mItem = getMasterVisualization(item)
        }
    } else {
        mItem = getMasterVisualization(item)
    }
    return mItem
}
export default {
    _qPlusGetSheetList,
    _qPlusGetFieldList,
    _qPlusGetList
}
