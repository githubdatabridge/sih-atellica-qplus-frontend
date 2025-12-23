export const sessionList = {
    qInfo: {
        qId: '',
        qType: 'SessionLists'
    },
    qSelectionObjectDef: {}
}

export const variableList = {
    qInfo: {
        qType: 'VariableList'
    },
    qVariableListDef: {
        qType: 'variable'
    }
}

export const listObjectDef = (fieldName: string) => {
    return {
        qInfo: {
            qType: 'filter'
        },
        qListObjectDef: {
            qDef: {
                qFieldDefs: [fieldName]
            },
            qInitialDataFetch: [
                {
                    qLeft: 0,
                    qWidth: 1,
                    qTop: 0,
                    qHeight: 10000
                }
            ]
        }
    }
}

export const sheetList = {
    qInfo: {
        qType: 'SheetList',
        qId: ''
    },
    qAppObjectListDef: {
        qData: {
            title: '/qMetaDef/title',
            labelExpression: '/labelExpression',
            showCondition: '/showCondition',
            description: '/qMetaDef/description',
            descriptionExpression: '/qMetaDef/descriptionExpression',
            thumbnail: '/qMetaDef/thumbnail',
            cells: '/cells',
            rank: '/rank',
            columns: '/columns',
            rows: '/rows'
        },
        qType: 'sheet'
    }
}

export const dimensionList = {
    qInfo: {
        qType: 'DimensionList',
        qId: ''
    },
    qDimensionListDef: {
        qType: 'dimension',
        qData: {
            title: '/qMetaDef/title',
            tags: '/qMetaDef/tags',
            grouping: '/qDim/qGrouping',
            info: '/qDimInfos'
        }
    }
}

export const measureList = {
    qInfo: {
        qType: 'MeasureList',
        qId: ''
    },
    qMeasureListDef: {
        qType: 'measure',
        qData: {
            title: '/qMetaDef/title',
            tags: '/qMetaDef/tags'
        }
    }
}

export const visualizationList = {
    qInfo: {
        qType: 'masterobject',
        qId: ''
    },
    qAppObjectListDef: {
        qType: 'masterobject',
        qData: {
            name: '/metadata/name',
            visualization: '/visualization',
            tags: '/metadata/tags'
        }
    }
}

export const createMeasure = (
    id: string,
    label: string,
    def: string,
    title: string,
    desc: string,
    grouping = 'N',
    expressions: string,
    labelExpression,
    tags
) => {
    return {
        qInfo: {
            qId: id,
            qType: 'measure'
        },
        qMeasure: {
            qLabel: label,
            qDef: def,
            qGrouping: grouping,
            qExpressions: qBuildArray(expressions),
            qActiveExpression: 0,
            qLabelExpression: labelExpression
        },
        qMetaDef: {
            title: title,
            description: desc == '' ? label : desc,
            qSize: -1,
            tags: qBuildArray(tags)
        }
    }
}

const qBuildArray = strArray => {
    const splitString = strArray?.split(',') || []
    return splitString
}
