import React, { useContext } from 'react'

type QlikLoaderContextType = {
    isQlikLoading: boolean
    isQlikMasterItemLoading: boolean
    isQlikSheetLoading: boolean
    isQlikGlobalLoading: boolean
    isQlikAppLoading: boolean
    isQlikSelectionLoading: boolean
    qlikLoaderMessage: string
    setQlikLoaderMessage: (message: string) => void
    setIsQlikLoading: (isQlikLoading: boolean) => void
    setIsQlikGlobalLoading: (isQlikGlobalLoading: boolean) => void
    setIsQlikAppLoading: (isQlikAppLoading: boolean) => void
    setIsQlikMasterItemLoading: (isQlikMasterItemLoading: boolean) => void
    setIsQlikSheetLoading: (isQlikSheetLoading: boolean) => void
    setIsQlikSelectionLoading: (isQlikSheetLoading: boolean) => void
}

export const QlikLoaderContext = React.createContext<QlikLoaderContextType>({
    isQlikLoading: undefined,
    isQlikGlobalLoading: undefined,
    isQlikAppLoading: undefined,
    isQlikMasterItemLoading: undefined,
    isQlikSheetLoading: undefined,
    isQlikSelectionLoading: undefined,
    qlikLoaderMessage: 'loading.. wait...',
    setQlikLoaderMessage: (_message: string) => {
        throw new Error('setLoaderMessage() not implemented')
    },
    setIsQlikLoading: (_isQlikLoading: boolean) => {
        throw new Error('setQlikIsLoading() not implemented')
    },
    setIsQlikGlobalLoading: (_isQlikGlobalLoading: boolean) => {
        throw new Error('setIsQlikGlobalLoading() not implemented')
    },
    setIsQlikAppLoading: (_isQlikAppLoading: boolean) => {
        throw new Error('setIsQlikAppLoading() not implemented')
    },
    setIsQlikMasterItemLoading: (_isQlikMasterItemLoading: boolean) => {
        throw new Error('setIsQlikMasterItemLoading() not implemented')
    },
    setIsQlikSheetLoading: (_isQlikSheetLoading: boolean) => {
        throw new Error('setIsQlikSheetLoading() not implemented')
    },
    setIsQlikSelectionLoading: (_isQlikSelectionLoading: boolean) => {
        throw new Error('setIsQlikSelectionLoading() not implemented')
    }
})

export const useQlikLoaderContext = (): QlikLoaderContextType => {
    return useContext(QlikLoaderContext)
}
