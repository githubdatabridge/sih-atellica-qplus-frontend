import { useContext, createContext } from 'react'

export type QlikLanguageContextType = {
    qlikLanguage?: string | null
    setQlikLanguage: (lang: string) => void
}

export const QlikLanguageContext = createContext<QlikLanguageContextType>({
    setQlikLanguage: (_lang: any) => {
        throw new Error('setQlikLanguage() must be used within a QlikLanguageProvider')
    }
})

export const useQlikLanguageContext = () => {
    const context = useContext(QlikLanguageContext)

    if (context === undefined) {
        throw new Error('useQlikLanguageContext must be used within a QlikLanguageContext')
    }

    return context
}
