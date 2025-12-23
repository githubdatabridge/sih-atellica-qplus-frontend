export const measure = (expression, label, qNumFormat, total = true) => {
    return {
        qDef: {
            qLabel: label,
            qDef: expression,
            qNumFormat,
            autoSort: true,
            qAggrFunc: total ? 'auto' : 'None'
        }
    }
}
