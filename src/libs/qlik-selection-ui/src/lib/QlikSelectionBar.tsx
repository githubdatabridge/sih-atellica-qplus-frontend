import React, { FC, useEffect } from 'react'

import { Box } from '@mui/material'

import { useQlikSelectionContext } from '@libs/qlik-providers'

import QlikSelectionList from './components/tabs/QlikSelectionList'
import { TQlikSelectionTooltipOptions } from './types'

export interface ICalculatedSelections {
    id?: string
    titleExpression: string
    kpiExpression: string
    calcExpression?: string
}

export type TQlikSelectionBarClasses = {
    tabHorizontal?: string
    tabVertical?: string
    tabScrollButton?: string
    chipPrimaryText?: string
    chipSecondaryText?: string
}

export interface IQlikSelectionBarProps {
    callbackSelectionHandler?: (count: number) => void
    cssChipReadOnly?: any
    cssChipSelected?: any
    cssChipCalculated?: any
    cssChipDocked?: any
    cssChipGlobal?: any
    cssChipFixed?: any
    cssTabs?: any
    classNames?: TQlikSelectionBarClasses
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    isVertical?: boolean
    showSelectedValues?: boolean
    showAppWaterMark?: boolean
    tooltipOptions?: TQlikSelectionTooltipOptions
}

const QlikSelectionBar: FC<IQlikSelectionBarProps> = ({
    cssChipReadOnly,
    cssChipSelected,
    cssChipCalculated,
    cssChipDocked,
    cssChipFixed,
    cssChipGlobal,
    cssTabs,
    classNames,
    color = 'primary',
    isVertical,
    showSelectedValues = true,
    showAppWaterMark = false,
    tooltipOptions,
    callbackSelectionHandler
}) => {
    const { qGlobalSelectionCount } = useQlikSelectionContext()

    useEffect(() => {
        if (callbackSelectionHandler) {
            callbackSelectionHandler(qGlobalSelectionCount)
        }
    }, [callbackSelectionHandler, qGlobalSelectionCount])

    return (
        <Box display="flex" alignItems="center" width="100%">
            <Box display="flex" alignItems="center" flexGrow={1}>
                <QlikSelectionList
                    cssChipReadOnly={cssChipReadOnly}
                    cssChipSelected={cssChipSelected}
                    cssChipCalculated={cssChipCalculated}
                    cssChipDocked={cssChipDocked}
                    cssChipFixed={cssChipFixed}
                    cssChipGlobal={cssChipGlobal}
                    cssTabs={cssTabs}
                    color={color}
                    isVertical={isVertical}
                    showSelectedValues={showSelectedValues}
                    showAppWaterMark={showAppWaterMark}
                    tooltipOptions={tooltipOptions}
                    classNames={classNames}
                />
            </Box>
        </Box>
    )
}

export default React.memo(QlikSelectionBar)
