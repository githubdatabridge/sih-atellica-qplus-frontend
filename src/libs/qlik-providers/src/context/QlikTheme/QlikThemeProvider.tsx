import React, { useState, useEffect, useCallback, ReactNode } from 'react'

import { useQlikBootstrapContext } from '../QlikBootstrap/QlikBootstrapContext'
import { QlikThemeContext, QlikThemeContextType } from './QlikThemeContext'

interface Props {
    theme?: string
    value?: QlikThemeContextType
    children: ReactNode
}

const QlikThemeProvider = ({ value, theme, children }: Props) => {
    const { q, qlikCapabilityApi } = useQlikBootstrapContext()

    const [qTheme, setTheme] = useState<string | null>(theme || null)

    useEffect(() => {
        if (q && qlikCapabilityApi?.$apiRoot?.$apiTheme) {
            const r = qlikCapabilityApi.$apiRoot.$apiTheme.apply(qTheme!)
            if (r) setTheme(qTheme)
        }
    }, [q, qTheme, qlikCapabilityApi?.$apiRoot?.$apiTheme])

    const setQlikTheme = useCallback(async (theme: string) => {
        setTheme(theme)
    }, [])

    return (
        <QlikThemeContext.Provider
            value={{
                qTheme,
                setQlikTheme,
                ...value
            }}>
            {children}
        </QlikThemeContext.Provider>
    )
}

export default QlikThemeProvider
