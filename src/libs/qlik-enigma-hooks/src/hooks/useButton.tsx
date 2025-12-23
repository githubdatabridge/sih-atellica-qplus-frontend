import { useCallback, useEffect, useRef, useState } from 'react'

import { useQixContext } from '../contexts/QixContext'
import createDef from '../utils/createHCDef'
import { deepMerge } from '../utils/object'

const initialProps = {
    qPage: {
        qTop: 0,
        qLeft: 0,
        qWidth: 1,
        qHeight: 1000
    },
    cols: null,
    qHyperCubeDef: null,
    config: null
}

const useButton = (props?: any) => {
    const { cols, qHyperCubeDef } = deepMerge(initialProps, props)

    const { engine } = useQixContext()

    const [qLayout, setQLayout] = useState(null)

    const qObject = useRef(null)

    const generateQProp = useCallback(() => {
        const qProp = createDef(cols, qHyperCubeDef)

        return qProp
    }, [cols, qHyperCubeDef])

    const initLayout = useCallback(async engine => {
        const qProp = generateQProp()
        const qDoc = await engine.doc.doc
        qObject.current = await qDoc.createSessionObject(qProp)
        setQLayout(await qObject.current.getLayout())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!engine?.doc || !cols) return
        if (qObject.current) return
        initLayout(engine)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [engine, cols])

    const clearSelections = () => {
        engine?.doc && engine.doc.doc.clearAll()
    }

    const previousSelection = () => {
        engine?.doc && engine.doc.back()
    }

    const nextSelection = () => {
        engine?.doc && engine.doc.forward()
    }

    const select = async (value, field) => {
        const qDoc = await engine.doc
        const qField = await qDoc.getField(field)
        qField.select(value)
    }

    const clearField = async field => {
        const qDoc = await engine.doc
        const qField = await qDoc.getField(field)
        qField.clear()
    }

    const selectLowLevelValues = async (values, field, toggle = false) => {
        const qDoc = await engine.doc
        const qField = await qDoc.getField(field)
        qField.lowLevelSelect(values, toggle)
    }

    const selectValues = async (values, field, toggle = false, numeric = false) => {
        const key = numeric ? 'qNumber' : 'qText'
        const sel = await values.map(d => ({ [key]: d, qIsNumeric: numeric }))
        const qDoc = await engine.doc
        const qField = await qDoc.getField(field)
        qField.selectValues(sel, toggle)
    }

    const doReload = async (qMode, qPartial) => {
        const qDoc = await engine.doc
        qDoc.doReload(qMode, qPartial, false)
    }

    const lockField = async field => {
        const qDoc = await engine.doc
        const qField = await qDoc.getField(field)
        qField.lock()
    }

    const unlockField = async field => {
        const qDoc = await engine.doc
        const qField = await qDoc.getField(field)
        qField.unlock()
    }

    const exportData = () => {
        const id = qLayout.qInfo.qId
        engine.doc.getObject(id).then(model => {
            model.exportData('CSV_C', '/qHyperCubeDef', id, 'P').then(url => {
                console.log(url.qUrl, url.qWarnings)
                window.open(url.qUrl)
            })
        })
    }

    return {
        clearSelections,
        previousSelection,
        nextSelection,
        qLayout,
        exportData,
        select,
        selectValues,
        doReload,
        lockField,
        unlockField,
        selectLowLevelValues,
        clearField
    }
}

export default useButton
