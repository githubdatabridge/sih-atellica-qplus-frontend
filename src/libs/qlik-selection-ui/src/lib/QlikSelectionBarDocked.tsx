import React, { FC } from 'react'

import { Box } from '@mui/material'

import QlikSelectionListDocked from './components/tabs/QlikSelectionListDocked'
import { TQlikSelectionTooltipOptions } from './types'

export type TQlikSelectionBarDockedClasses = {
    tabHorizontal?: string
    tabVertical?: string
    tabScrollButton?: string
    chipPrimaryText?: string
    chipSecondaryText?: string
}

export interface IQlikSelectionBarDockedProps {
    cssChipDocked?: any
    cssChipFixed?: any
    cssTabs?: any
    classNames?: TQlikSelectionBarDockedClasses
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    isVertical?: boolean
    showSelectedValues?: boolean
    showAppWaterMark?: boolean
    tooltipOptions?: TQlikSelectionTooltipOptions
}

const QlikSelectionBarDocked: FC<IQlikSelectionBarDockedProps> = ({
    cssChipDocked,
    cssChipFixed,
    cssTabs,
    classNames,
    color = 'primary',
    isVertical,
    showSelectedValues = true,
    showAppWaterMark = false,
    tooltipOptions
}) => {
    return (
        <Box display="flex" alignItems="center" width="100%">
            <Box display="flex" alignItems="center" flexGrow={1}>
                <QlikSelectionListDocked
                    isVertical={isVertical}
                    cssChipDocked={cssChipDocked}
                    cssChipFixed={cssChipFixed}
                    cssTabs={cssTabs}
                    classNames={classNames}
                    color={color}
                    showSelectedValues={showSelectedValues}
                    showAppWaterMark={showAppWaterMark}
                    tooltipOptions={tooltipOptions}
                />
            </Box>
        </Box>
    )
}

export default React.memo(QlikSelectionBarDocked)
