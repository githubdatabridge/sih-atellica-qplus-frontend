export const dimension = (field, label, grouping = 'N', showTotal = true) => {
    return {
        qDef: {
            qGrouping: grouping,
            qFieldDefs: [field],
            qFieldLabels: [label]
        },
        qShowAll: false,
        qShowTotal: showTotal
    }
}
