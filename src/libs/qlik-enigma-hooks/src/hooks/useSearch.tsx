import { useState, useEffect, useCallback, useRef } from 'react'

import { useQixContext } from '../contexts/QixContext'
import { getFieldsFromDimensions } from '../utils/hyperCubeUtilities'

const useSearch = ({ searchValue, dimensions, qCount, qGroupItemCount }) => {
    const [groupResults, setGroupResults] = useState([])
    const [flatResults, setFlatResults] = useState([])

    const { engine } = useQixContext()

    const searchValuesHelper = useCallback(
        async (engine, searchValue, qCount, qGroupItemCount, dimensions) => {
            try {
                const qDoc = await engine.doc
                const search = await qDoc.searchResults(
                    {
                        qSearchFields: dimensions
                    },
                    [searchValue],
                    {
                        qOffset: 0,
                        qCount,
                        qGroupItemOptions: [
                            {
                                qGroupItemType: 'FIELD',
                                qOffset: 0,
                                qCount: qGroupItemCount
                            }
                        ]
                    }
                )
                const res = await search
                const _groupRes = await groupRes(res)
                const _flattenRes = await flattenRes(_groupRes)
                setGroupResults(_groupRes)
                setFlatResults(_flattenRes)
            } catch (e) {
                console.warn(e)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        []
    )

    useEffect(() => {
        if (engine === undefined) {
            searchValuesHelper(engine, searchValue, qCount, qGroupItemCount, dimensions)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [engine, searchValue, qCount, qGroupItemCount, dimensions])

    const groupRes = v => {
        const arr = []
        let series = {}
        v.qSearchGroupArray.map(d => {
            series['id'] = d.qId
            series['dimension'] = d.qItems[0].qIdentifier
            series['value'] = d.qItems[0].qItemMatches
            arr.push(series)
            series = {}
        })
        return arr
    }

    const flattenRes = v => {
        const arr = []
        let series = {}
        v.map(d => {
            d.value.map(item => {
                series['dimension'] = d.dimension
                series['value'] = item.qText
                arr.push(series)
                series = {}
            })
        })
        return arr
    }

    const groupSelect = useCallback(
        async id => {
            if (engine) {
                const qDoc = await engine.doc
                // eslint-disable-next-line no-unused-expressions
                qDoc.selectAssociations(
                    {
                        qSearchFields: dimensions,
                        qContext: 'CurrentSelections'
                    },
                    [searchValue],
                    id
                )
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [engine]
    )

    const flatSelect = useCallback(
        async (dim, value) => {
            if (engine) {
                const qDoc = await engine.doc
                // If the dimension is a master item, we are using this helper function
                // to identify the field in the data model
                const masterItem = await getFieldsFromDimensions(qDoc, dim)
                let field
                if (masterItem.length > 0) {
                    field = masterItem[0].qData.info[0].qName
                } else {
                    field = dim
                }
                // eslint-disable-next-line no-unused-expressions
                const qField = await qDoc.getField(field)
                qField.select(value)
            }
        },
        [engine]
    )

    return {
        groupResults,
        flatResults,
        flatSelect,
        groupSelect
    }
}

export default useSearch
