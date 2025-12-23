import { QMasterDimension, QMasterMeasure } from '@libs/qlik-models'

import { dimension, measure } from '../../utils'

export default class QlikMixinAppVisualizationApi {
    _qPlusGetVizDimensions(
        reportDimensions: string[],
        dimensions: QMasterDimension[]
    ): QMasterDimension[] {
        const dArray = []
        for (const dim of reportDimensions) {
            for (const masterDim of dimensions) {
                if (dim === masterDim.qLibraryId) {
                    dArray.push(masterDim)
                    break
                }
            }
        }
        dArray.sort((a, b) => {
            if (a.label < b.label) {
                return -1
            }
            if (a.label > b.label) {
                return 1
            }
            return 0
        })

        return dArray
    }

    _qPlusGetVizMeasures(reportMeasures: string[], measures: QMasterMeasure[]): QMasterMeasure[] {
        const mArray = []

        for (const m of reportMeasures) {
            for (const masterMeasure of measures) {
                if (m === masterMeasure.qLibraryId) {
                    mArray.push(masterMeasure)
                    break
                }
            }
        }
        mArray.sort((a, b) => {
            if (a.label < b.label) {
                return -1
            }
            if (a.label > b.label) {
                return 1
            }
            return 0
        })

        return mArray
    }

    _qPlusGetVizColumns(
        vizDimensions: QMasterDimension[],
        vizMeasures: QMasterMeasure[]
    ): QMasterDimension[] {
        const columns = []
        for (const qDim of vizDimensions) {
            columns.push(dimension(qDim.fieldDef, qDim.label, qDim.grouping, qDim.showTotal))
        }

        for (const qMeas of vizMeasures) {
            columns.push(measure(qMeas.expression, qMeas.label, qMeas.numFormat, qMeas.total))
        }

        return columns
    }

    _qPlusGetVizColumnsByVisualization(properties: any): QMasterDimension[] {
        const columns = []

        if (properties?.qHyperCubeDef?.qDimensions) {
            for (const dim of properties.qHyperCubeDef.qDimensions) {
                columns.push(dim)
            }
        }
        if (properties?.qHyperCubeDef?.qMeasures) {
            for (const measure of properties.qHyperCubeDef.qMeasures) {
                columns.push(measure)
            }
        }
        return columns
    }
}
