import { useQlikAppContext } from '@libs/qlik-providers'

import { defList } from '../definitions/defList'

const useQlikSelectionField = () => {
    const { qAppMap } = useQlikAppContext()

    const createSelectionField = async (qlikAppId: string, fieldName: string, callback: any) => {
        const app = qAppMap.get(qlikAppId)
        const qDefList = defList(fieldName)
        const model = await app.qApi.createList(qDefList, callback)
        return model
    }

    const getListData = async (qlikAppId, qPath, qModel, qSize) => {
        const app = qAppMap.get(qlikAppId)
        return await app?.qMixinsApi?._qPlusGetListObjectData(qPath, qModel, qSize)
    }

    const flattenListObjectData = (qlikAppId: string, data: any) => {
        const app = qAppMap.get(qlikAppId)

        return app.qMixinsApi?._qPlusGetFlattenListData(data)
    }

    const beginSelection = async (model: any) => {
        await model.beginSelections(['/qListObjectDef'])
    }

    const searchValue = async (model: any, value: string) => {
        await model.searchListObjectFor('/qListObjectDef', value)
    }

    const clearSearch = async (model: any) => {
        await model.searchListObjectFor('/qListObjectDef', '')
    }

    const selectValues = async (model: any, values: any[], toggle = false, softLock = false) => {
        try {
            const r = await model.selectListObjectValues(
                '/qListObjectDef',
                values,
                toggle,
                softLock
            )
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }

    const acceptSearch = async (model: any) => {
        return await model.acceptListObjectSearch('/qListObjectDef', true)
    }

    const selectPossible = async (model: any) => {
        model.selectListObjectPossible('/qListObjectDef')
    }

    const selectAll = async (model: any) => {
        await model.selectListObjectAll('/qListObjectDef')
    }

    const clearSelections = async (model: any) => {
        await model.clearSelections('/qListObjectDef')
    }

    const cancelSelection = async (model: any) => {
        await model.endSelections(false)
    }

    const confirmSelection = async (model: any) => {
        await model.endSelections(true)
    }

    return {
        getListData,
        beginSelection,
        cancelSelection,
        confirmSelection,
        clearSelections,
        selectAll,
        selectPossible,
        selectValues,
        createSelectionField,
        flattenListObjectData,
        searchValue,
        clearSearch,
        acceptSearch
    }
}

export default useQlikSelectionField
