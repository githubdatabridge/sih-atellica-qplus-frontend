import { useContext, createContext } from 'react'

export type QlikThemeContextType = {
    qTheme?: string | null
    setQlikTheme: React.Dispatch<React.SetStateAction<string>>
}

export const QlikThemeContext = createContext<QlikThemeContextType>({
    setQlikTheme: _theme => {
        throw new Error('setQlikTheme() must be used within a QlikThemeProvider')
    }
})

export const useQlikThemeContext = () => {
    const context = useContext(QlikThemeContext)

    if (context === undefined) {
        throw new Error('useQlikThemeContext must be used within a QlikThemeContext')
    }

    return context
}
