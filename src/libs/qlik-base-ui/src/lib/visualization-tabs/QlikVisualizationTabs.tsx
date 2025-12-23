import React, { FC, memo } from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Toolbar from '@mui/material/Toolbar'

import { QlikBaseSocialProvider } from '@libs/collaboration-providers'
import { ConditionalWrapper } from '@libs/common-ui'

import { IQlikVisualizationCoreProps } from '../visualizations/QlikVisualizationCore'
import QlikVisualizationProvider from '../visualizations/QlikVisualizationProvider'
import { useQlikVisualizationTabsConfiguration } from './hooks'
import QlikVisualizationTabsProvider from './QlikVisualizationTabsProvider'
import { TTabClasses } from './types'

export interface ITabOptions {
    cssTabs?: any
    cssTab?: any
    cssTabDropdown?: any
    cssTabDropdownIcon?: any
    classNames?: TTabClasses
    width?: string
    height?: string
}

export interface ITabIndicator {
    height?: number
    position?: string
    color?: string
}

export type VisualizationType = {
    css?: any
    title?: string
    subtitle?: string
    visualizationOptions: IQlikVisualizationCoreProps
    icon?: any
    iconPosition?: 'top' | 'end' | 'bottom' | 'start'
    maxLength?: number
}

export interface IVisualizationTabsPanelProps {
    qlikAppId?: string
    tabOptions?: ITabOptions
    visualizations: VisualizationType[]
    onChanged?(value: number): any
    enableSocialBar?: boolean
    indicator?: ITabIndicator
    vertical?: boolean
    hasToggle?: boolean
    compactTabs?: boolean
    scrollButtons?: 'auto' | true | false
    tabStyling?: {
        hasBorder?: boolean
        activeColor?: string
        activeIconColor?: string
        activeBackgroundColor?: string
        inactiveColor?: string
        inactiveIconColor?: string
        inactiveBackgroundColor?: string
    }
}

const VisualizationTabsPanel: FC<IVisualizationTabsPanelProps> = ({
    qlikAppId,
    tabOptions,
    visualizations,
    onChanged,
    enableSocialBar,
    indicator = {
        height: 3,
        position: 'top',
        color: 'secondary'
    },
    scrollButtons = 'auto',
    vertical = false,
    hasToggle = false,
    compactTabs = false,
    tabStyling = {
        hasBorder: false,
        activeColor: '',
        activeIconColor: '',
        activeBackgroundColor: '',
        inactiveColor: '',
        inactiveIconColor: '',
        inactiveBackgroundColor: ''
    }
}) => {
    const {
        value,
        classes,
        isTablet,
        socialBar,
        isVertical,
        classesTab,
        handleChange,
        visualizationId,
        renderTabLabels,
        tabConfiguration,
        classesIndicator,
        toolbarComponent,
        showVisualization,
        tabsContentRender,
        cssQlikPanelPaper
    } = useQlikVisualizationTabsConfiguration({
        enableSocialBar,
        visualizations,
        compactTabs,
        tabOptions,
        tabStyling,
        scrollButtons,
        hasToggle,
        indicator,
        onChanged,
        qlikAppId,
        vertical
    })

    return (
        <ConditionalWrapper
            condition={enableSocialBar && showVisualization}
            wrapper={children => (
                <QlikBaseSocialProvider visComponentId={visualizationId}>
                    {children}
                </QlikBaseSocialProvider>
            )}>
            <Box
                className={`${classes.paper} ${tabOptions?.classNames?.tabPaper}`}
                style={cssQlikPanelPaper}>
                {isVertical ? null : (
                    <AppBar
                        elevation={0}
                        position="static"
                        color="transparent"
                        style={{ border: '0px', width: '100%' }}>
                        <Toolbar
                            variant="dense"
                            sx={{ borderBottom: tabConfiguration.toolbarBorderBottom }}
                            className={`${classes.toolbar} ${tabOptions?.classNames?.toolbar}`}
                            classes={{
                                root: `${classes.toolbarRoot} ${tabOptions?.classNames?.toolbarRoot}`
                            }}>
                            <Box
                                display="flex"
                                width="100%"
                                height="50px"
                                justifyContent="space-between">
                                {tabConfiguration.tabCompactCurrentTitle}
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    width={tabConfiguration.headingWidth}>
                                    <Tabs
                                        TabIndicatorProps={{
                                            style: { display: tabConfiguration.tabIndicatorDisplay }
                                        }}
                                        value={value}
                                        textColor="primary"
                                        variant="scrollable"
                                        scrollButtons={scrollButtons}
                                        onChange={isTablet ? null : handleChange}
                                        aria-label="scrollable auto tabs"
                                        classes={{
                                            indicator: `${classesIndicator?.indicator} ${tabOptions?.classNames?.tabIndicator}`,
                                            scrollButtons: `${classes.scrollButton}  ${tabOptions?.classNames?.tabScrollButton}`,
                                            root: `${classesTab.tabsRoot} ${tabOptions?.classNames?.tabsRoot}`,
                                            scroller: `${classesTab.tabsScroller} ${tabOptions?.classNames?.tabsScroller}`
                                        }}
                                        style={{ ...tabOptions?.cssTabs }}>
                                        {renderTabLabels}
                                    </Tabs>
                                    {toolbarComponent}
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>
                )}
                {tabsContentRender}
                {socialBar}
            </Box>
        </ConditionalWrapper>
    )
}

export const QlikVisualizationTabs: FC<IVisualizationTabsPanelProps> = props => (
    <QlikVisualizationTabsProvider>
        <QlikVisualizationProvider>
            <VisualizationTabsPanel {...props} />
        </QlikVisualizationProvider>
    </QlikVisualizationTabsProvider>
)

export default memo(QlikVisualizationTabs)
