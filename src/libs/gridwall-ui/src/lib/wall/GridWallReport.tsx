import React, { FC, useMemo } from 'react'

import { ReactGridLayoutProps, Responsive, WidthProvider } from 'react-grid-layout'

import { Box, IconButton, useTheme, Theme } from '@mui/material'
import { darken, lighten } from '@mui/material/styles'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import { Delete, Drag } from '../../res/icons'
import './styles.css'
import translation from './constants/translations'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

export type TGridWallReportColumn = {
    name: string
    description?: string
    width?: 1 | 2 | 3 | undefined
    height?: 1 | 2 | 3 | undefined
    x?: number
    y?: number
    disabled?: boolean
    component: React.ReactNode
    reportId?: number
}

export type TGridWallReportRow = Array<TGridWallReportColumn>

type TGridWallClasses = {
    cell?: string
}
interface IGridWallReportProps {
    isDraggable?: boolean
    isResizable?: boolean
    rows: TGridWallReportRow[]
    cellCount: number
    classNames?: TGridWallClasses
    onDelete?: (id: string, reportId?: number) => void
    isFixed?: boolean
}

export type TGridWallReportGridProps = IGridWallReportProps & ReactGridLayoutProps

export const GridWallReport: FC<TGridWallReportGridProps> = ({
    isDraggable = false,
    isResizable = false,
    rows = [],
    cellCount,
    isFixed,
    classNames,
    onDelete,
    ...layoutProps
}) => {
    const { t } = useI18n()
    const theme = useTheme<Theme>()

    const gridItems = useMemo(
        () =>
            rows
                .map(columns =>
                    columns.map(columnData => {
                        const options = columnData.disabled
                            ? {
                                  isDraggable: !isFixed && !columnData.disabled,
                                  isResizable: !isFixed && !columnData.disabled
                              }
                            : {}
                        return (
                            <div
                                key={`${columnData.name}-${columnData.reportId || 0}`}
                                className={`grid-cell ${classNames.cell}`}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: isFixed
                                        ? 'transparent'
                                        : theme.palette.background.paper,
                                    border: !isFixed
                                        ? `1px dashed ${lighten(theme.palette.text.primary, 0.2)}`
                                        : undefined
                                }}
                                data-grid={{
                                    ...options,
                                    i: `${columnData.name}-${columnData.reportId || 0}`,
                                    x: columnData.x,
                                    y: columnData.y,
                                    draggableHandle: '.grid-wall-handle',
                                    w: columnData.width || 1,
                                    h: columnData.height || 1,
                                    minW: 1,
                                    minH: 1,
                                    reportId: columnData.reportId
                                }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        padding: '0px',
                                        marginBottom: '1px',
                                        background: theme.palette.background.default,
                                        border: !isFixed
                                            ? `1px solid ${darken(theme.palette.divider, 0)}`
                                            : '0px'
                                    }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            flexDirection: 'row',
                                            paddingLeft: '8px'
                                        }}>
                                        {!isFixed && !columnData.disabled && (
                                            <IconTooltip title={t(translation.vizDragAndDrop)}>
                                                <IconButton
                                                    size="small"
                                                    className="grid-wall-handle">
                                                    <Drag width={24} height={24} />
                                                </IconButton>
                                            </IconTooltip>
                                        )}
                                    </div>
                                    {!isFixed && !columnData.disabled && (
                                        <div
                                            style={{
                                                paddingRight: '8px'
                                            }}>
                                            {onDelete && (
                                                <IconTooltip title={t(translation.vizRemove)}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            onDelete(
                                                                columnData.name,
                                                                columnData.reportId
                                                            )
                                                        }}>
                                                        <Delete width={24} height={24} />
                                                    </IconButton>
                                                </IconTooltip>
                                            )}
                                            <Box mr={1} />
                                        </div>
                                    )}
                                </div>
                                {columnData.component}
                            </div>
                        )
                    })
                )
                .flat(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rows, isFixed]
    )

    const colCount = Math.sqrt(cellCount)

    return (
        <ResponsiveReactGridLayout
            id="pinwall"
            className="layout"
            // rowHeight={Number(rowHeight) || 100}
            maxRows={colCount}
            draggableHandle=".grid-wall-handle"
            isDraggable={isDraggable && !isFixed}
            isResizable={isResizable && !isFixed}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            // @ts-ignore
            cols={{ lg: colCount, md: colCount, sm: colCount, xs: colCount, xxs: colCount }}
            {...layoutProps}>
            {gridItems.length === 0 ? (
                <div
                    key="empty-cell"
                    className="grid-cell"
                    style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    data-grid={{
                        i: 'empty-cell',
                        x: 0,
                        y: 0,
                        w: 1,
                        h: 1,
                        minW: 1,
                        minH: 1
                    }}
                />
            ) : (
                gridItems
            )}
        </ResponsiveReactGridLayout>
    )
}

export default GridWallReport
