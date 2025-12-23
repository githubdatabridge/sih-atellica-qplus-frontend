import React, { FC, ReactNode } from 'react'

import { Tabs } from '@mui/material'

export interface IQlikVisualizationTabsVerticalProps {
    value: number
    isVisible: boolean
    scrollButtons?: 'auto' | true | false
    classScrollButtons?: string
    classIndicator?: string
    classScroller?: string
    children: ReactNode
    onChange: (event: React.ChangeEvent<HTMLButtonElement>, value: number) => void
}

const QlikVisualizationTabsVertical: FC<IQlikVisualizationTabsVerticalProps> = ({
    value,
    onChange,
    isVisible,
    scrollButtons = 'auto',
    classIndicator,
    classScrollButtons,
    classScroller,
    children
}) => (
    <Tabs
        style={{
            display: isVisible ? '' : 'none',
            position: 'relative',
            minHeight: '100px'
        }}
        classes={{
            indicator: classIndicator,
            scrollButtons: classScrollButtons,
            scroller: classScroller
        }}
        orientation="vertical"
        value={value}
        textColor="primary"
        variant="scrollable"
        scrollButtons={scrollButtons}
        onChange={onChange}
        aria-label="scrollable auto tabs">
        {children}
    </Tabs>
)

export default QlikVisualizationTabsVertical
