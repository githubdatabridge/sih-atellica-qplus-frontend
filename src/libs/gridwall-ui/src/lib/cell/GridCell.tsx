import React, { FC } from 'react'

import { Box, BoxProps } from '@mui/material'

export interface ICellProps {
    horizontal?: boolean
}

export type TGridCellProps = ICellProps & BoxProps

export const GridCell: FC<TGridCellProps> = ({ horizontal = false, children, ...props }) => {
    const direction = horizontal ? 'row' : 'column'

    return (
        <Box display="flex" flex={1} flexDirection={direction} {...props}>
            {children}
        </Box>
    )
}
