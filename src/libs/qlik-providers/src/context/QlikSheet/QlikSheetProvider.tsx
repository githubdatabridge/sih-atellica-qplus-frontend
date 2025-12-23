import React, { ReactNode, useState, useEffect, useCallback } from 'react'

import { QSheet } from '@libs/qlik-models'

import { QlikAppMap, useQlikAppContext } from '../QlikApp/QlikAppContext'
import { QlikDocMap, useQlikDocContext } from '../QlikDoc/QlikDocContext'
import { useQlikLoaderContext } from '../QlikLoader/QlikLoaderContext'
import { QlikSheetContext, QlikSheetContextType } from './QlikSheetContext'

export interface IQlikSheetProviderProps {
    children: ReactNode
    value?: QlikSheetContextType
}

const QlikSheetProvider = ({ value, children }: IQlikSheetProviderProps) => {
    const [qSheetMap, setQlikSheetMap] = useState<Map<string, QSheet[]>>(new Map())
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { isQlikAppLoading, setIsQlikSheetLoading } = useQlikLoaderContext()
    const { qDocMap } = useQlikDocContext()
    const { qAppMap } = useQlikAppContext()

    const loadSheets = useCallback(
        async (appMap: QlikAppMap, docMap: QlikDocMap) => {
            const sheetMap = new Map<string, QSheet[]>()
            let sheets = []
            try {
                for (const [key, value] of appMap) {
                    sheets = (await value?.qMixinsApi?._qPlusGetAppSheets(value?.qApi)) as QSheet[]
                    const uniqueSheets = [
                        ...new Map(sheets?.map(item => [item['id'], item])).values()
                    ] as QSheet[]
                    sheetMap.set(key, uniqueSheets)
                }
                for (const [key, value] of docMap) {
                    sheets = await value?.qDoc?.dApp._qPlusGetSheetList()
                    //TODO: This is questionable --downlevelIteration enabled in tsconfig for this to work
                    const uniqueSheets = [
                        ...new Map(sheets?.map(item => [item['id'], item])).values()
                    ] as QSheet[]
                    sheetMap.set(key, uniqueSheets)
                }
                setQlikSheetMap(sheetMap)
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsQlikSheetLoading(false)
                setIsLoading(false)
            }
        },
        [setIsQlikSheetLoading]
    )

    useEffect(() => {
        setIsQlikSheetLoading(true)
        setIsLoading(isQlikAppLoading)
        if (!isQlikAppLoading) {
            loadSheets(qAppMap, qDocMap)
        }
    }, [isQlikAppLoading, loadSheets, qAppMap, qDocMap, setIsQlikSheetLoading])

    const providerValues: QlikSheetContextType = {
        qSheetMap,
        setQlikSheetMap
    }

    if (isLoading) return null

    return (
        <QlikSheetContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikSheetContext.Provider>
    )
}

export default QlikSheetProvider
