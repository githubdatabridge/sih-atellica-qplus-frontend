import React, { ReactNode, useState, useCallback } from 'react'

import InfoIcon from '@mui/icons-material/Info'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import TableViewIcon from '@mui/icons-material/TableView'

import { QlikReportingUiContext, QlikReportingUiContextType } from './QlikReportingUiContext'

interface Props {
    value?: QlikReportingUiContextType
    children: ReactNode
}
const QlikReportingUiProvider = ({ value, children }: Props) => {
    const [reportingExportXlsxNode, setReportingExportXlsxIconNode] = useState<ReactNode>(
        <TableViewIcon color="primary" fontSize="small" />
    )
    const [reportingExportPngNode, setReportingExportPngIconNode] = useState<ReactNode>(
        <InsertPhotoIcon color="primary" fontSize="small" />
    )
    const [reportingExportPdfNode, setReportingExportPdfIconNode] = useState<ReactNode>(
        <PictureAsPdfIcon color="primary" fontSize="small" />
    )
    const [reportingInfoNode, setReportingInfoIconNode] = useState<ReactNode>(
        <InfoIcon color="primary" fontSize="small" />
    )

    const [reportingFullscreenNode, setReportingFullscreenIconNode] = useState<ReactNode>(null)

    const [reportingFilterNode, setReportingFilterIconNode] = useState<ReactNode>(null)
    const [reportingImportExportNode, setReportingImportExportIconNode] = useState<ReactNode>(null)
    const [reportingShareNode, setReportingShareIconNode] = useState<ReactNode>(null)
    const [reportingCloneNode, setReportingCloneIconNode] = useState<ReactNode>(null)
    const [reportingEraseNode, setReportingEraseIconNode] = useState<ReactNode>(null)
    const [reportingRemoveNode, setReportingRemoveIconNode] = useState<ReactNode>(null)
    const [reportingCancelNode, setReportingCancelIconNode] = useState<ReactNode>(null)
    const [reportingClearNode, setReportingClearIconNode] = useState<ReactNode>(null)
    const [reportingCommentNode, setReportingCommentIconNode] = useState<ReactNode>(null)
    const [reportingEditNode, setReportingEditIconNode] = useState<ReactNode>(null)
    const [reportingAddNode, setReportingAddIconNode] = useState<ReactNode>(null)
    const [reportingSaveNode, setReportingSaveIconNode] = useState<ReactNode>(null)
    const [reportingTitleInfoNode, setReportingTitleInfoIconNode] = useState<ReactNode>(null)
    const [reportingListNode, setReportingListIconNode] = useState<ReactNode>(null)
    const [reportingTuneNode, setReportingTuneIconNode] = useState<ReactNode>(null)
    const [reportingSearchNode, setReportingSearchIconNode] = useState<ReactNode>(null)
    const [reportingSortNode, setReportingSortIconNode] = useState<ReactNode>(null)
    const [reportingImportNode, setReportingImportIconNode] = useState<ReactNode>(null)
    const [reportingExportNode, setReportingExportIconNode] = useState<ReactNode>(null)
    const [reportingWizardNode, setReportingWizardImageNode] = useState<ReactNode>(null)

    const [reportingChartPivotTableNode, setReportingPivotTableNode] = useState<ReactNode>(null)
    const [reportingChartTableNode, setReportingTableNode] = useState<ReactNode>(null)
    const [reportingChartBarNode, setReportingBarNode] = useState<ReactNode>(null)
    const [reportingChartLineNode, setReportingLineNode] = useState<ReactNode>(null)
    const [reportingChartComboNode, setReportingComboNode] = useState<ReactNode>(null)
    const [reportingChartScatterNode, setReportingScatterNode] = useState<ReactNode>(null)
    const [reportingChartMapNode, setReportingMapNode] = useState<ReactNode>(null)
    const [reportingChartDistributionPlotNode, setReportingDistributionPlotNode] =
        useState<ReactNode>(null)
    const [reportingChartPieNode, setReportingPieNode] = useState<ReactNode>(null)
    const [reportingChartTreemapNode, setReportingTreemapNode] = useState<ReactNode>(null)
    const [reportingChartKpiNode, setReportingKpiNode] = useState<ReactNode>(null)
    const [reportingChartCustomNode, setReportingCustomNode] = useState<ReactNode>(null)

    const [cssReportingControlButtonIcon, setCssControlButtonIcon] = useState<any>({})
    const [cssReportingHeader, setCssHeader] = useState<any>({})
    const [cssReportingChartButtonIcon, setCssChartButtonIcon] = useState<any>({})

    const setReportingExportNode = useCallback((exportNode: ReactNode) => {
        setReportingExportIconNode(exportNode)
    }, [])

    const setReportingExportXlsxNode = useCallback((exportXlsxNode: ReactNode) => {
        setReportingExportXlsxIconNode(exportXlsxNode)
    }, [])

    const setReportingExportPdfNode = useCallback((exportPdfNode: ReactNode) => {
        setReportingExportPdfIconNode(exportPdfNode)
    }, [])

    const setReportingExportPngNode = useCallback((exportPngNode: ReactNode) => {
        setReportingExportPngIconNode(exportPngNode)
    }, [])

    const setReportingFullscreenNode = useCallback((fullscreenNode: ReactNode) => {
        setReportingFullscreenIconNode(fullscreenNode)
    }, [])

    const setReportingAddNode = useCallback((node: ReactNode) => {
        setReportingAddIconNode(node)
    }, [])

    const setReportingCancelNode = useCallback((node: ReactNode) => {
        setReportingCancelIconNode(node)
    }, [])

    const setReportingClearNode = useCallback((node: ReactNode) => {
        setReportingClearIconNode(node)
    }, [])

    const setReportingCloneNode = useCallback((node: ReactNode) => {
        setReportingCloneIconNode(node)
    }, [])

    const setReportingEditNode = useCallback((node: ReactNode) => {
        setReportingEditIconNode(node)
    }, [])

    const setReportingEraseNode = useCallback((node: ReactNode) => {
        setReportingEraseIconNode(node)
    }, [])

    const setReportingFilterNode = useCallback((node: ReactNode) => {
        setReportingFilterIconNode(node)
    }, [])

    const setReportingImportExportNode = useCallback((node: ReactNode) => {
        setReportingImportExportIconNode(node)
    }, [])

    const setReportingInfoNode = useCallback((node: ReactNode) => {
        setReportingInfoIconNode(node)
    }, [])

    const setReportingTitleInfoNode = useCallback((node: ReactNode) => {
        setReportingTitleInfoIconNode(node)
    }, [])

    const setReportingRemoveNode = useCallback((node: ReactNode) => {
        setReportingRemoveIconNode(node)
    }, [])

    const setReportingSaveNode = useCallback((node: ReactNode) => {
        setReportingSaveIconNode(node)
    }, [])

    const setReportingShareNode = useCallback((node: ReactNode) => {
        setReportingShareIconNode(node)
    }, [])

    const setReportingCommentNode = useCallback((node: ReactNode) => {
        setReportingCommentIconNode(node)
    }, [])

    const setReportingListNode = useCallback((node: ReactNode) => {
        setReportingListIconNode(node)
    }, [])

    const setReportingTuneNode = useCallback((node: ReactNode) => {
        setReportingTuneIconNode(node)
    }, [])

    const setReportingSortNode = useCallback((node: ReactNode) => {
        setReportingSortIconNode(node)
    }, [])

    const setReportingSearchNode = useCallback((node: ReactNode) => {
        setReportingSearchIconNode(node)
    }, [])

    const setReportingImportNode = useCallback((node: ReactNode) => {
        setReportingImportIconNode(node)
    }, [])

    const setReportingChartTableNode = useCallback((node: ReactNode) => {
        setReportingTableNode(node)
    }, [])

    const setReportingChartPivotTableNode = useCallback((node: ReactNode) => {
        setReportingPivotTableNode(node)
    }, [])

    const setReportingChartBarNode = useCallback((node: ReactNode) => {
        setReportingBarNode(node)
    }, [])

    const setReportingChartLineNode = useCallback((node: ReactNode) => {
        setReportingLineNode(node)
    }, [])

    const setReportingChartComboNode = useCallback((node: ReactNode) => {
        setReportingComboNode(node)
    }, [])

    const setReportingChartScatterNode = useCallback((node: ReactNode) => {
        setReportingScatterNode(node)
    }, [])

    const setReportingChartMapNode = useCallback((node: ReactNode) => {
        setReportingMapNode(node)
    }, [])

    const setReportingChartDistributionPlotNode = useCallback((node: ReactNode) => {
        setReportingDistributionPlotNode(node)
    }, [])

    const setReportingChartPieNode = useCallback((node: ReactNode) => {
        setReportingPieNode(node)
    }, [])

    const setReportingChartTreemapNode = useCallback((node: ReactNode) => {
        setReportingTreemapNode(node)
    }, [])

    const setReportingChartKpiNode = useCallback((node: ReactNode) => {
        setReportingKpiNode(node)
    }, [])

    const setReportingChartCustomNode = useCallback((node: ReactNode) => {
        setReportingCustomNode(node)
    }, [])

    const setReportingWizardNode = useCallback((node: ReactNode) => {
        setReportingWizardImageNode(node)
    }, [])

    const setCssReportingControlButtonIcon = useCallback((css: any) => {
        setCssControlButtonIcon(css)
    }, [])

    const setCssReportingChartButtonIcon = useCallback((css: any) => {
        setCssChartButtonIcon(css)
    }, [])

    const setCssReportingHeader = useCallback((css: any) => {
        setCssHeader(css)
    }, [])

    const providerValue: QlikReportingUiContextType = {
        reportingAddNode,
        reportingCancelNode,
        reportingClearNode,
        reportingCloneNode,
        reportingCommentNode,
        reportingEditNode,
        reportingEraseNode,
        reportingFilterNode,
        reportingImportExportNode,
        reportingInfoNode,
        reportingRemoveNode,
        reportingSaveNode,
        reportingShareNode,
        reportingListNode,
        reportingTuneNode,
        reportingSortNode,
        reportingSearchNode,
        reportingExportXlsxNode,
        reportingExportPdfNode,
        reportingExportPngNode,
        reportingFullscreenNode,
        reportingImportNode,
        reportingExportNode,
        reportingTitleInfoNode,
        reportingChartBarNode,
        reportingChartComboNode,
        reportingChartDistributionPlotNode,
        reportingChartKpiNode,
        reportingChartLineNode,
        reportingChartMapNode,
        reportingChartPieNode,
        reportingChartPivotTableNode,
        reportingChartScatterNode,
        reportingChartTableNode,
        reportingChartTreemapNode,
        reportingChartCustomNode,
        reportingWizardNode,
        cssReportingControlButtonIcon,
        cssReportingHeader,
        cssReportingChartButtonIcon,
        setReportingChartBarNode,
        setReportingChartComboNode,
        setReportingChartDistributionPlotNode,
        setReportingChartKpiNode,
        setReportingChartLineNode,
        setReportingChartMapNode,
        setReportingChartPieNode,
        setReportingChartPivotTableNode,
        setReportingChartScatterNode,
        setReportingChartTableNode,
        setReportingChartTreemapNode,
        setReportingChartCustomNode,
        setReportingAddNode,
        setReportingCancelNode,
        setReportingClearNode,
        setReportingCloneNode,
        setReportingCommentNode,
        setReportingEditNode,
        setReportingEraseNode,
        setReportingFilterNode,
        setReportingImportExportNode,
        setReportingInfoNode,
        setReportingRemoveNode,
        setReportingSaveNode,
        setReportingShareNode,
        setReportingListNode,
        setReportingTuneNode,
        setReportingSearchNode,
        setReportingSortNode,
        setReportingImportNode,
        setReportingExportNode,
        setReportingExportXlsxNode,
        setReportingExportPdfNode,
        setReportingExportPngNode,
        setReportingFullscreenNode,
        setReportingTitleInfoNode,
        setReportingWizardNode,
        setCssReportingControlButtonIcon,
        setCssReportingHeader,
        setCssReportingChartButtonIcon
    }
    return (
        <QlikReportingUiContext.Provider value={{ ...providerValue, ...value }}>
            {children}
        </QlikReportingUiContext.Provider>
    )
}

export default QlikReportingUiProvider
