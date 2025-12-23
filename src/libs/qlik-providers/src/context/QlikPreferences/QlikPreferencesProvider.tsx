import React, { ReactNode } from 'react'

import { QlikPreferencesContext, QlikPreferencesContextType } from './QlikPreferencesContext'

interface Props {
    value?: QlikPreferencesContextType
    children: ReactNode
}
const QlikPreferencesProvider = ({ value, children }: Props) => {
    return <QlikPreferencesContext.Provider value={{ ...value }}></QlikPreferencesContext.Provider>
}

export default QlikPreferencesProvider
