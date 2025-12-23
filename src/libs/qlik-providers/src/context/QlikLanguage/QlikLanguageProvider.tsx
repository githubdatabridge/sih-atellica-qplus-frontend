import React, { ReactNode, useState } from 'react'

import { QlikLanguageContext, QlikLanguageContextType } from './QlikLanguageContext'

export interface QlikLanguageProps {
    value?: QlikLanguageContextType
    children: ReactNode
}

const QlikLanguageProvider: React.FC<QlikLanguageProps> = ({ value = {}, children }) => {
    const [qlikLanguage, setQlikLanguage] = useState<string | null>('en')

    return (
        <QlikLanguageContext.Provider
            value={{
                qlikLanguage,
                setQlikLanguage,
                ...value
            }}>
            {children}
        </QlikLanguageContext.Provider>
    )
}

export default QlikLanguageProvider
