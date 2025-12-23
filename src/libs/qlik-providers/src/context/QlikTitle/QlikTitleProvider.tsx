import React, { ReactNode, useCallback, useState } from 'react'

import { QlikTitleContext, QlikTitleContextType } from './QlikTitleContext'

interface Props {
    value?: QlikTitleContextType
    children: ReactNode
}

const QlikTitleProvider: React.FC<Props> = ({ value = {}, children }) => {
    const [showQlikTitle, setShowQlikTitle] = useState<boolean | null>(false)
    const [qlikTitle, setQlikTitle] = useState<string | null>(null)
    const [qlikSubtitle, setQlikSubtitle] = useState<string | null>(null)
    const [qlikFootnote, setQlikFootnote] = useState<string | null>(null)

    const setQlikTitles = useCallback((title: string, subtitle: string) => {
        setQlikTitle(title)
        setQlikSubtitle(subtitle)
    }, [])

    const setQlikFooter = useCallback((footnote: string) => {
        setQlikFootnote(footnote)
    }, [])

    return (
        <QlikTitleContext.Provider
            value={{
                qlikTitle,
                qlikSubtitle,
                qlikFootnote,
                showQlikTitle,
                setShowQlikTitle,
                setQlikTitles,
                setQlikFooter,
                ...value
            }}>
            {children}
        </QlikTitleContext.Provider>
    )
}

export default QlikTitleProvider
