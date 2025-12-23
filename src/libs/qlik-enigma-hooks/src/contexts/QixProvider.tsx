import React from 'react'

import useEngine from '../hooks/useEngine'
import { QixConfig } from '../types'
import { QixContext } from './QixContext'

interface IQixProviderProps {
    config: QixConfig
    children: React.ReactNode
}

const QixProvider: React.FC<IQixProviderProps> = ({ children, config }) => {
    const newEngine = useEngine(config)

    return (
        <QixContext.Provider
            value={{
                engine: newEngine
            }}>
            {children}
        </QixContext.Provider>
    )
}

export default QixProvider
