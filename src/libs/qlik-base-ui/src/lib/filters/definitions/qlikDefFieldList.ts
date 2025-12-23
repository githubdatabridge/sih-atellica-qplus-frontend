export const qlikDefFieldList = (
    fieldName: string,
    sortByState = 1,
    sortByAscii = 1,
    sortByNumeric = 0,
    height = 10000
) => {
    return {
        qDef: {
            qFieldDefs: [fieldName],
            qGrouping: 'N',
            autoSort: false,
            qActiveField: 0,
            qFieldLabels: [fieldName],
            qSortCriterias: [
                {
                    qSortByState: sortByState,
                    qSortByAscii: sortByAscii,
                    qSortByNumeric: sortByNumeric
                }
            ]
        },
        qAutoSortByState: {
            qDisplayNumberOfRows: -1
        },
        qFrequencyMode: 'EQ_NX_FREQUENCY_NONE',
        qShowAlternatives: true,
        qSuppressZero: true,
        qSuppressMissing: true,
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
