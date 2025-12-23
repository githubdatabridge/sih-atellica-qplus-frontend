import { TGridWallReportColumn } from '@libs/gridwall-ui'

export const maxRowsChecker = (cells: TGridWallReportColumn[], maxY: number) => {
    if (getOccupiedCells(cells).find(c => c.y >= maxY)) return true

    return false
}

export const getOccupiedCells = (cells: TGridWallReportColumn[]) => {
    const occupiedCells: { x: number; y: number }[] = []

    cells.forEach(cell => {
        if (
            !cell ||
            !cell.x ||
            !cell.y ||
            !cell.width ||
            !cell.height ||
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

    return occupiedCells
}
