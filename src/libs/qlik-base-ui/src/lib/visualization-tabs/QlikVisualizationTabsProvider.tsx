import React, { ReactNode, useState } from 'react'

import {
    QlikVisualizationTabsContext,
    QlikVisualizationTabsContextType
} from './QlikVisualizationTabsContext'

interface Props {
    value?: QlikVisualizationTabsContextType
    children: ReactNode
}

const QlikVisualizationTabsProvider = ({ value, children }: Props) => {
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0)

    const providerValues: QlikVisualizationTabsContextType = {
        currentTabIndex,
        setCurrentTabIndex
    }

    return (
        <QlikVisualizationTabsContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikVisualizationTabsContext.Provider>
    )
}

export default QlikVisualizationTabsProvider
