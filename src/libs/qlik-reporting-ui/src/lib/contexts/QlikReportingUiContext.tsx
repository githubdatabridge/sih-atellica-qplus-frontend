import { useContext, createContext, ReactNode } from 'react'

export type QlikReportingUiContextType = {
    reportingExportXlsxNode?: ReactNode | null
    reportingExportPdfNode?: ReactNode | null
    reportingExportPngNode?: ReactNode | null
    reportingFullscreenNode?: ReactNode | null
    reportingFilterNode?: ReactNode | null
    reportingCommentNode?: ReactNode | null
    reportingImportExportNode?: ReactNode | null
    reportingShareNode?: ReactNode | null
    reportingCloneNode?: ReactNode | null
    reportingEraseNode?: ReactNode | null
    reportingClearNode?: ReactNode | null
    reportingRemoveNode?: ReactNode | null
    reportingCancelNode?: ReactNode | null
    reportingEditNode?: ReactNode | null
    reportingAddNode?: ReactNode | null
    reportingSaveNode?: ReactNode | null
    reportingInfoNode?: ReactNode | null
    reportingTitleInfoNode?: ReactNode | null
    reportingListNode?: ReactNode | null
    reportingTuneNode?: ReactNode | null
    reportingSortNode?: ReactNode | null
    reportingSearchNode?: ReactNode | null
    reportingImportNode?: ReactNode | null
    reportingExportNode?: ReactNode | null
    reportingChartPivotTableNode?: ReactNode | null
    reportingChartTableNode?: ReactNode | null
    reportingChartBarNode?: ReactNode | null
    reportingChartLineNode?: ReactNode | null
    reportingChartComboNode?: ReactNode | null
    reportingChartScatterNode?: ReactNode | null
    reportingChartMapNode?: ReactNode | null
    reportingChartDistributionPlotNode?: ReactNode | null
    reportingChartPieNode?: ReactNode | null
    reportingChartTreemapNode?: ReactNode | null
    reportingChartKpiNode?: ReactNode | null
    reportingChartCustomNode?: ReactNode | null
    reportingWizardNode?: ReactNode | null
    cssReportingControlButtonIcon?: any
    cssReportingChartButtonIcon?: any
    cssReportingHeader?: any
    setReportingExportXlsxNode: (exportNode: ReactNode) => void
    setReportingExportPdfNode: (exportNode: ReactNode) => void
    setReportingExportPngNode: (exportNode: ReactNode) => void
    setReportingFullscreenNode: (fullscreenNode: ReactNode) => void
    setReportingFilterNode: (node: ReactNode) => void
    setReportingCommentNode: (node: ReactNode) => void
    setReportingListNode: (node: ReactNode) => void
    setReportingImportExportNode: (node: ReactNode) => void
    setReportingShareNode: (node: ReactNode) => void
    setReportingCloneNode: (node: ReactNode) => void
    setReportingClearNode: (node: ReactNode) => void
    setReportingEraseNode: (node: ReactNode) => void
    setReportingRemoveNode: (node: ReactNode) => void
    setReportingCancelNode: (node: ReactNode) => void
    setReportingEditNode: (node: ReactNode) => void
    setReportingAddNode: (node: ReactNode) => void
    setReportingSaveNode: (node: ReactNode) => void
    setReportingInfoNode: (node: ReactNode) => void
    setReportingTitleInfoNode: (node: ReactNode) => void
    setReportingTuneNode: (node: ReactNode) => void
    setReportingSortNode: (node: ReactNode) => void
    setReportingSearchNode: (node: ReactNode) => void
    setReportingImportNode: (node: ReactNode) => void
    setReportingExportNode: (node: ReactNode) => void
    setReportingChartPivotTableNode: (node: ReactNode) => void
    setReportingChartTableNode: (node: ReactNode) => void
    setReportingChartBarNode: (node: ReactNode) => void
    setReportingChartLineNode: (node: ReactNode) => void
    setReportingChartComboNode: (node: ReactNode) => void
    setReportingChartScatterNode: (node: ReactNode) => void
    setReportingChartMapNode: (node: ReactNode) => void
    setReportingChartDistributionPlotNode: (node: ReactNode) => void
    setReportingChartPieNode: (node: ReactNode) => void
    setReportingChartTreemapNode: (node: ReactNode) => void
    setReportingChartKpiNode: (node: ReactNode) => void
    setReportingChartCustomNode: (node: ReactNode) => void
    setReportingWizardNode: (node: ReactNode) => void
    setCssReportingControlButtonIcon: (css: any) => void
    setCssReportingChartButtonIcon: (css: any) => void
    setCssReportingHeader: (css: any) => void
}

export const QlikReportingUiContext = createContext<QlikReportingUiContextType>({
    reportingExportXlsxNode: null,
    reportingExportPdfNode: null,
    reportingExportPngNode: null,
    reportingFullscreenNode: null,
    reportingFilterNode: null,
    reportingCommentNode: null,
    reportingImportExportNode: null,
    reportingShareNode: null,
    reportingCloneNode: null,
    reportingEraseNode: null,
    reportingClearNode: null,
    reportingRemoveNode: null,
    reportingCancelNode: null,
    reportingEditNode: null,
    reportingAddNode: null,
    reportingSaveNode: null,
    reportingInfoNode: null,
    reportingListNode: null,
    reportingTuneNode: null,
    reportingSearchNode: null,
    reportingSortNode: null,
    reportingImportNode: null,
    reportingExportNode: null,
    reportingTitleInfoNode: null,
    reportingChartPivotTableNode: null,
    reportingChartTableNode: null,
    reportingChartBarNode: null,
    reportingChartLineNode: null,
    reportingChartComboNode: null,
    reportingChartScatterNode: null,
    reportingChartMapNode: null,
    reportingChartDistributionPlotNode: null,
    reportingChartPieNode: null,
    reportingChartTreemapNode: null,
    reportingChartKpiNode: null,
    reportingChartCustomNode: null,
    reportingWizardNode: null,
    cssReportingControlButtonIcon: undefined,
    cssReportingChartButtonIcon: undefined,
    cssReportingHeader: undefined,
    setReportingExportNode: (_exportNode: unknown) => {
        throw new Error('setReportingExportNode() must be used within a QlikReportingUiProvider')
    },
    setReportingExportXlsxNode: (_exportXlsxNode: unknown) => {
        throw new Error(
            'setReportingExportXlsxNode() must be used within a QlikReportingUiProvider'
        )
    },
    setReportingExportPdfNode: (_exportPdfNode: unknown) => {
        throw new Error('setReportingExportPdfNode() must be used within a QlikReportingUiProvider')
    },
    setReportingExportPngNode: (_exportPngNode: unknown) => {
        throw new Error('setReportingExportPngNode() must be used within a QlikReportingUiProvider')
    },
    setReportingFullscreenNode: (_fullscreenNode: unknown) => {
        throw new Error(
            'setReportingFullscreenNode() must be used within a QlikReportingUiProvider'
        )
    },
    setReportingInfoNode: (_infoNode: unknown) => {
        throw new Error('setReportingInfoNode() must be used within a QlikReportingUiProvider')
    },
    setReportingTitleInfoNode: (_infoNode: unknown) => {
        throw new Error('setReportingTitleInfoNode() must be used within a QlikReportingUiProvider')
    },
    setReportingFilterNode: (_filterNode: unknown) => {
        throw new Error('setFilterNode() must be used within a QlikReportingUiProvider')
    },
    setReportingCommentNode: (_node: unknown) => {
        throw new Error('setReportingCommentNode() must be used within a QlikReportingUiProvider')
    },
    setReportingListNode: (_node: unknown) => {
        throw new Error('setReportingListNode() must be used within a QlikReportingUiProvider')
    },
    setReportingImportExportNode: (_node: unknown) => {
        throw new Error(
            'setReportingImportExportNode() must be used within a QlikReportingUiProvider'
        )
    },
    setReportingShareNode: (_node: unknown) => {
        throw new Error('setReportingShareNode() must be used within a QlikReportingUiProvider')
    },
    setReportingCloneNode: (_node: unknown) => {
        throw new Error('setReportingCloneNode() must be used within a QlikReportingUiProvider')
    },
    setReportingClearNode: (_node: unknown) => {
        throw new Error('setReportingClearNode() must be used within a QlikReportingUiProvider')
    },
    setReportingEraseNode: (_node: unknown) => {
        throw new Error('setReportingEraseNode() must be used within a QlikReportingUiProvider')
    },
    setReportingRemoveNode: (_node: unknown) => {
        throw new Error('setReportingRemoveNode() must be used within a QlikReportingUiProvider')
    },
    setReportingCancelNode: (_node: unknown) => {
        throw new Error('setReportingCancelNode() must be used within a QlikReportingUiProvider')
    },
    setReportingEditNode: (_node: unknown) => {
        throw new Error('setReportingEditNode() must be used within a QlikReportingUiProvider')
    },
    setReportingAddNode: (_node: unknown) => {
        throw new Error('setReportingAddNode() must be used within a QlikReportingUiProvider')
    },
    setReportingSaveNode: (_node: unknown) => {
        throw new Error('setReportingSaveNode() must be used within a QlikReportingUiProvider')
    },
    setReportingTuneNode: (_node: unknown) => {
        throw new Error('setReportingTuneNode() must be used within a QlikReportingUiProvider')
    },
    setReportingSortNode: (_node: unknown) => {
        throw new Error('setReportingSortNode() must be used within a QlikReportingUiProvider')
    },
    setReportingSearchNode: (_node: unknown) => {
        throw new Error('setReportingSearchNode() must be used within a QlikReportingUiProvider')
    },
    setReportingImportNode: (_node: unknown) => {
        throw new Error('setReportingImportNode() must be used within a QlikReportingUiProvider')
    },
    setReportingChartPivotTableNode: (_node: unknown) => {
        throw new Error(
            'setReportingChartPivotTableNode() must be used within a QlikReportingUiProvider'
        )
    },
    setReportingChartTableNode: (_node: unknown) => {
        throw new Error(
            'setReportingChartTableNode() must be used within a QlikReportingUiProvider'
        )
    },
    setReportingChartBarNode: (_node: unknown) => {
        throw new Error('setReportingChartBarNode() must be used within a QlikReportingUiProvider')
    },
    setReportingChartLineNode: (_node: unknown) => {
        throw new Error('setReportingChartLineNode() must be used within a QlikReportingUiProvider')
    },
    setReportingChartComboNode: (_node: unknown) => {
        throw new Error(
            'setReportingChartComboNode() must be used within a QlikReportingUiProvider'
        )
    },
    setReportingChartScatterNode: (_node: unknown) => {
        throw new Error(
            'setReportingChartScatterNode() must be used within a QlikReportingUiProvider'
        )
    },
    setReportingChartMapNode: (_node: unknown) => {
        throw new Error('setReportingChartMapNode() must be used within a QlikReportingUiProvider')
    },
    setReportingChartDistributionPlotNode: (_node: unknown) => {
        throw new Error(
            'setReportingChartDistributionPlotNode() must be used within a QlikReportingUiProvider'
        )
    },
    setReportingChartPieNode: (_node: unknown) => {
        throw new Error('setReportingChartPieNode() must be used within a QlikReportingUiProvider')
    },
    setReportingChartTreemapNode: (_node: unknown) => {
        throw new Error(
            'setReportingChartTreemapNode() must be used within a QlikReportingUiProvider'
        )
    },
    setReportingWizardNode: (_node: unknown) => {
        throw new Error('setReportingWizardNode() must be used within a QlikReportingUiProvider')
    },
    setReportingChartKpiNode: (_node: unknown) => {
        throw new Error('setReportingChartKpiNode() must be used within a QlikReportingUiProvider')
    },
    setReportingChartCustomNode: (_node: unknown) => {
        throw new Error(
            'setReportingChartCustomNode() must be used within a QlikReportingUiProvider'
        )
    },
    setCssReportingControlButtonIcon: (_css: any) => {
        throw new Error(
            'setCssReportingControlButtonIcon() must be used within a QlikReportingUiProvider'
        )
    },
    setCssReportingChartButtonIcon: (_css: any) => {
        throw new Error(
            'setCssReportingChartButtonIcon() must be used within a QlikReportingUiProvider'
        )
    },
    setCssReportingHeader: (_css: any) => {
        throw new Error('setCssReportingHeader() must be used within a QlikReportingUiProvider')
    }
})

export const useQlikReportingUiContext = () => useContext(QlikReportingUiContext)
