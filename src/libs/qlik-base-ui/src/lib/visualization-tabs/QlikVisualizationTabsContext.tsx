import { createContext, Dispatch, SetStateAction } from 'react'

export type QlikVisualizationTabsContextType = {
    currentTabIndex: number
    setCurrentTabIndex: Dispatch<SetStateAction<number>> | undefined
}

export const QlikVisualizationTabsContext = createContext<QlikVisualizationTabsContextType>({
    currentTabIndex: 0,
    setCurrentTabIndex: undefined
})
