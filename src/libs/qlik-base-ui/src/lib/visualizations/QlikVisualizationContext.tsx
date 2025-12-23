import { useContext, createContext, Dispatch, SetStateAction } from 'react'

export type QlikVisualizationContextType = {
    visualizationObject: null
    visualizationId: string
    visualizationType: string
    visualizationOptions: any
    visualizationColumns: any[]
    showVisualization?: boolean
    setVisualizationId: Dispatch<SetStateAction<string>> | undefined
    setVisualizationColumns: Dispatch<SetStateAction<any[]>> | undefined
    setVisualizationObject: Dispatch<SetStateAction<any>> | undefined
    setVisualizationOptions: Dispatch<SetStateAction<any>> | undefined
    onVisualizationExport: (type: string) => void
    setOnVisualizationExport: Dispatch<SetStateAction<(type: string) => void>> | null | undefined
    onVisualizationFullscreen: () => void
    onVisualizationTypeChange: (type: string) => void
    setOnVisualizationFullscreen: Dispatch<SetStateAction<() => void>> | null | undefined
    setOnVisualizationTypeChange:
        | Dispatch<SetStateAction<(type: string) => void>>
        | null
        | undefined
    setShowVisualization: (show: boolean) => void
    setVisualizationType: (type: string) => void
}

export const QlikVisualizationContext = createContext<QlikVisualizationContextType>({
    visualizationType: '',
    visualizationObject: undefined,
    visualizationId: '',
    visualizationOptions: {},
    visualizationColumns: [],
    showVisualization: false,
    setVisualizationObject: undefined,
    setVisualizationId: undefined,
    setVisualizationOptions: undefined,
    onVisualizationFullscreen: undefined,
    setOnVisualizationFullscreen: undefined,
    onVisualizationExport: undefined,
    setOnVisualizationExport: undefined,
    onVisualizationTypeChange: undefined,
    setOnVisualizationTypeChange: undefined,
    setVisualizationColumns: undefined,
    setShowVisualization: undefined,
    setVisualizationType: undefined
})

export const useQlikVisualizationContext = () => useContext(QlikVisualizationContext)
