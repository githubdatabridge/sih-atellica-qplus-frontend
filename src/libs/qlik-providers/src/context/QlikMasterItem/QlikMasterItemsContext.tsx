import { useContext, createContext } from 'react'

import { QMasterDimension, QMasterMeasure, QMasterVisualization } from '@libs/qlik-models'

export type QlikMasterDimensionsMap = Map<string, QMasterDimension[]>
export type QlikMasterMeasuresMap = Map<string, QMasterMeasure[]>
export type QlikMasterVisualizationsMap = Map<string, QMasterVisualization[]>

export interface QlikMasterItemContextType {
    qMasterDimensions: QMasterDimension[]
    qMasterMeasures: QMasterMeasure[]
    qMasterVisualizations: QMasterVisualization[]
    qMasterDimensionsMap: QlikMasterDimensionsMap
    qMasterMeasuresMap: QlikMasterMeasuresMap
    qMasterVisualizationsMap: QlikMasterVisualizationsMap
    setQlikMasterItemsByAppId: (qAppId: string) => void
    setQlikMasterDimensionsMap: (qMasterDimensionsMap: Map<string, QMasterDimension[]>) => void
    setQlikMasterMeasuresMap: (qMasterDimensionsMap: Map<string, QMasterMeasure[]>) => void
    setQlikMasterVisualizationsMap: (
        qMasterVisualizationsMap: Map<string, QMasterVisualization[]>
    ) => void
}

export const QlikMasterItemContext = createContext<QlikMasterItemContextType>({
    qMasterDimensions: [],
    qMasterMeasures: [],
    qMasterVisualizations: [],
    qMasterDimensionsMap: new Map(),
    qMasterMeasuresMap: new Map(),
    qMasterVisualizationsMap: new Map(),
    setQlikMasterDimensionsMap: undefined,
    setQlikMasterMeasuresMap: undefined,
    setQlikMasterVisualizationsMap: undefined,
    setQlikMasterItemsByAppId: undefined
})

export const useQlikMasterItemContext = () => {
    const context = useContext(QlikMasterItemContext)

    if (context === undefined) {
        throw new Error('useQlikMasterItemContext must be used within a QlikMasterItemContext')
    }

    return context
}
