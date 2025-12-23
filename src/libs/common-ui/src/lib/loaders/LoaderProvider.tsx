import React, { FC, useState, useCallback, ReactNode } from 'react'

import { LoaderContext } from './LoaderContext'

interface LoaderProviderProps {
    children?: ReactNode
}
export const LoaderProvider: FC<LoaderProviderProps> = ({ children }) => {
    const [isLoaderLoading, setIsLoading] = useState<boolean>(true)
    const [loaderMessage, setMessage] = useState<string>('')
    const [titleNode, setTitleIconNode] = useState<ReactNode>(null)

    const setLoaderMessage = useCallback((message: string) => {
        setMessage(message)
    }, [])

    const setTitleNode = useCallback((titleNode: ReactNode) => {
        setTitleIconNode(titleNode)
    }, [])

    const setLoaderIsLoading = useCallback((isLoading: boolean) => {
        setIsLoading(isLoading)
    }, [])

    const providerValue = {
        isLoaderLoading,
        loaderMessage,
        titleNode,
        setLoaderIsLoading,
        setLoaderMessage,
        setTitleNode
    }

    return <LoaderContext.Provider value={providerValue}>{children}</LoaderContext.Provider>
}

export default LoaderProvider
