import React, { useContext } from 'react'

import { TGridWallReportRow } from '@libs/gridwall-ui'

export type GridWallContextType = {
    rows: TGridWallReportRow[]
    setRows: React.Dispatch<React.SetStateAction<TGridWallReportRow[]>>
    onEraseCells: () => void
    onDeleteCell: (reportId: number) => void
    onAddReportCell: (
        id: number,
        vizType: string,
        columns: any[],
        options: any,
        reportTitle: string,
        description?: string,
        qlikAppId?: string,
        index?: number,
        cellPosition?: any,
        x?: number,
        y?: number
    ) => void
    isFixed: boolean
    setIsFixed: React.Dispatch<React.SetStateAction<boolean>>
    cellPosition?: any | null
    setCellPosition: React.Dispatch<React.SetStateAction<any>>
}

/*----------  Context  ----------*/

export const GridWallContext = React.createContext<GridWallContextType>({
    rows: [[]],
    setRows: () => {
        throw new Error("setRows can't be used outside of GridWallContext")
    },
    onEraseCells: () => {
        throw new Error("onEraseCells can't be used outside of GridWallContext")
    },
    onDeleteCell: (reportId: number) => {
        throw new Error("onDeleteCell can't be used outside of GridWallContext")
    },
    onAddReportCell: (
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
        throw new Error("onAddReportCell can't be used outside of GridWallContext")
    },
    isFixed: true,
    setIsFixed: () => {
        throw new Error("setIsFixed can't be used outside of GridWallContext")
    },
    cellPosition: null,
    setCellPosition: () => {
        throw new Error("setCellPosition can't be used outside of GridWallContext")
    }
})

/*----------  Hooks  ----------*/

export const useGridWallContext = () => useContext(GridWallContext)
