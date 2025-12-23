export const defList = (fieldName: string, stateName = '$', height = 10000) => {
    return {
        qStateName: stateName,
        qDef: {
            qFieldDefs: [fieldName],
            qGrouping: 'N',
            autoSort: false,
            qActiveField: 0,
            qFieldLabels: ['Filter'],
            qNullSuppression: true,
            qSortCriterias: [
                {
                    qSortByState: 1,
                    qSortByAscii: -1,
                    qSortByNumeric: -1
                }
            ]
        },
        qAutoSortByState: {
            qDisplayNumberOfRows: -1
        },
        qFrequencyMode: 'EQ_NX_FREQUENCY_NONE',
        qShowAlternatives: true,
        qInitialDataFetch: [
            {
                qTop: 0,
                qLeft: 0,
                qHeight: height,
                qWidth: 1
            }
        ]
    }
}
