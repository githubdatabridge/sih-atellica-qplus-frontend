import { useContext, createContext } from 'react'

export type QlikLabelsContextType = {
    qlikLabels?: any | null
    qlikLanguageId?: string | null
    qlikTranslations?: string | null
    setQlikLabels: (qlikLanguageId: string, translations: any, labels: any) => void
    getQlikLabel: (qlikLabels: any, qlikKey: string) => string
}

export const QlikLabelsContext = createContext<QlikLabelsContextType>({
    setQlikLabels: (_lngId, _translations, _labels) => {
        throw new Error('setQlikLabels() must be used within a QlikLabelsProvider')
    },
    getQlikLabel: (_labels, _key) => {
        throw new Error('getQlikLabel() must be used within a QlikLabelsProvider')
    }
})

export const useQlikLabelsContext = () => useContext(QlikLabelsContext)
