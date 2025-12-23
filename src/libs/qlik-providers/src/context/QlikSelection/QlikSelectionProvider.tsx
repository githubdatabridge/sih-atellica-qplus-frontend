/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState, useRef, useCallback, useEffect } from 'react'

import { isNumber } from 'lodash-es'

import { QFieldFilter, QMultiAppFields, QSelection } from '@libs/qlik-models'

import { useQlikContext } from '../Qlik/QlikContext'
import { QAppResult, useQlikAppContext } from '../QlikApp/QlikAppContext'
import { useQlikLoaderContext } from '../QlikLoader/QlikLoaderContext'
import { defList } from './defList'
import { QlikSelectionContextType, QlikSelectionContext } from './QlikSelectionContext'

interface Props {
    value?: QlikSelectionContextType
    children: ReactNode
}

const QlikSelectionProvider = ({ value, children }: Props) => {
    const [qIsSelectionMapLoading, setIsSelectionMapLoading] = useState<boolean>(false)
    const [qGlobalClearIsLoading, setQlikClearIsLoading] = useState<boolean>(false)
    const [qGlobalBackwardIsLoading, setQlikBackwardIsLoading] = useState<boolean>(false)
    const [qGlobalForwardIsLoading, setQlikForwardIsLoading] = useState<boolean>(false)
    const [qlikSelectionMap, setQlikSelectionMap] = useState<Map<string, QSelection>>(new Map())
    const [qGlobalDockedFields, setGlobalDockedFields] = useState<QFieldFilter[]>([])
    const [qGlobalMultiAppFields, setGlobalMultiAppFields] = useState<QMultiAppFields[]>([])
    const [qGlobalSelectionCount, setGlobalSelectionCount] = useState<number>(0)
    const [qGlobalBackwardCount, setGlobalBackwardCount] = useState<number>(0)
    const [qGlobalForwardCount, setGlobalForwardCount] = useState<number>(0)
    const { settings } = useQlikContext()
    const { qAppMap } = useQlikAppContext()
    const { setIsQlikSelectionLoading } = useQlikLoaderContext()

    const qAppMapRef = useRef<Map<string, QAppResult>>(new Map())
    const qGlobalMultiAppFieldsRef = useRef<QMultiAppFields[]>([])
    const qSelectionMapRef = useRef<Map<string, QSelection>>(new Map())
    const qGlobalSelectionHistoryRef = useRef<string[]>([])
    const qGlobalSelectionIteratorRef = useRef<number>(0)
    const qGlobalSelectionResetIteratorRef = useRef<boolean>(true)
    const qTimeoutRef = useRef<any>({})

    const generateHashHelper = (string: string) => {
        let hash = 0
        if (string.length === 0) return hash
        for (let i = 0; i < string.length; i++) {
            const charCode = string.charCodeAt(i)
            hash = (hash << 7) - hash + charCode
            hash = hash & hash
        }
        return hash
    }

    const groupByHelper = (arr: any[], property: string) => {
        return arr.reduce((memo, x) => {
            if (!memo[x[property]]) {
                memo[x[property]] = []
            }
            memo[x[property]].push(x)
            return memo
        }, {})
    }

    const cleanFieldNameHelper = (fieldName: string) => {
        return fieldName?.length && fieldName[0] === '=' ? fieldName.slice(1) : fieldName
    }

    const isInMultiAppFieldHelper = (fieldName: string, appId: string) => {
        let isInMultiApp = false
        for (const mField of qGlobalMultiAppFieldsRef.current) {
            if (mField?.qFields) {
                for (const field of mField.qFields) {
                    if (field.qAppId === appId && field.qFieldName === fieldName) {
                        isInMultiApp = true
                        break
                    }
                }
            }
        }
        return isInMultiApp
    }

    const getDataHelper = async (qModel: any, mixinApi: any) => {
        let qData = []
        try {
            const qLayout = await qModel.getLayout()
            if (!qLayout) return
            qData = await mixinApi._qPlusGetListObjectData(
                '/qListObjectDef',
                qModel,
                qLayout.qListObject.qSize
            )

            return qData && qData?.length > 0 ? await mixinApi?._qPlusGetFlattenListData(qData) : []
        } catch (err) {
            console.log('Qplus Error', err)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getFieldSelectionsHelper = async (fieldName: string, appId: string, selections = []) => {
        for (const mField of qGlobalMultiAppFieldsRef.current) {
            if (mField?.qFields) {
                for (const field of mField.qFields) {
                    if (field.qAppId === appId && field.qFieldName === fieldName) {
                        for (const fieldOther of mField.qFields) {
                            if (fieldOther.qAppId !== appId) {
                                const app = qAppMapRef.current.get(fieldOther.qAppId)
                                const qModel = await app.qApi.createList(
                                    defList(fieldOther.qFieldName),
                                    null
                                )
                                const qFlattenData = await getDataHelper(qModel, app.qMixinsApi)
                                const qFilteredData = filterByStateHelper(qFlattenData, ['S', 'XS'])
                                let triggerSelection = false

                                for (const selection of selections) {
                                    const d = qFlattenData?.map((f: any) =>
                                        f?.qNum !== 'NaN' ? f?.qNum : f?.qText
                                    )
                                    if (
                                        d?.includes(selection) &&
                                        !qFilteredData.includes(selection)
                                    ) {
                                        triggerSelection = true
                                        break
                                    }
                                }
                                if (triggerSelection) {
                                    await app.qApi.selectFieldValues(
                                        fieldOther.qFieldName,
                                        selections.map((s: any) =>
                                            isNumber(s) ? { qNum: s } : { qText: s }
                                        )
                                    )
                                }
                            }
                        }
                        break
                    }
                }
            }
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getFieldValuesHelper = async (fieldName: string, appId: string): Promise<any[]> => {
        const qAppMapValue = qAppMapRef.current.get(appId)
        const def = defList(fieldName)
        const fieldValues = await qAppMapValue?.qMixinsApi?._qPlusGetFieldValues(
            qAppMapValue.qApi,
            def
        )
        return fieldValues
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const filterByStateHelper = (values: any[], states = ['S']) => {
        return (
            values
                ?.filter((f: any) => states.includes(f.qState))
                ?.map((d: any) => (d?.qNum !== 'NaN' ? d?.qNum : d?.qText)) || []
        )
    }

    const getSelectionCounterHelper = () => {
        let sBackCounter = 0
        let sForwardCounter = 0
        for (const [key] of qAppMap) {
            const s = qSelectionMapRef.current.get(key)
            sBackCounter = sBackCounter + s.qBackwardCount
            sForwardCounter = sForwardCounter + s.qForwardCount
        }
        return { sBackCounter, sForwardCounter }
    }

    const setSelectionCounterStateHelper = () => {
        const { sBackCounter, sForwardCounter } = getSelectionCounterHelper()

        if (sBackCounter === 0) {
            qGlobalSelectionIteratorRef.current = 0
            setGlobalBackwardCount(0)
        } else {
            setGlobalBackwardCount(qGlobalSelectionIteratorRef.current)
        }
        if (sForwardCounter > 0) {
            setGlobalForwardCount(qGlobalSelectionHistoryRef.current.length - sForwardCounter)
        } else {
            qGlobalSelectionIteratorRef.current = qGlobalSelectionHistoryRef.current.length
            setGlobalForwardCount(0)
        }
        if (sBackCounter === 0 && sForwardCounter === 0) qGlobalSelectionHistoryRef.current = []
    }

    const updateAppSelection = useCallback(
        async (appId: string) => {
            const qSelectionMapValue = qSelectionMapRef.current.get(appId)
            if (qGlobalSelectionResetIteratorRef.current) {
                qGlobalSelectionHistoryRef.current.push(appId)
                qGlobalSelectionIteratorRef.current = qGlobalSelectionHistoryRef.current.length
                setGlobalForwardCount(0)
                setGlobalBackwardCount(qGlobalSelectionHistoryRef.current.length)
            }

            const qAppMapValue = qAppMapRef.current.get(appId)
            const qSelections = []
            let selectionCount = 0
            let backwardCount = 0
            let forwardCount = 0

            const qSelectionState = await qAppMapValue?.qApi?.selectionState()
            const { selections } = qSelectionState

            for (let i = 0; i <= selections.length - 1; i++) {
                const fieldName = selections[i].fieldName

                const fieldValues = await getFieldValuesHelper(fieldName, appId)
                if (fieldValues && fieldValues.length > 0) {
                    const filteredValues = filterByStateHelper(fieldValues)
                    qSelections.push({ fieldName, values: filteredValues })
                    if (isInMultiAppFieldHelper(fieldName, appId)) {
                        // TODO => TRIGGER SELECTION TO OTHER FIELDS IN MULTI APP FIELD
                        await getFieldSelectionsHelper(fieldName, appId, filteredValues)
                    }
                }
                selectionCount = selectionCount + (selections[i]?.selectedCount || 0)
            }
            const hash = generateHashHelper(qSelections.join('|'))
            backwardCount = qSelectionState?.backCount || 0
            forwardCount = qSelectionState?.forwardCount || 0

            const newSelections = selections?.filter((s: any) => {
                const inMultiAppContext = isInMultiAppFieldHelper(s.fieldName, appId)

                return (
                    qAppMapValue?.qHidePrefix !== s.fieldName.substring(0, 1) &&
                    !qAppMapValue?.qHiddenFields?.includes(s.fieldName) &&
                    !inMultiAppContext
                )
            })

            qSelectionMapRef.current.set(appId, {
                qBackwardCount: backwardCount,
                qForwardCount: forwardCount,
                qSelectionCount: selectionCount,
                qSelections: newSelections,
                qHiddenFields: qAppMapValue?.qHiddenFields || [],
                qHidePrefix: qAppMapValue?.qHidePrefix || '',
                qDockedFields: qSelectionMapValue?.qDockedFields || [],
                qSelectedFields: qSelections || [],
                qSelectionHash: hash,
                qAppId: appId
            })

            const newSelectionMap = new Map(qSelectionMapRef.current)
            qGlobalSelectionResetIteratorRef.current = true

            setQlikSelectionMap(newSelectionMap)
        },
        [getFieldSelectionsHelper]
    )

    const setDockedFields = useCallback(
        (dockedFields: QFieldFilter[]) => {
            const newSelectionMap = new Map(qSelectionMapRef.current)
            const dockedFieldsGroupedBy = groupByHelper(dockedFields, 'qAppId')
            for (const [key, value] of qAppMap) {
                let sortDockedFields: QFieldFilter[] = []
                const appDockedFields = dockedFieldsGroupedBy[key]
                if (appDockedFields) {
                    const filterDockedFields = appDockedFields?.filter((d: any) => {
                        const cleanFieldName = cleanFieldNameHelper(d?.qFieldName)
                        if (cleanFieldName) {
                            return (
                                value?.qHidePrefix !== cleanFieldName.substring(0, 1) &&
                                !value?.qHiddenFields?.includes(cleanFieldName)
                            )
                        }
                    })

                    const sortDockedFieldsByFixed = filterDockedFields?.sort((a: any, b: any) => {
                        return Number(a.isFixed) - Number(b.isFixed)
                    })

                    sortDockedFields =
                        sortDockedFieldsByFixed?.sort((a: any, b: any) => {
                            return Number(a?.rank || 0) - Number(b?.rank || 0)
                        }) || []
                }
                const oldSelectionMap = newSelectionMap.get(key) || {}
                newSelectionMap.set(key, {
                    ...oldSelectionMap,
                    qDockedFields: sortDockedFields
                })
                qSelectionMapRef.current = newSelectionMap
                setQlikSelectionMap(newSelectionMap)
            }
        },
        [qAppMap]
    )

    const setMultiAppFields = useCallback((multiAppFields: QMultiAppFields[]) => {
        qGlobalMultiAppFieldsRef.current = multiAppFields
        setGlobalMultiAppFields(multiAppFields)
    }, [])

    const detachFieldsFromContext = useCallback(() => {
        setDockedFields([])
        setMultiAppFields([])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const clearSelectionsFromContext = useCallback(async () => {
        try {
            setQlikClearIsLoading(true)
            for (const [key, value] of qAppMapRef.current) {
                if (value?.qApi) {
                    await value.qApi.clearAll()
                }
            }
        } finally {
            setQlikClearIsLoading(false)
        }
    }, [])

    const previousSelectionsFromContext = useCallback(async () => {
        try {
            setQlikBackwardIsLoading(true)
            if (qGlobalSelectionHistoryRef.current.length > 0) {
                if (qGlobalSelectionIteratorRef.current > 0) {
                    const qCurrentAppId =
                        qGlobalSelectionHistoryRef.current[qGlobalSelectionIteratorRef.current - 1]
                    const selection = qSelectionMapRef.current.get(qCurrentAppId)
                    if (selection?.qBackwardCount > 0) {
                        qGlobalSelectionIteratorRef.current--
                        const qCurrentApp = qAppMapRef.current.get(qCurrentAppId)
                        qGlobalSelectionResetIteratorRef.current = false
                        await qCurrentApp?.qApi?.qApp?.back()
                        setGlobalBackwardCount(qGlobalSelectionIteratorRef.current)
                        setGlobalForwardCount(
                            qGlobalSelectionHistoryRef.current.length -
                                qGlobalSelectionIteratorRef.current
                        )
                    } else {
                        setSelectionCounterStateHelper()
                        qGlobalSelectionResetIteratorRef.current = true
                    }
                } else {
                    setGlobalBackwardCount(0)
                    setGlobalForwardCount(0)
                    qGlobalSelectionResetIteratorRef.current = true
                }
            }
        } finally {
            setQlikBackwardIsLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const nextSelectionsFromContext = useCallback(async () => {
        try {
            setQlikForwardIsLoading(true)
            if (qGlobalSelectionHistoryRef.current.length > 0) {
                if (
                    qGlobalSelectionIteratorRef.current < qGlobalSelectionHistoryRef.current.length
                ) {
                    const qCurrentAppId =
                        qGlobalSelectionHistoryRef.current[qGlobalSelectionIteratorRef.current]
                    const selection = qSelectionMapRef.current.get(qCurrentAppId)
                    if (selection?.qForwardCount > 0) {
                        qGlobalSelectionIteratorRef.current++
                        const qCurrentApp = qAppMapRef.current.get(qCurrentAppId)
                        qGlobalSelectionResetIteratorRef.current = false
                        await qCurrentApp?.qApi?.qApp?.forward()
                        setGlobalForwardCount(
                            qGlobalSelectionHistoryRef.current.length -
                                qGlobalSelectionIteratorRef.current
                        )
                        setGlobalBackwardCount(qGlobalSelectionIteratorRef.current)
                    } else {
                        setSelectionCounterStateHelper()
                        qGlobalSelectionResetIteratorRef.current = true
                    }
                } else {
                    setGlobalForwardCount(0)
                    qGlobalSelectionResetIteratorRef.current = true
                }
            }
        } finally {
            setQlikForwardIsLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const resetSelectionsFromContext = useCallback(async () => {
        qGlobalSelectionHistoryRef.current = []
        qGlobalSelectionIteratorRef.current = 0
        setGlobalForwardCount(0)
        setGlobalBackwardCount(0)
    }, [])

    const debounceCallbackQlikData = (key: string, timeout: number) => {
        // Create a unique identifier based on key and timeout
        const uniqueId = `${key}-${timeout}`
        // Check if a timeout with the same uniqueId already exists and clear it if so
        if (qTimeoutRef.current[uniqueId]) {
            clearTimeout(qTimeoutRef.current[uniqueId])
        }
        // Set a new timeout
        qTimeoutRef.current[uniqueId] = setTimeout(() => {
            updateAppSelection(key)
            // Optionally, delete the timeout from the ref after execution
            delete qTimeoutRef.current[uniqueId]
        }, timeout)
    }

    useEffect(() => {
        try {
            setIsSelectionMapLoading(true)
            if (qAppMap?.size > 0) {
                for (const [key, value] of qAppMap) {
                    qAppMapRef.current.set(key, value)
                    qSelectionMapRef.current.set(key, {
                        qBackwardCount: 0,
                        qForwardCount: 0,
                        qSelectionCount: 0,
                        qSelections: [],
                        qHiddenFields: value?.qHiddenFields,
                        qHidePrefix: value?.qHidePrefix,
                        qDockedFields: qSelectionMapRef.current?.get(key)?.qDockedFields || [], //Set previously set reference via setDockedFields
                        qSelectedFields: [],
                        qSelectionHash: 0,
                        qAppId: key
                    })

                    value?.qSelectionApi?.$apiSelectionState.registerSelectionListener(() =>
                        debounceCallbackQlikData(key, 1000)
                    )
                }
            }
            return () => {
                for (const [, value] of qAppMap) {
                    if (value) {
                        value?.qSelectionApi?.$apiSelectionState.unregisterSelectionListener(() =>
                            console.log('Qplus unregisterSelectionListener done!')
                        )
                    }
                }
                setQlikSelectionMap(new Map<string, QSelection>())
            }
        } catch (error) {
            console.log('Qplus Error')
        } finally {
            setIsQlikSelectionLoading(false)
            setIsSelectionMapLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qAppMap])

    useEffect(() => {
        let count = 0
        const dockedFields = []

        if (qSelectionMapRef.current.size > 0) {
            for (const [, value] of qSelectionMapRef.current) {
                count = count + (value?.qSelectionCount || 0)
                if (value?.qDockedFields) {
                    dockedFields.push(...value.qDockedFields)
                }
            }
            setGlobalDockedFields(dockedFields || [])
            setGlobalSelectionCount(count)
        }
    }, [qlikSelectionMap])

    useEffect(() => {
        if (settings?.qMultiAppFields && settings?.qMultiAppFields.length > 0) {
            setMultiAppFields(settings.qMultiAppFields)
        }
    }, [setMultiAppFields, settings.qMultiAppFields])

    const providerValues: QlikSelectionContextType = {
        qIsSelectionMapLoading,
        qSelectionMap: qlikSelectionMap,
        qGlobalDockedFields,
        qGlobalMultiAppFields,
        qGlobalSelectionCount,
        qGlobalBackwardCount,
        qGlobalForwardCount,
        qGlobalForwardIsLoading,
        qGlobalBackwardIsLoading,
        qGlobalClearIsLoading,
        setQlikSelectionMap,
        setDockedFields,
        setMultiAppFields,
        detachFieldsFromContext,
        clearSelectionsFromContext,
        resetSelectionsFromContext,
        previousSelectionsFromContext,
        nextSelectionsFromContext
    }

    return (
        <QlikSelectionContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikSelectionContext.Provider>
    )
}

export default QlikSelectionProvider
