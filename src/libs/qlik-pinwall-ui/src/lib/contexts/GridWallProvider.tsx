import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react'

import { Report } from '@libs/common-models'
import { TGridWallReportRow } from '@libs/gridwall-ui'
import { QlikVisualizationApiCore } from '@libs/qlik-base-ui'
import {
    QlikActionsProvider,
    useQlikAppContext,
    useQlikLoaderContext,
    useQlikMasterItemContext
} from '@libs/qlik-providers'

import { backendToGridLibMapperReport } from '../components'
import { IQlikPinWallExportOptions } from '../QlikPinWall'
import { GridWallContext, GridWallContextType, useGridWallContext } from './grid-wall-context'
import { useQlikPinWallState } from './qlik-pin-wall-context'

type TGridWallClasses = {
    toolbarIcon?: string
    toolbarIconButton?: string
    vizFootNote?: string
}

interface Props {
    value?: GridWallContextType
    exportOptions?: IQlikPinWallExportOptions
    showAppWaterMark?: boolean
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    classNames?: Partial<TGridWallClasses>
    children: ReactNode
}

const GridWallProvider: FC<Props> = ({
    children,
    value,
    exportOptions,
    showAppWaterMark = true,
    color = 'primary',
    classNames
}) => {
    const [isFixed, setIsFixed] = useState(true)
    const [reports, setAllReports] = useState<Report[]>([])
    const { cellPosition } = useGridWallContext()
    const [cellPos, setCellPos] = useState(cellPosition)
    const { qAppMap } = useQlikAppContext()
    const { qMasterDimensionsMap, qMasterMeasuresMap } = useQlikMasterItemContext()
    const { activePinWall: pinWall, pinWallableReports } = useQlikPinWallState()
    const { isQlikMasterItemLoading } = useQlikLoaderContext()

    const [rows, setRows] = useState<TGridWallReportRow[]>([[]])

    const savedRows = useMemo(
        () =>
            pinWall?.content.cells && pinWall?.content.cells.length > 0 && !isQlikMasterItemLoading
                ? [
                      pinWall?.content.cells.map(x =>
                          backendToGridLibMapperReport(
                              x,
                              reports,
                              qAppMap,
                              qMasterDimensionsMap,
                              qMasterMeasuresMap,
                              exportOptions?.types,
                              showAppWaterMark,
                              isFixed,
                              color,
                              {
                                  icon: `${classNames?.toolbarIcon || ''}`,
                                  iconButton: `${classNames?.toolbarIconButton || ''}`,
                                  footNote: `${classNames?.vizFootNote || ''}`
                              }
                          )
                      )
                  ]
                : [[]],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pinWall, qAppMap, isQlikMasterItemLoading, reports, isFixed]
    )

    useEffect(() => {
        setAllReports(pinWallableReports)
    }, [pinWallableReports])

    useEffect(() => {
        setRows(savedRows)
    }, [savedRows])

    const onAddReportCell = async (
        id: number,
        vizType: string,
        columns: any[],
        options: any,
        reportTitle: string,
        description?: string,
        qlikAppId?: string,
        index?: number,
        x?: number,
        y?: number
    ) => {
        setRows(prev => {
            const visualizationCells: any[] = []

            const newCell = {
                name: reportTitle,
                reportId: id,
                description: description ? description : '',
                height: 1,
                width: 1,
                x:
                    cellPos?.x > -1
                        ? cellPos.x
                        : visualizationCells.length % Math.sqrt(pinWall?.content.cellCount || 16),
                y: cellPos?.y > -1 ? cellPos.y : Infinity,
                component: (
                    <QlikActionsProvider>
                        <QlikVisualizationApiCore
                            qlikAppId={qlikAppId}
                            vizOptions={{
                                vizType: vizType,
                                columns: columns,
                                options: options
                            }}
                        />
                    </QlikActionsProvider>
                )
            }
            prev[0].forEach(cell => {
                if (cell.x === x && cell.y === y) {
                    visualizationCells.push(newCell)
                } else {
                    visualizationCells.push(cell)
                }
            })
            return [[...visualizationCells]]
        })
    }

    const onDeleteCell = (reportId: number) => {
        setRows(prev => {
            return [prev[0].filter(l => l.reportId !== reportId)]
        })
    }

    const onEraseCells = () => {
        setRows([[]])
    }

    const setCellPosition = (cp: { x: number; y: number }) => {
        setCellPos(cp)
    }

    const providerValue: GridWallContextType = {
        rows,
        isFixed,
        setRows,
        onAddReportCell,
        onEraseCells,
        onDeleteCell,
        setIsFixed,
        setCellPosition,
        ...value
    }

    return <GridWallContext.Provider value={providerValue}>{children}</GridWallContext.Provider>
}

export default GridWallProvider
