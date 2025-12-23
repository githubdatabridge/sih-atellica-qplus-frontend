import {
    QMetaInfo,
    QListDataInfo,
    QHeaderInfo,
    QHypercubeSize,
    Q_FIELD_TYPES,
    Q_FIELD_TAGS,
    Q_MEASURE_TYPES
} from '@libs/qlik-models'

import { utilService } from '../../services/utilService'

const QLIK_FETCH_LIMIT = 8

export default class QlikMixinAppObjectApi {
    async _qPlusApplyPatch(
        qModel: any,
        op: string,
        path: string,
        value: any,
        soft = true
    ): Promise<void> {
        return new Promise(resolve => {
            qModel
                .applyPatches(
                    [
                        {
                            qOp: op,
                            qPath: path,
                            qValue: JSON.stringify(value)
                        }
                    ],
                    soft
                )
                .then((result: any) => {
                    resolve(result)
                })
        })
    }

    async _qPlusGetHyperCubeData(qPath: string, qModel: any, qSize: QHypercubeSize): Promise<any> {
        const qData = []
        try {
            if (qModel && qSize) {
                const totalWidth: number = qSize.qcx
                const totalHeight: number = qSize.qcy
                const pageHeight: number = Math.floor(10000 / totalWidth)
                const numberOfPages: number = Math.ceil(totalHeight / pageHeight)
                const promises = []

                for (let i = 0; i < numberOfPages; i++) {
                    promises.push(
                        await qModel.getHyperCubeData(qPath, [
                            {
                                qTop: pageHeight * i,
                                qLeft: 0,
                                qWidth: totalWidth,
                                qHeight: pageHeight,
                                index: i
                            }
                        ])
                    )
                }

                const data = await Promise.all(promises)
                for (const currentData of data) {
                    for (const qMatrix of currentData[0].qMatrix) {
                        qData.push(qMatrix)
                    }
                }
            }
            return qData
        } catch (error) {
            return []
            //throw new Error(error)
        }
    }

    _qPlusGetFlattenListData(qData: any): QListDataInfo[] {
        return utilService.flatten(qData)
    }

    async _qPlusGetListObjectData(qPath: string, qModel: any, qSize: QHypercubeSize): Promise<any> {
        const qData = []
        try {
            const totalWidth: number = qSize.qcx
            const totalHeight: number = qSize.qcy
            const pageHeight: number = Math.floor(QLIK_FETCH_LIMIT / totalWidth)
            const numberOfPages: number = Math.ceil(totalHeight / pageHeight)
            const promises = []

            for (let i = 0; i < numberOfPages; i++) {
                promises.push(
                    qModel.getListObjectData(qPath, [
                        {
                            qTop: pageHeight * i,
                            qLeft: 0,
                            qWidth: totalWidth,
                            qHeight: pageHeight,
                            index: i
                        }
                    ])
                )
            }
            const data = await Promise.all(promises)
            for (const currentData of data) {
                for (const qMatrix of currentData[0].qMatrix) {
                    qData.push(qMatrix)
                }
            }
            return qData
        } catch (error) {
            return []
        }
    }

    _qPlusGetGrandTotalArray(qMeasureInfo: any, qGrandTotalRow: any): any {
        const names: string[] = [],
            types: string[] = [],
            res: string[] = []
        try {
            qMeasureInfo.forEach(
                (measure: {
                    qFallbackTitle: string
                    qNumFormat: {
                        qType: string
                    }
                }) => {
                    names.push(measure.qFallbackTitle)
                    types.push(Q_MEASURE_TYPES[measure.qNumFormat.qType])
                }
            )
            qGrandTotalRow.forEach((value: any, i: number) => {
                const resVal: any = {}
                if (value.hasOwnProperty('qIsNull') && value.qIsNull) {
                    resVal[names[i]] = null
                } else {
                    resVal[names[i]] = value.qNum
                }
                res.push(resVal)
            })
            return res
        } catch (error) {
            return new Error(error)
        }
    }
    _qPlusGetHypercubeDataToArray(qLayout: any, qData: any, isDimText = false): any[] | null {
        const names: any = [],
            dims: any = [],
            types: any = [],
            res: any = []
        try {
            qLayout.qHyperCube.qDimensionInfo.forEach((dim: any) => {
                names.push(dim.qFallbackTitle)
                dims.push(dim.qFallbackTitle)
                if (
                    dim.qTags.indexOf(Q_FIELD_TAGS.date) > -1 ||
                    dim.qTags.indexOf(Q_FIELD_TAGS.timestamp) > -1
                ) {
                    types.push(Q_FIELD_TYPES.timestamp)
                } else {
                    types.push(dim.qDimensionType)
                }
            })

            qLayout.qHyperCube.qMeasureInfo.forEach((measure: any) => {
                names.push(measure.qFallbackTitle)
                types.push(Q_MEASURE_TYPES[measure.qNumFormat.qType])
            })

            qData.forEach((row: any[]) => {
                const resVal = {}
                row.forEach((value, i) => {
                    if (isDimText && dims.indexOf(names[i]) > -1) {
                        resVal[names[i]] = value.qText
                    } else if (value.hasOwnProperty('qIsNull') && value.qIsNull) {
                        resVal[names[i]] = null
                    } else {
                        if (types[i] == Q_FIELD_TYPES.discrete) {
                            if (value.hasOwnProperty('qNum') && !isNaN(value.qNum)) {
                                resVal[names[i]] = value.qNum
                            } else if (value.hasOwnProperty('qText')) {
                                resVal[names[i]] = value.qText
                            } else {
                                resVal[names[i]] = 'null'
                            }
                        } else if (types[i] == Q_FIELD_TYPES.numeric) {
                            resVal[names[i]] = value.qNum
                        } else if (types[i] == Q_FIELD_TYPES.timestamp) {
                            resVal[names[i]] = utilService.dateFromQlikNumber(value.qNum).toJSON()
                        }
                    }
                })
                res.push(resVal)
            })
            return res
        } catch (error) {
            new Error(error)
            return null
        }
    }
    _qPlusGetHypercubeDimensions(qLayout: any): string[] {
        const dimensions: string[] = []
        try {
            qLayout.qHyperCube.qDimensionInfo.forEach((dim: { qGroupFieldDefs: string[] }) => {
                dimensions.push(dim.qGroupFieldDefs[0])
            })
            return dimensions
        } catch (error) {
            new Error(error)
            return []
        }
    }
    _qPlusGetHypercubeHeader(qLayout: any, skipUndefined = false): QHeaderInfo | undefined {
        const dimensions: string[] = []
        const measures: string[] = []
        try {
            qLayout.qHyperCube.qDimensionInfo.forEach((dim: { qFallbackTitle: string }) => {
                if (skipUndefined) {
                    if (dim?.qFallbackTitle) dimensions.push(dim.qFallbackTitle)
                } else {
                    dimensions.push(dim.qFallbackTitle)
                }
            })
            qLayout.qHyperCube.qMeasureInfo.forEach((measure: { qFallbackTitle: string }) => {
                measures.push(measure.qFallbackTitle)
            })
            return { dimensions, measures }
        } catch (error) {
            new Error(error)
            return
        }
    }
    _qPlusGetHypercubeMetaData(qLayout: any, fetchLimit: number): QMetaInfo | null {
        try {
            const totalWidth: number = qLayout.qHyperCube.qSize.qcx
            const totalHeight: number = qLayout.qHyperCube.qSize.qcy
            const pageHeight: number = Math.floor(fetchLimit / totalWidth)
            const numberOfPages: number = Math.ceil(totalHeight / pageHeight)
            const title: string = qLayout.title
            const subtitle: string = qLayout.subtitle
            const footnote: string = qLayout.footnote
            const visualization: string = qLayout.visualization
            const qObjectMetaInfo: QMetaInfo = {
                width: totalWidth,
                height: totalHeight,
                pageHeight: pageHeight,
                pages: numberOfPages,
                title,
                subtitle,
                visualization,
                footnote,
                fetchLimit
            }
            return qObjectMetaInfo
        } catch (error) {
            new Error(error)
            return null
        }
    }
}
