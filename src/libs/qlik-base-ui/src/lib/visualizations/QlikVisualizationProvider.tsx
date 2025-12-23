import React, { ReactNode, useState } from 'react'

import { QlikVisualizationContext, QlikVisualizationContextType } from './QlikVisualizationContext'

export interface IQlikVisualizationProviderProps {
    value?: QlikVisualizationContextType
    children: ReactNode
}

const QlikVisualizationProvider = ({ value, children }: IQlikVisualizationProviderProps) => {
    const [showVisualization, setShowVisualization] = useState<boolean>(false)
    const [visualizationId, setVisualizationId] = useState<string>('')
    const [visualizationObject, setVisualizationObject] = useState<any>(null)
    const [visualizationOptions, setVisualizationOptions] = useState<any>({})
    const [visualizationColumns, setVisualizationColumns] = useState<any[]>([])
    const [visualizationType, setVisualizationType] = useState<string>('')

    const [onVisualizationExport, setOnVisualizationExport] =
        useState<(type: string) => void>(undefined)

    const [onVisualizationFullscreen, setOnVisualizationFullscreen] =
        useState<() => void>(undefined)

    const [onVisualizationTypeChange, setOnVisualizationTypeChange] =
        useState<(type: string) => void>(undefined)

    const providerValues: QlikVisualizationContextType = {
        visualizationType,
        visualizationObject,
        visualizationId,
        visualizationOptions,
        visualizationColumns,
        showVisualization,
        setShowVisualization,
        setVisualizationObject,
        setVisualizationId,
        setVisualizationOptions,
        onVisualizationTypeChange,
        onVisualizationFullscreen,
        setOnVisualizationFullscreen,
        onVisualizationExport,
        setOnVisualizationExport,
        setOnVisualizationTypeChange,
        setVisualizationColumns,
        setVisualizationType
    }

    return (
        <QlikVisualizationContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikVisualizationContext.Provider>
    )
}

export default QlikVisualizationProvider
