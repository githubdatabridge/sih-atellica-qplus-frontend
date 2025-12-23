import { useState, useEffect, useRef, useCallback } from 'react'

import { useQixContext } from '../contexts/QixContext'
import { getFieldsFromDimensions } from '../utils/hyperCubeUtilities'

const useSelectionObject = () => {
    const { engine } = useQixContext()

    const qObject = useRef(null)
    const [qLayout, setQLayout] = useState(null)
    const [selections, setSelections] = useState(null)
    const [selectionItems, setSelectionItems] = useState(null)

    const update = useCallback(async () => {
        const _qLayout = await qObject.current.getLayout()
        const sel = await getSelections(_qLayout)
        if (qObject.current) {
            setQLayout(_qLayout)
            setSelections(sel)

            setSelectionItems(
                sel.map((element, index) => {
                    const items = []
                    element.qSelectedFieldSelectionInfo.map(e => items.push(e.qName))
                    return {
                        qField: element.qField,
                        qItems: items
                    }
                })
            )
        }
    }, [])

    const getSelections = v => {
        const selections = v.qSelectionObject.qSelections
        return selections
    }

    const lockAll = async () => {
        const qDoc = await engine.doc
        qDoc.lockAll()
    }

    const unlockAll = async () => {
        const qDoc = await engine.doc
        qDoc.unlockAll()
    }

    const clearSelections = async (dim, value) => {
        ;(async () => {
            const qDoc = await engine.doc
            if (dim) {
                const masterItem = await getFieldsFromDimensions(qDoc, dim)
                let field
                if (masterItem.length > 0) {
                    field = masterItem[0].qData.info[0].qName
                } else {
                    field = dim
                }
                const qField = await qDoc.getField(field)
                if (value) {
                    await qField.toggleSelect(value)
                } else {
                    await qField.clear()
                }
            } else {
                qDoc.clearAll()
            }
        })()
    }

    const initSelectionObject = useCallback(async engine => {
        const qProp = {
            qInfo: { qType: 'SelectionObject' },
            qSelectionObjectDef: {}
        }
        const qDoc = await engine.doc

        try {
            qObject.current = await qDoc.createSessionObject(qProp)

            qObject.current.on('changed', () => {
                update()
            })
            update()
        } catch (err) {
            console.log('Qplus', err)
        }
    }, [])

    useEffect(() => {
        if (!engine?.doc) return
        if (qObject.current) return
        initSelectionObject(engine)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [engine])

    return { qLayout, selections, selectionItems, clearSelections, lockAll, unlockAll }
}

export default useSelectionObject
