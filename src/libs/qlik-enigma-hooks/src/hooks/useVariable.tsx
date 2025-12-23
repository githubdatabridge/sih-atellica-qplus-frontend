import { useCallback, useEffect, useRef, useState } from 'react'

import { useQixContext } from '../contexts/QixContext'
import { deepMerge } from '../utils/object'

const initialProps = {
    id: null,
    comment: undefined,
    numberPresentation: undefined,
    includeInBookmark: false,
    definition: null
}

const useVariable = props => {
    const name = typeof props === 'string' ? props : props.name || null

    const { id, comment, numberPresentation, includeInBookmark, definition } = deepMerge(
        initialProps,
        props
    )

    const { engine } = useQixContext()
    const [qLayout, setQLayout] = useState(null)
    const [qProperties, setQProperties] = useState(null)
    const [error, setError] = useState(null)

    const qObject = useRef(null)

    const generateQProp = (
        qId,
        qName,
        qComment,
        qNumberPresentation,
        qIncludeInBookmark,
        qDefinition
    ) => {
        const qProp = {
            qInfo: {
                qId,
                qType: 'Variable'
            },
            qMetaDef: {},
            qName,
            qComment,
            qNumberPresentation,
            qIncludeInBookmark,
            qDefinition: qDefinition.toString()
        }

        return qProp
    }

    const getVariable = async (
        qId,
        qName,
        qComment,
        qNumberPresentation,
        qIncludeInBookmark,
        qDefinition
    ) => {
        const qDoc = await engine.doc

        let qLocalObject

        if (!qId && !qName && !qDefinition) {
            const qSessionObject = await qDoc.createSessionObject({
                qInfo: {
                    qId: 'VL01',
                    qType: 'VariableList'
                },
                qVariableListDef: {
                    qType: 'variable'
                }
            })
            qLocalObject = await qSessionObject.getLayout()
            setQLayout(qLocalObject)
        }
        if (qId && !qDefinition) {
            qLocalObject = await qDoc.getVariableById({
                qId
            })
        }
        if (qName && !qDefinition) {
            qLocalObject = await qDoc.getVariableByName({
                qName
            })
        }
        if (qName && qDefinition) {
            try {
                qLocalObject = await qDoc.getVariableByName({
                    qName
                })
            } catch (err) {
                if (!qLocalObject) {
                    qLocalObject = await qDoc.createSessionVariable(
                        generateQProp(
                            qId,
                            qName,
                            qComment,
                            qNumberPresentation,
                            qIncludeInBookmark,
                            qDefinition
                        )
                    )

                    qObject.current = await qLocalObject
                    update(qObject.current)
                }
                if (error.code === 18001) {
                    setError('Variable already exists')
                } else {
                    setError(err)
                }
            }
        }

        return qLocalObject
    }

    const getLayout = useCallback(() => qObject.current.getLayout(), [])
    const getProperties = useCallback(() => qObject.current.getProperties(), [])

    const setProperties = useCallback(async props => {
        const { qId, qName, qComment, qNumberPresentation, qIncludeInBookmark, qDefinition } = props
        if (qObject.current) {
            const qProperties = await getProperties()
            const qNewObject = await qObject.current.setProperties(
                generateQProp(
                    qId || qProperties.qInfo.qId,
                    qName || qProperties.qName,
                    qComment || qProperties.qComment,
                    qNumberPresentation || qProperties.qNumberPresentation,
                    qIncludeInBookmark || qProperties.qIncludeInBookmark,
                    qDefinition.toString() || qProperties.qDefinition.toString()
                )
            )
            qObject.current = qNewObject
            update(qObject.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const setValue = useCallback(async value => {
        if (qObject.current) {
            const qProperties = await getProperties()

            const qNewObject = await qObject.current.setProperties(
                generateQProp(
                    qProperties.qInfo.qId,
                    qProperties.qName,
                    qProperties.qComment,
                    qProperties.qNumberPresentation,
                    qProperties.qIncludeInBookmark,
                    value.toString()
                )
            )
            qObject.current = qNewObject
            update(qObject.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const update = useCallback(async qObj => {
        const _qLayout = await getLayout()
        _qLayout.value = _qLayout.qNum === 'number' ? _qLayout.qNum : _qLayout.qText
        setQLayout(_qLayout)
        setQProperties(await getProperties())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const invalidateVariable = useCallback(async (engine, id, name) => {
        try {
            qObject.current = await getVariable(
                id,
                name,
                comment,
                numberPresentation,
                includeInBookmark,
                definition
            )

            qObject.current.on('changed', () => {
                update(qObject.current)
            })

            update(qObject.current)
        } catch (err) {
            if (err.code === -2) {
                setError('Variable Not Found')
            } else {
                setError(err)
            }
        }
    }, [])

    useEffect(() => {
        if (!engine?.doc) return
        invalidateVariable(engine, id, name)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, name, engine])

    if (qLayout && qLayout.qVariableList) {
        qLayout.variableList = qLayout.qVariableList.qItems
    }

    return {
        qLayout,
        ...qLayout,
        qProperties,
        setProperties,
        setValue,
        error
    }
}

export default useVariable
