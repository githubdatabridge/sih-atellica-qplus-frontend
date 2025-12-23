import React, { FC, useMemo } from 'react'

import { WidthProvider, Responsive, ReactGridLayoutProps } from 'react-grid-layout'

import { Box, IconButton, useTheme, Theme } from '@mui/material'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import { Delete, Drag } from '../../res/icons'
import './styles.css'

import translation from './constants/translations'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

export type TGridColumn = {
    name: string
    width?: 1 | 2 | 3 | undefined
    height?: 1 | 2 | 3 | undefined
    x?: number
    y?: number
    disabled?: boolean
    component: React.ReactNode
}

export type TGridRow = Array<TGridColumn>

export interface IGridProps {
    isDraggable?: boolean
    isResizable?: boolean
    rows: TGridRow[]
    cellCount: number
    onDelete?: (id: string) => void
    isFixed?: boolean
}

export type TGridWallProps = IGridProps & ReactGridLayoutProps

export const GridWall: FC<TGridWallProps> = ({
    isDraggable = false,
    isResizable = false,
    rows = [],
    cellCount,
    isFixed,
    onDelete,
    ...layoutProps
}) => {
    const { t } = useI18n()
    const theme = useTheme()
    const gridItems = useMemo(
        () =>
            rows
                .map((columns, rowIndex) =>
                    columns.map((columnData, columnIndex) => {
                        const options = columnData?.disabled
                            ? {
                                  isDraggable: !isFixed && !columnData?.disabled,
                                  isResizable: !isFixed && !columnData?.disabled
                              }
                            : {}
                        return (
                            <div
                                key={`${columnData?.name}`}
                                className="grid-cell"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: `1px solid #ECECEC`
                                }}
                                data-grid={{
                                    ...options,
                                    i: columnData?.name,
                                    x: columnData?.x,
                                    y: columnData?.y,
                                    draggableHandle: '.grid-wall-handle',
                                    w: columnData?.width || 1,
                                    h: columnData?.height || 1,
                                    minW: 1,
                                    minH: 1
                                }}>
                                {!columnData?.disabled && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            background: theme.palette.background.paper,
                                            padding: 6,
                                            borderBottomWidth: 0,
                                            zIndex: 1
                                        }}>
                                        {!isFixed && !columnData?.disabled && (
                                            <>
                                                {onDelete && (
                                                    <IconTooltip title={t(translation.vizRemove)}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                onDelete(columnData?.name)
                                                            }}>
                                                            <Delete />
                                                        </IconButton>
                                                    </IconTooltip>
                                                )}
                                                <Box mr={1} />
                                                <IconTooltip title={t(translation.vizDragAndDrop)}>
                                                    <IconButton
                                                        size="small"
                                                        className="grid-wall-handle">
                                                        <Drag />
                                                    </IconButton>
                                                </IconTooltip>
                                            </>
                                        )}
                                        {/*  <IconButton size="small">
                                            <FullscreenIcon />
                                        </IconButton> */}
                                    </div>
                                )}
                                {columnData?.component}
                            </div>
                        )
                    })
                )
                .flat(),
        [rows, isFixed]
    )

    const colCount = Math.sqrt(cellCount)
    // const rowHeight =
    //     document.getElementsByClassName('react-grid-layout')[0]?.clientHeight / colCount

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
export default GridWall
