import React, { FC } from 'react'

import { Box, Divider } from '@mui/material'

import { QlikBaseSocialProvider } from '@libs/collaboration-providers'
import { useQuery } from '@libs/common-hooks'
import { ConditionalWrapper } from '@libs/common-ui'
import { QVariable } from '@libs/qlik-models'
import { QlikActionsProvider, QlikTitleProvider } from '@libs/qlik-providers'

import QlikPanel, { IInfoOptions, TQlikPanelClasses } from '../panel/QlikPanel'
import { QlikSocialBar } from '../social/QlikSocialBar'
import QlikVisualizationCore, {
    IQlikPanelLinkOptions,
    IQlikVisualizationCoreProps
} from './QlikVisualizationCore'
import QlikVisualizationProvider from './QlikVisualizationProvider'

export interface IQlikPanelProps {
    variableOptions?: QVariable[]
    linkOptions?: IQlikPanelLinkOptions
    infoOptions?: IInfoOptions
    titleComponent?: React.ReactNode
    title?: string
    subtitle?: string
    showTitles?: boolean
    footnote?: string
    showAppWaterMark?: boolean
    highlighted?: boolean
    isVisible?: boolean
    classNames?: TQlikPanelClasses
}

export interface IQlikVisualizationProps {
    panelOptions?: IQlikPanelProps
    visualizationOptions: IQlikVisualizationCoreProps
    enableSocialBar?: boolean
    handleCreateVizCallback?: (viz) => void
}

const QlikVisualization: FC<IQlikVisualizationProps> = ({
    panelOptions,
    visualizationOptions,
    enableSocialBar,
    handleCreateVizCallback
}) => {
    const queryParams = useQuery()

    const visComponentIdQuery = queryParams.get('visComponentId') || ''

    const isHighlighted = visComponentIdQuery === visualizationOptions.id

    return (
        <ConditionalWrapper
            condition={enableSocialBar}
            wrapper={children => (
                <QlikBaseSocialProvider visComponentId={visualizationOptions.id}>
                    {children}
                </QlikBaseSocialProvider>
            )}>
            <QlikVisualizationProvider>
                <QlikActionsProvider>
                    <QlikTitleProvider>
                        <QlikPanel
                            qlikAppId={visualizationOptions?.qlikAppId}
                            {...panelOptions}
                            highlighted={isHighlighted}>
                            <QlikVisualizationCore
                                {...visualizationOptions}
                                handleCreateVizCallback={handleCreateVizCallback}
                            />
                            {enableSocialBar && (
                                <>
                                    <Divider variant="fullWidth" />
                                    <QlikSocialBar />
                                </>
                            )}
                        </QlikPanel>
                    </QlikTitleProvider>
                </QlikActionsProvider>
            </QlikVisualizationProvider>
        </ConditionalWrapper>
    )
}

export default React.memo(QlikVisualization)
