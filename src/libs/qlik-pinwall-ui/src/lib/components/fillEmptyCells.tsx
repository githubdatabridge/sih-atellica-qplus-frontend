import React from 'react'

import { TGridWallReportColumn } from '@libs/gridwall-ui'

import QlikPinWallEmptyCell from '../QlikPinWallEmptyCell'
import * as utils from '../utils'

const fillEmptyCells = (
    columns: TGridWallReportColumn[],
    cellCount: number
): TGridWallReportColumn[] => {
    const visualizationCells = columns.filter(c => !c?.name?.includes('empty'))

    const occupiedCells: { x: number; y: number }[] = utils.getOccupiedCells(visualizationCells)

    const emptyCells = []

    visualizationCells.forEach(cell => {
        if (
            !cell ||
            !!(cell.x && cell.x < 0) ||
            !!(cell.y && cell.y < 0) ||
            !!(cell.width && cell.width < 0) ||
            !!(cell.height && cell.height < 0) ||
            cell.name.includes('empty') ||
            !cell.reportId
        )
            return

        for (let x = cell.x; x <= cell.x + (cell.width - 1); x++) {
            for (let y = cell.y; y <= cell.y + (cell.height - 1); y++) {
                occupiedCells.push({
                    x,
                    y
                })
            }
        }
    })

    for (let x = 0; x < cellCount; x++) {
        for (let y = 0; y < cellCount; y++) {
            if (!occupiedCells.find(c => c.x === x && c.y === y)) {
                const newEmptyCell = {
                    name: `empty-${x}-${y}`,
                    height: 1,
                    width: 1,
                    x,
                    y,
                    component: <QlikPinWallEmptyCell x={x} y={y} />,
                    disabled: true
                }

                emptyCells.push(newEmptyCell)
            }
        }
    }

    return [...visualizationCells, ...emptyCells]
}

export default fillEmptyCells
