import React, { useState, useCallback, ReactNode } from 'react'

import { QlikLoaderContext } from './QlikLoaderContext'

type QlikLoaderProviderProps = {
    children?: ReactNode
}
export const QlikLoaderProvider: React.FC<QlikLoaderProviderProps> = ({ children }) => {
    const [isQlikLoading, setIsLoading] = useState<boolean>(true)
    const [isQlikGlobalLoading, setIsGlobalLoading] = useState<boolean>(true)
    const [isQlikAppLoading, setIsAppLoading] = useState<boolean>(true)
    const [isQlikMasterItemLoading, setIsMasterItemLoading] = useState<boolean>(true)
    const [isQlikSheetLoading, setIsSheetLoading] = useState<boolean>(true)
    const [isQlikSelectionLoading, setIsSelectionLoading] = useState<boolean>(true)

    const [qlikLoaderMessage, setMessage] = useState<string>('')

    const setIsQlikLoading = useCallback((isLoading: boolean) => {
        setIsLoading(isLoading)
    }, [])

    const setIsQlikGlobalLoading = useCallback((isGlobalLoading: boolean) => {
        setIsGlobalLoading(isGlobalLoading)
    }, [])

    const setIsQlikAppLoading = useCallback((isAppLoading: boolean) => {
        setIsAppLoading(isAppLoading)
    }, [])

    const setIsQlikMasterItemLoading = useCallback((isMasterItemLoading: boolean) => {
        setIsMasterItemLoading(isMasterItemLoading)
    }, [])

    const setIsQlikSheetLoading = useCallback((isSheetLoading: boolean) => {
        setIsSheetLoading(isSheetLoading)
    }, [])

    const setIsQlikSelectionLoading = useCallback((isSelectionLoading: boolean) => {
        setIsSelectionLoading(isSelectionLoading)
    }, [])

    const setQlikLoaderMessage = useCallback((message: string) => {
        setMessage(message)
    }, [])

    const providerValue = {
        qlikLoaderMessage,
        isQlikLoading,
        isQlikGlobalLoading,
        isQlikAppLoading,
        isQlikMasterItemLoading,
        isQlikSheetLoading,
        isQlikSelectionLoading,
        setQlikLoaderMessage,
        setIsQlikLoading,
        setIsQlikGlobalLoading,
        setIsQlikAppLoading,
        setIsQlikMasterItemLoading,
        setIsQlikSheetLoading,
        setIsQlikSelectionLoading
    }

    return <QlikLoaderContext.Provider value={providerValue}>{children}</QlikLoaderContext.Provider>
}

export default QlikLoaderProvider
