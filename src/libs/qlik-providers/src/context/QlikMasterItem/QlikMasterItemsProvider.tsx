import React, { ReactNode, useState, useEffect, useCallback } from 'react'

import { QMasterDimension, QMasterMeasure, QMasterVisualization } from '@libs/qlik-models'

import { QlikAppMap, useQlikAppContext } from '../QlikApp/QlikAppContext'
import { QlikDocMap, useQlikDocContext } from '../QlikDoc/QlikDocContext'
import { useQlikLoaderContext } from '../QlikLoader/QlikLoaderContext'
import { QlikMasterItemContext, QlikMasterItemContextType } from './QlikMasterItemsContext'

export interface IQlikMasterItemProviderProps {
    children: ReactNode
    value?: QlikMasterItemContextType
}

const QlikMasterItemProvider = ({ value, children }: IQlikMasterItemProviderProps) => {
    const [qMasterDimensions, setQlikMasterDimensions] = useState<QMasterDimension[]>([])
    const [qMasterMeasures, setQlikMasterMeasures] = useState<QMasterMeasure[]>([])
    const [qMasterVisualizations, setQlikMasterVisualizations] = useState<QMasterVisualization[]>(
        []
    )
    const [qMasterDimensionsMap, setQlikMasterDimensionsMap] = useState<
        Map<string, QMasterDimension[]>
    >(new Map())
    const [qMasterMeasuresMap, setQlikMasterMeasuresMap] = useState<Map<string, QMasterMeasure[]>>(
        new Map()
    )
    const [qMasterVisualizationsMap, setQlikMasterVisualizationsMap] = useState<
        Map<string, QMasterVisualization[]>
    >(new Map())
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { isQlikAppLoading, setIsQlikMasterItemLoading } = useQlikLoaderContext()
    const { qDocMap } = useQlikDocContext()
    const { qAppMap } = useQlikAppContext()

    const uniqueItemsHelper = items => {
        const mUniqueItems = [
            //TODO: This is questionable --downlevelIteration enabled in tsconfig for this to work
            ...new Map(items?.map(item => [item['qLibraryId'], item])).values()
        ]

        return mUniqueItems
    }

    const loadDimensions = useCallback(async (appMap: QlikAppMap, docMap: QlikDocMap) => {
        try {
            const masterDimensionMap = new Map<string, QMasterDimension[]>()

            for (const [key, value] of appMap) {
                const appDimensions = (await value?.qMixinsApi?._qPlusGetMasterDimensions(
                    value?.qApi
                )) as QMasterDimension[]

                const uniqueDimensions = uniqueItemsHelper(appDimensions) as QMasterDimension[]
                masterDimensionMap.set(key, uniqueDimensions)
            }

            for (const [key, value] of docMap) {
                const docDimensions = (await value?.qDoc?.dApp._qPlusGetList(
                    'MasterDimensionList'
                )) as QMasterDimension[]

                const uniqueDimensions = uniqueItemsHelper(docDimensions) as QMasterDimension[]
                masterDimensionMap.set(key, uniqueDimensions)
            }

            setQlikMasterDimensionsMap(masterDimensionMap)
            return masterDimensionMap
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }, [])

    const loadMeasures = useCallback(async (appMap: QlikAppMap, docMap: QlikDocMap) => {
        try {
            const masterMeasureMap = new Map<string, QMasterMeasure[]>()

            for (const [key, value] of appMap) {
                const appMeasures = (await value?.qMixinsApi?._qPlusGetMasterMeasures(
                    value?.qApi,
                    value?.qEnigmaApi
                )) as QMasterMeasure[]

                const uniqueMeasures = uniqueItemsHelper(appMeasures) as QMasterMeasure[]
                masterMeasureMap.set(key, uniqueMeasures)
            }

            for (const [key, value] of docMap) {
                const docMeasures = (await value?.qDoc?.dApp._qPlusGetList(
                    'MasterMeasureList'
                )) as QMasterMeasure[]

                const uniqueMeasures = uniqueItemsHelper(docMeasures) as QMasterMeasure[]
                masterMeasureMap.set(key, uniqueMeasures)
            }

            setQlikMasterMeasuresMap(masterMeasureMap)
            return masterMeasureMap
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }, [])

    const loadVisualizations = useCallback(async (appMap: QlikAppMap, docMap: QlikDocMap) => {
        try {
            const masterVisualizationsMap = new Map<string, QMasterVisualization[]>()

            for (const [key, value] of appMap) {
                const appVisualizations = (await value?.qMixinsApi?._qPlusGetMasterVisualizations(
                    value?.qApi,
                    '',
                    ''
                )) as QMasterVisualization[]

                const uniqueVisualizations = uniqueItemsHelper(
                    appVisualizations
                ) as QMasterVisualization[]
                masterVisualizationsMap.set(key, uniqueVisualizations)
            }

            for (const [key, value] of docMap) {
                const docVisualizations = (await value?.qDoc?.dApp._qPlusGetList(
                    'MasterVisualizationList'
                )) as QMasterVisualization[]

                const uniqueVisualizations = uniqueItemsHelper(
                    docVisualizations
                ) as QMasterVisualization[]
                masterVisualizationsMap.set(key, uniqueVisualizations)
            }

            setQlikMasterVisualizationsMap(masterVisualizationsMap)
            return masterVisualizationsMap
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }, [])

    const loadMasterItems = useCallback(
        async (appMap: QlikAppMap, docMap: QlikDocMap) => {
            try {
                await Promise.all([
                    loadDimensions(appMap, docMap),
                    loadMeasures(appMap, docMap),
                    loadVisualizations(appMap, docMap)
                ])
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsQlikMasterItemLoading(false)
                setIsLoading(false)
            }
        },
        [loadDimensions, loadMeasures, loadVisualizations, setIsQlikMasterItemLoading]
    )

    const setQlikMasterItemsByAppId = useCallback(
        async (qAppId: string) => {
            try {
                if (qAppId) {
                    setIsQlikMasterItemLoading(true)
                    const dims = qMasterDimensionsMap?.get(qAppId)
                    const ms = qMasterMeasuresMap?.get(qAppId)
                    const vs = qMasterVisualizationsMap?.get(qAppId)

                    setQlikMasterDimensions(dims)
                    setQlikMasterMeasures(ms)
                    setQlikMasterVisualizations(vs)
                }
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsQlikMasterItemLoading(false)
                setIsLoading(false)
            }
        },
        [
            qMasterDimensionsMap,
            qMasterMeasuresMap,
            qMasterVisualizationsMap,
            setIsQlikMasterItemLoading
        ]
    )

    useEffect(() => {
        setIsQlikMasterItemLoading(true)
        setIsLoading(isQlikAppLoading)
        if (!isQlikAppLoading && (qAppMap?.size > 0 || qDocMap?.size > 0)) {
            loadMasterItems(qAppMap, qDocMap)
        }
        return () => {
            setQlikMasterVisualizationsMap(new Map<string, QMasterVisualization[]>())
            setQlikMasterDimensionsMap(new Map<string, QMasterDimension[]>())
            setQlikMasterMeasuresMap(new Map<string, QMasterMeasure[]>())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isQlikAppLoading, qAppMap, qDocMap])

    const providerValues: QlikMasterItemContextType = {
        qMasterDimensions,
        qMasterMeasures,
        qMasterVisualizations,
        qMasterDimensionsMap,
        qMasterMeasuresMap,
        qMasterVisualizationsMap,
        setQlikMasterDimensionsMap,
        setQlikMasterMeasuresMap,
        setQlikMasterVisualizationsMap,
        setQlikMasterItemsByAppId
    }

    if (isLoading) return null

    return (
        <QlikMasterItemContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikMasterItemContext.Provider>
    )
}

export default QlikMasterItemProvider
