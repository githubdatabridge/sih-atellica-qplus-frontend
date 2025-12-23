import {
    QMasterDimension,
    QMasterMeasure,
    QMasterVisualization,
    QSheet
} from '@libs/qlik-models'

import { QlikAppApi } from '../qixCapabilityApi'
import { QixDocApi } from '../qixEnigmaApi'

export default class QlikMixinAppApi {
    async _qPlusGetMasterVisualizations(
        app: any,
        tags?: string[],
        type?: string
    ): Promise<QMasterVisualization[]> {
        const qItems: QMasterVisualization[] = []
        await app.getList('MasterObject', (list: any) => {
            const allQItems = list.qAppObjectList.qItems
            for (let i = 0; i <= allQItems.length - 1; i++) {
                const item = allQItems[i]
                if (tags && tags.length > 0) {
                    for (const tag of tags) {
                        if (item.qMeta.tags.includes(tag)) {
                            const mItem = this.checkMasterVisualizationType(item, type)
                            if (mItem) {
                                qItems.push(mItem)
                            }
                        }
                    }
                } else {
                    const mItem = this.checkMasterVisualizationType(item, type)
                    if (mItem) {
                        qItems.push(mItem)
                    }
                }
            }
        })
        return qItems
    }

    async _qPlusGetMasterDimensions(app: QlikAppApi): Promise<QMasterDimension[]> {
        const qItems: QMasterDimension[] = []
        return new Promise((resolve, reject) => {
            app.getList('DimensionList', (list: any) => {
                const allQItems = list.qDimensionList.qItems
                for (let i = 0; i <= allQItems.length - 1; i++) {
                    if (allQItems[i].qData.grouping === 'N') {
                        const item = allQItems[i]
                        qItems.push({
                            qAppId: app.qApp.id,
                            qLibraryId: item.qInfo.qId,
                            type: item.qInfo.qType,
                            title: item.qData.title,
                            tags: item.qData.tags,
                            grouping: item.qData.grouping,
                            qFieldName: item.qData.info[0].qName,
                            fieldDef: item.qData.info[0].qName,
                            label: item.qData.labelExpression ?? item.qData.title,
                            showTotal: true
                        })
                    }
                }
                resolve(qItems)
            })
        })
    }

    async _qPlusGetAppSheets(app: QlikAppApi): Promise<QSheet[]> {
        const qItems: QSheet[] = []
        return new Promise((resolve, reject) => {
            app.getList('sheet', (reply: any) => {
                const allQItems = reply.qAppObjectList.qItems
                for (let i = 0; i <= allQItems.length - 1; i++) {
                    const sheet = allQItems[i]
                    qItems.push({
                        qlikAppId: app.qApp.id,
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
                resolve(qItems)
            })
        })
    }

    async _qPlusGetMasterMeasures(app, enigma) {
        const qItems = []
        return new Promise((resolve, reject) => {
            try {
                app.createGenericObject(
                    {
                        qInfo: {
                            qId: 'MeasureList',
                            qType: 'MeasureList'
                        },
                        qMeasureListDef: {
                            qType: 'measure',
                            qData: {
                                qNumFormat: '/qMeasure/qNumFormat',
                                labelExpression: '/qMeasure/qLabelExpression',
                                title: '/qMetaDef/title',
                                tags: '/qMetaDef/tags',
                                expression: '/qMeasure/qDef'
                            }
                        }
                    },
                    async function (reply) {
                        try {
                            const allQItems = reply.qMeasureList.qItems
                            for (let i = 0; i <= allQItems.length - 1; i++) {
                                const item = allQItems[i]

                                const mProp = (await (
                                    await enigma.getMeasure(item.qInfo.qId)
                                ).getProperties()) as any

                                qItems.push({
                                    qAppId: app.qApp.id,
                                    qLibraryId: item.qInfo.qId,
                                    type: item.qInfo.qType,
                                    label: item.qData.labelExpression ?? item.qMeta.title,
                                    title: item.qMeta.title,
                                    expression:
                                        item.qData?.expression || mProp?.qMeasure?.qDef || '',
                                    tags: item.qMeta.tags,
                                    numFormat: mProp?.qMeasure?.qNumFormat || '',
                                    total: true
                                })
                            }
                            resolve(qItems)
                        } catch (error) {
                            console.log('Qplus Error', error)
                            reject(error)
                        }
                    }
                )
            } catch (error) {
                console.log('Qplus Error', error)
                reject(error)
            }
        })
    }

    async _qPlusGetMasterMeasure(
        qId: string,
        app: QlikAppApi,
        enigma: QixDocApi
    ): Promise<QMasterMeasure> {
        let label = ''
        const mProp = (await (await enigma.getMeasure(qId)).getProperties()) as any
        if (mProp?.qMesasure) label = await enigma.evaluate(mProp.qMeasure.qLabelExpression)

        return {
            qAppId: app.qApp.id,
            qLibraryId: mProp.qInfo.qId,
            type: mProp.qInfo.qType,
            label: label,
            title: mProp.qMetaDef.title,
            expression: mProp?.qMeasure?.qDef || '',
            tags: mProp.qMetaDef.tags,
            numFormat: mProp?.qMeasure.qNumFormat || ''
        }
    }

    async _qPlusGetAppLayout(app: any, tags: string[]): Promise<any> {
        const response = await Promise.all([
            app.getAppLayout(),
            this._qPlusGetMasterVisualizations(app, tags)
        ])
        const layout = response[0].layout
        const qItems = response[1]
        const result: any = {}
        const pref = this.appThumbnailPrefix(app)
        result.app = {
            thumb: pref + layout.qThumbnail.qUrl,
            appTitle: layout.qTitle,
            appDesc: layout.description,
            appURL: pref + '/sense/app/' + encodeURIComponent(app.id.replace('.qvf', '')),
            id: app.id
        }
        const objects: {
            id: any
            footnote: any
            thumb: string
            appTitle: any
            appDesc: any
            appURL: string
        }[] = []
        qItems.forEach((qItem: any) => {
            objects.push({
                id: qItem.qInfo.qId,
                footnote: qItem.qMeta.description,
                thumb: pref + layout.qThumbnail.qUrl,
                appTitle: layout.qTitle,
                appDesc: layout.description,
                appURL: pref + '/sense/app/' + app.id
            })
        })
        result.currentApp = app
        result.objects = objects
        return result
    }

    private getMasterVisualization(item: any): QMasterVisualization {
        return {
            qLibraryId: item.qInfo.qId,
            title: item.qMeta.title,
            description: item.qMeta.description,
            label: item.qData.labelExpression,
            type: item.qData.visualization,
            tags: item.qMeta.tags
        }
    }

    private checkMasterVisualizationType(item: any, type): QMasterVisualization {
        let mItem = null
        if (type) {
            if (item.qData.visualization === type) {
                mItem = this.getMasterVisualization(item)
            }
        } else {
            mItem = this.getMasterVisualization(item)
        }
        return mItem
    }

    private appThumbnailPrefix(app: any): string {
        const prefix = app.global.session.options.prefix
        return prefix.replace(/\/+$/, '')
    }
}
