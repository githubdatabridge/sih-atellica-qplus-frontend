import { useContext, createContext } from 'react'

export type QlikTitleContextType = {
    qlikTitle?: string | null
    qlikSubtitle?: string | null
    qlikFootnote?: string | null
    showQlikTitle?: boolean | null
    setQlikFooter: (footnote: string) => void
    setQlikTitles: (title: string, subtitle: string) => void
    setShowQlikTitle: (show: boolean) => void
}

export const QlikTitleContext = createContext<QlikTitleContextType>({
    qlikTitle: '',
    qlikSubtitle: '',
    qlikFootnote: '',
    showQlikTitle: false,
    setQlikTitles: (_title, _subtitle) => {
        throw new Error('setQlikTitles() must be used within a QlikTitleProvider')
    },
    setQlikFooter: _footnote => {
        throw new Error('setQlikTitles() must be used within a QlikTitleProvider')
    },
    setShowQlikTitle: _show => {
        throw new Error('setShowQlikTitle() must be used within a QlikTitleProvider')
    }
})

export const useQlikTitleContext = () => useContext(QlikTitleContext)
