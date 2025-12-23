import { useContext, createContext, Dispatch, SetStateAction } from 'react'

export type QlikBaseSocialContextType = {
    reportId?: number | null
    visualizationId?: number | null
    scope: string
    qlikAppId: string
    visComponentId: string
    pageId: string
    setVisualizationId: Dispatch<SetStateAction<number>> | undefined
    setReportId: Dispatch<SetStateAction<number>> | undefined
}

export const QlikBaseSocialContext = createContext<QlikBaseSocialContextType>({
    reportId: null,
    visualizationId: null,
    scope: '',
    qlikAppId: '',
    visComponentId: '',
    pageId: '',
    setVisualizationId: undefined,
    setReportId: undefined
})

export const useQlikBaseSocialContext = () => {
    const context = useContext(QlikBaseSocialContext)
    return context
}
