import React, { FC } from 'react'

import { Box } from '@mui/material'

import QlikSelectionListSelected from './components/tabs/QlikSelectionListSelected'
import { TQlikSelectionTooltipOptions } from './types'

export type TQlikSelectionBarSelectedClasses = {
    tabHorizontal?: string
    tabVertical?: string
    tabScrollButton?: string
    chipPrimaryText?: string
    chipSecondaryText?: string
}

export interface IQlikSelectionBarSelectedProps {
    cssChipSelected?: any
    cssTabs?: any
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    isVertical?: boolean
    showSelectedValues?: boolean
    showAppWaterMark?: boolean
    tooltipOptions?: TQlikSelectionTooltipOptions
    classNames?: TQlikSelectionBarSelectedClasses
}

const QlikSelectionBarSelected: FC<IQlikSelectionBarSelectedProps> = ({
    cssChipSelected,
    cssTabs,
    color = 'primary',
    isVertical,
    showSelectedValues,
    showAppWaterMark = false,
    tooltipOptions,
    classNames
}) => {
    return (
        <Box display="flex" alignItems="center" width="100%">
            <Box display="flex" alignItems="center" flexGrow={1}>
                <QlikSelectionListSelected
                    isVertical={isVertical}
                    cssChipSelected={cssChipSelected}
                    cssTabs={cssTabs}
                    color={color}
                    showSelectedValues={showSelectedValues}
                    showAppWaterMark={showAppWaterMark}
                    tooltipOptions={tooltipOptions}
                    classNames={classNames}
                />
            </Box>
        </Box>
    )
}

export default React.memo(QlikSelectionBarSelected)
