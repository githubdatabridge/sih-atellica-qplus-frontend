import { useCallback, useRef, useReducer, useEffect } from 'react'

import { useQixContext } from '../contexts/QixContext'
import { deepMerge } from '../utils/object'

const initialState = {
    qDoc: null,
    qObject: null,
    qData: null,
    layout: null,
    listData: null,
    selections: null,
    selectionsId: null
}

function reducer(state, action) {
    const {
        payload: { qData, layout, listData, selections, selectionsId, qDoc },
        type
    } = action
    switch (type) {
        case 'update':
            return {
                ...state,
                qData,
                layout,
                listData,
                selections,
                selectionsId
            }
        case 'init':
            return {
                ...state,
                qDoc
            }
        default:
            throw new Error()
    }
}

const initialProps = {
    autoSortByState: 1,
    qSortByAscii: 1,
    qSortByLoadOrder: 1,
    dimension: null,
    label: null,
    qListObjectDef: null,
    qPage: {
        qTop: 0,
        qLeft: 0,
        qWidth: 1,
        qHeight: 25
    }
}

const useList = (props: any) => {
    const {
        qPage: qPageProp,
        dimension,
        qListObjectDef,
        qSortByAscii,
        qSortByLoadOrder,
        autoSortByState
    } = deepMerge(initialProps, props)

    const { engine } = useQixContext()

    const _isMounted = useRef<boolean>(false)
    const [state, dispatch] = useReducer(reducer, initialState)

    const { layout, listData, selections, selectionsId } = state

    const qObject = useRef(null)
    const qPage = useRef(qPageProp)

    /** Generate the Definition file */
    const generateQProp = useCallback(
        (currentColumn = 0) => {
            const qProp = { qInfo: { qType: 'visualization' } }
            if (qListObjectDef) {
                qProp['qListObjectDef'] = qListObjectDef
            } else {
                const qDimensions = dimension
                    .filter(
                        col =>
                            (typeof col === 'string' && !col.startsWith('=')) ||
                            (typeof col === 'object' && col.qDef && col.qDef.qFieldDefs) ||
                            (typeof col === 'object' &&
                                col.qLibraryId &&
                                col.qType &&
                                col.qType === 'dimension')
                    )
                    .map(col => {
                        if (typeof col === 'string') {
                            return {
                                qDef: {
                                    qFieldDefs: [col],
                                    qSortCriterias: [{ qSortByLoadOrder, qSortByAscii }]
                                }
                            }
                        }

                        return col
                    })
                const qLibraryId = {
                    qLibraryId:
                        typeof dimension[0] === 'object' && dimension[0].qLibraryId
                            ? dimension[0].qLibraryId
                            : ''
                }
                const qDef = qDimensions[currentColumn]
                qProp['qListObjectDef'] = {
                    ...qLibraryId,
                    ...qDef,
                    qShowAlternatives: true,
                    qAutoSortByState: { qDisplayNumberOfRows: autoSortByState }
                }
            }

            return qProp
        },
        [autoSortByState, dimension, qListObjectDef, qSortByAscii, qSortByLoadOrder]
    )

    // TODO: Edit to extract all data
    const getData = useCallback(async () => {
        const qDataPages = await qObject.current.getListObjectData('/qListObjectDef', [
            qPage.current
        ])
        return qDataPages[0]
    }, [])

    const structureData = useCallback(
        async _qData => {
            if (!_qData) return null
            const _listData = []
            await _qData.qMatrix.map((d, i) => {
                _listData.push({
                    key: d[0].qElemNumber,
                    text: typeof d[0].qText !== 'undefined' ? d[0].qText : 'undefined',
                    number: d[0].qNumber,
                    state: d[0].qState,
                    value: typeof d[0].qText !== 'undefined' ? d[0].qText : 'undefined',
                    label: typeof d[0].qText !== 'undefined' ? d[0].qText : 'undefined'
                })
            })

            // Get Selections
            const _selections =
                _listData && (await _listData.filter(row => row.state === 'S' || row.state === 'L'))
            // Get Selection ID
            const _selId = _selections && (await _selections.map(d => d.key))

            return { _selId, _selections, _listData }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [listData]
    )

    const getLayout = useCallback(() => qObject.current.getLayout(), [])

    const changePage = useCallback(newPage => {
        qPage.current = { ...qPage.current, ...newPage }

        update()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const update = useCallback(async () => {
        const _qLayout = await getLayout()
        const _qData = await getData()
        const { _selId, _selections, _listData } = await structureData(_qData)
        console.log('UPDATE LIST')
        if (_qData) {
            dispatch({
                type: 'update',
                payload: {
                    layout: _qLayout,
                    listData: _listData,
                    selections: _selections,
                    selectionsId: _selId
                }
            })
        } else {
            dispatch({
                type: 'update',
                payload: {
                    layout: _qLayout,
                    listData: _listData
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getData, structureData, getLayout, changePage])

    const beginSelections = async () => {
        // Make sure we close all other open selections. We usually get that when we have morethan one dropDown in the same page and while one is open, we click on the second one
        await state.qDoc.abortModal(true)
        await qObject.current.beginSelections(['/qListObjectDef'])
    }

    const endSelections = async qAccept => {
        // await state.qEngine.abortModal(true)
        await qObject.current.endSelections(qAccept)
    }

    const select = useCallback(
        (qElemNumber, toggle = true, ignoreLock = false) =>
            qObject.current &&
            qObject.current.selectListObjectValues(
                '/qListObjectDef',
                qElemNumber,
                toggle,
                ignoreLock
            ),
        []
    )

    const searchList = useCallback(string => {
        qObject.current && qObject.current.searchListObjectFor('/qListObjectDef', string)
    }, [])

    const confirmListSearch = useCallback(
        (ignoreLock = false) =>
            qObject.current &&
            qObject.current.acceptListObjectSearch('/qListObjectDef', true, ignoreLock),
        []
    )

    const cancelListSearch = useCallback(
        () => qObject.current && qObject.current.abortListObjectSearch('/qListObjectDef'),
        []
    )

    const applyPatches = useCallback(patches => qObject.current.applyPatches(patches), [])

    const clearSelections = useCallback(
        () => qObject.current && qObject.current.clearSelections('/qListObjectDef'),
        []
    )

    const initListData = useCallback(async engine => {
        console.log('MOUNT LIST')
        const qProp = generateQProp()
        const qDoc = await engine.doc
        qObject.current = await qDoc.createSessionObject(qProp)
        // TODO: make sure init is not called on every render - convert qDoc to qEngine
        if (!_isMounted.current) dispatch({ type: 'init', payload: { qDoc } })
        qObject.current.on('changed', () => {
            update()
        })
        update()
        _isMounted.current = true
    }, [])

    useEffect(() => {
        if (!engine?.doc || qObject.current) return
        initListData(engine)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [engine])

    return {
        layout,
        listData,
        changePage,
        select,
        beginSelections,
        endSelections,
        searchList,
        cancelListSearch,
        confirmListSearch,
        applyPatches,
        selections,
        selectionsId,
        clearSelections,
        motorListProps: {
            layout,
            clearSelections,
            selections,
            select,
            beginSelections,
            endSelections,
            searchList,
            confirmListSearch,
            cancelListSearch,
            changePage
        }
    }
}

export default useList
