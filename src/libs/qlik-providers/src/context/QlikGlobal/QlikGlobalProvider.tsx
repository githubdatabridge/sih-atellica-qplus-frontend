import React, { ReactNode, useState, useEffect } from 'react'

import { QGlobalResult } from '@libs/qlik-models'

import { useQlikLoaderContext } from '../QlikLoader/QlikLoaderContext'
import { QlikGlobalContext, QlikGlobalContextType } from './QlikGlobalContext'

export interface IQlikGlobalProviderProps {
    children: ReactNode
    value?: QlikGlobalContextType
}

const QlikGlobalProvider = ({ value, children }: IQlikGlobalProviderProps) => {
    const [qGlobalMap, setQlikGlobalMap] = useState<Map<string, QGlobalResult>>(new Map())
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { isQlikLoading, setIsQlikGlobalLoading } = useQlikLoaderContext()

    useEffect(() => {
        setIsLoading(isQlikLoading)
        setIsQlikGlobalLoading(isQlikLoading)
        return () => {
            const cleanUpMap = new Map<string, QGlobalResult>()
            setQlikGlobalMap(cleanUpMap)
        }
    }, [isQlikLoading, setIsQlikGlobalLoading])

    const providerValues: QlikGlobalContextType = {
        qGlobalMap,
        setQlikGlobalMap
    }

    if (isLoading) return null

    return (
        <QlikGlobalContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikGlobalContext.Provider>
    )
}

export default QlikGlobalProvider
