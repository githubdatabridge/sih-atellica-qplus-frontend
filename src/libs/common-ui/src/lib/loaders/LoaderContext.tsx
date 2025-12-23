import React, { useContext, ReactNode } from 'react'

type LoaderContextType = {
    isLoaderLoading?: boolean
    titleNode?: ReactNode | null
    loaderMessage: string
    setLoaderMessage: (message: string) => void
    setTitleNode: (titleNode: ReactNode) => void
    setLoaderIsLoading: (isLoading: boolean) => void
}

export const LoaderContext = React.createContext<LoaderContextType>({
    isLoaderLoading: true,
    loaderMessage: 'loading.. wait...',
    titleNode: null,
    setLoaderMessage: (_message: string) => {
        throw new Error('setLoaderMessage() not implemented')
    },
    setTitleNode: (_titleNode: unknown) => {
        throw new Error('setTitleNode() must be used within a LoaderContextProvider')
    },
    setLoaderIsLoading: (_isLoading: boolean) => {
        throw new Error('setLoaderIsLoading() must be used within a LoaderContextProvider')
    }
})

export const useLoaderContext = (): LoaderContextType => {
    return useContext(LoaderContext)
}
