import React, { ReactNode, useCallback, useState } from "react";

import { QlikLabelsContext, QlikLabelsContextType } from './QlikLabelsContext'

interface Props {
    value?: QlikLabelsContextType
    children: ReactNode
}

const QlikLabelsProvider: React.FC<Props> = ({ value = {}, children }) => {
    const [qlikLanguageId, setQlikLanguageId] = useState<string | null>(null)
    const [qlikLabels, setLabels] = useState<any | null>(null)
    const [qlikTranslations, setTranslations] = useState<any | null>(null)

    const setQlikLabels = useCallback((lngId: string, translations: any, labels: any) => {
        setQlikLanguageId(lngId)
        setTranslations(translations)
        setLabels(labels)
    }, [])

    const getQlikLabel = useCallback((labels: any, key: string) => {
        const l = labels(l => l.labelKey === key)
        return l?.title
    }, [])

    return (
        <QlikLabelsContext.Provider
            value={{
                qlikTranslations,
                qlikLabels,
                qlikLanguageId,
                setQlikLabels,
                getQlikLabel,
                ...value
            }}>
            {children}
        </QlikLabelsContext.Provider>
    )
}

export default QlikLabelsProvider
