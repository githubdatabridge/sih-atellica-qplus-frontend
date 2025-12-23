import { FC } from 'react'

import { Report } from '@libs/common-models'
import { QlikVisualizationApi } from '@libs/qlik-base-ui'
import { QlikActionsProvider } from '@libs/qlik-providers'

import { REPORTING_BASE_CHARTS } from '../constants/constants'
import QlikPinWallEmptyCell from '../QlikPinWallEmptyCell'

const backendToGridLibMapperReport = (
    backendCell: any,
    reports: Report[],
    qlikAppMap: any,
    qlikMasterDimensionsMap: any,
    qlikMasterMeasuresMap: any,
    exportTypes?: Array<'xlsx' | 'pdf' | 'png'>,
    showAppWaterMark = true,
    isFixed = true,
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit',
    classNames?: any
) => {
    let qDimensions = []
    let qMeasures = []
    let columns = []
    let visualizationType = ''
    let options = {}
    let currQlikAppId = ''

    const report = reports?.find(r => r.id === backendCell.reportId)
    currQlikAppId = report?.dataset?.qlikAppId
    const qApp = qlikAppMap.get(currQlikAppId)
    const qMasterDimensions = qlikMasterDimensionsMap.get(currQlikAppId)
    const qMasterMeasures = qlikMasterMeasuresMap.get(currQlikAppId)

    if (report && qApp) {
        qDimensions = qApp.qMixinsApi._qPlusGetVizDimensions(
            report.content.dimensions,
            qMasterDimensions
        )
        qMeasures = qApp.qMixinsApi._qPlusGetVizMeasures(report.content.measures, qMasterMeasures)
        columns = qApp.qMixinsApi._qPlusGetVizColumns(qDimensions, qMeasures)
        visualizationType = !REPORTING_BASE_CHARTS.includes(report?.visualizationType)
            ? report?.content?.options?.qInfo?.qType
            : report?.visualizationType || 'table'
        options = report?.content?.options || {}
    }

    return {
        name:
            backendCell?.reportId && report
                ? report?.title
                : `empty-${backendCell.x}-${backendCell.y}`,
        description:
            backendCell?.reportId && report
                ? report?.description
                : `empty-${backendCell.x}-${backendCell.y}`,
        reportId: backendCell.reportId,
        height: backendCell.height,
        width: backendCell.width,
        x: backendCell.x,
        y: backendCell.y,
        disabled: !backendCell?.reportId,
        component:
            !visualizationType && (!columns || columns?.length === 0) ? (
                <QlikPinWallEmptyCell x={backendCell.x} y={backendCell.y} />
            ) : (
                <QlikVisualizationApiWrapper>
                    <QlikVisualizationApi
                        key={!isFixed ? new Date().valueOf() : backendCell.reportId}
                        visualizationOptions={{
                            qlikAppId: currQlikAppId,
                            shouldRerender: false,
                            vizOptions: {
                                vizType: visualizationType || '',
                                columns: columns,
                                options: options
                            },
                            showAppWaterMark: isFixed && showAppWaterMark,
                            enableFullscreen: isFixed,
                            isToolbarOnPanel: true,
                            disableToolbarCss: true,
                            fullscreenOptions: {
                                title: report?.title || ''
                            },
                            exportOptions:
                                exportTypes && isFixed
                                    ? {
                                          types: exportTypes
                                      }
                                    : null,
                            classNames: {
                                toolbarIcon: classNames?.icon || '',
                                toolbarIconButton: classNames?.iconButton || '',
                                footNote: classNames?.footNote || ''
                            }
                        }}
                        panelOptions={{
                            title: report?.title
                        }}
                    />
                </QlikVisualizationApiWrapper>
            )
    }
}

interface QlikVisualizationApiWrapperProps {
    children: React.ReactNode
}

const QlikVisualizationApiWrapper: FC<QlikVisualizationApiWrapperProps> = ({ children }) => {
    return <QlikActionsProvider>{children}</QlikActionsProvider>
}

export default backendToGridLibMapperReport
