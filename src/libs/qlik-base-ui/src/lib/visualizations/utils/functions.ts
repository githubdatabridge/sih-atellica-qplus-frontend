export const strToObject = (str: string, delimiter: string) => {
    let last
    return str.split(delimiter).reduce((o, val) => {
        if (typeof last == 'object') last = last[val] = {}
        else last = o[val] = {}

        return o
    }, {})
}

export const setObjectValue = (path: string, value: any, delimiter: string) => {
    let schema = {} // a moving reference to internal objects within obj
    const pList = path.split(delimiter)
    const len = pList.length
    for (let i = 0; i < len - 1; i++) {
        const elem = pList[i]
        if (!schema[elem]) schema[elem] = {}
        schema = schema[elem]
    }

    return (schema[pList[len - 1]] = value)
}

export const setObjectProperty = (prop: string, value: any, obj: any) =>
    obj.constructor === Object &&
    Object.keys(obj).forEach(key => {
        if (key === prop) obj[key] = value
        setObjectProperty(prop, value, obj[key])
    })

export const findByKey = (obj: any, key: string) => {
    return key.split('.').reduce(function (result, key) {
        return result ? result[key] : null
    }, obj)
}

export const mergeDeep = (...objects) => {
    const isObject = obj => obj && typeof obj === 'object'

    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach(key => {
            const pVal = prev[key]
            const oVal = obj[key]

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(...oVal)
            } else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = mergeDeep(pVal, oVal)
            } else {
                prev[key] = oVal
            }
        })

        return prev
    }, {})
}
