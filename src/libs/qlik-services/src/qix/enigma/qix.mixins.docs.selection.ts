import * as objectDefinitions from './qix.definitions'

async function _qPlusGetSelections(callback?: any): Promise<any> {
    try {
        const model = await this.createSessionObject(objectDefinitions.sessionList)
        if (callback) model?.on('changed', callback)
        const layout = (await model.getLayout()) as EngineAPI.IGenericSelectionListLayout
        return layout
    } catch (e) {
        throw new Error(e.message)
    }
}

/**
 * Get current selections
 */
async function _qPlusGetSelectionInfo(): Promise<any> {
    try {
        const layout = await _qPlusGetSelections()

        const fieldsSelected = layout.qSelectionObject.qSelections.map(function (s) {
            return s.qField
        })

        return { selections: layout.qSelectionObject.qSelections, fields: fieldsSelected }
    } catch (e) {
        throw new Error(e.message)
        return null
    }
}

/**
 * Select value(s) in a field
 * @param {string} fieldName - Name of the field
 * @param {array} values - String array with the values to be selected
 * @param {boolean} [toggle=false] toggle - How to apply the selection
 */
async function _qPlusSelectInField(
    fieldName: string,
    values: string[],
    toggleMode = true,
    softLock = false
): Promise<any> {
    try {
        const field = (await this.getField(fieldName)) as EngineAPI.IField

        const valuesToSelect = values.map(function (v) {
            return { qText: v } as EngineAPI.IFieldValue
        })

        try {
            const selection = await field.selectValues(valuesToSelect, toggleMode, softLock)
            return selection
        } catch (e) {
            new Error(e.message)
            return null
        }
    } catch (e) {
        new Error(e.message)
        return null
    }
}

export default {
    _qPlusGetSelectionInfo,
    _qPlusSelectInField,
    _qPlusGetSelections
}
