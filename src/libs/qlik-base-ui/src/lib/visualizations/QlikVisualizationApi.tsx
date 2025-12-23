import React, { FC } from 'react'

import { Box } from '@mui/material'

import { ConditionalWrapper } from '@libs/common-ui'
import { QVariable } from '@libs/qlik-models'
import { QlikTitleProvider, QlikActionsProvider } from '@libs/qlik-providers'

import QlikPanel, { IInfoOptions } from '../panel/QlikPanel'
import QlikVisualizationApiCore, {
    IQlikVisualizationApiCoreProps,
    IQlikVisualizationApiLinkOptions
} from './QlikVisualizationApiCore'
import QlikVisualizationProvider from './QlikVisualizationProvider'

export interface IQlikVisualizationPanelProps {
    variableOptions?: QVariable[]
    infoOptions?: IInfoOptions
    titleComponent?: React.ReactNode
    title?: string
    subtitle?: string
    highlighted?: boolean
    isVisible?: boolean
}

export interface IQlikVisualizationApiProps {
    panelOptions?: IQlikVisualizationPanelProps
    visualizationOptions: IQlikVisualizationApiCoreProps
    linkOptions?: IQlikVisualizationApiLinkOptions
}

export const QlikVisualizationApi: FC<IQlikVisualizationApiProps> = ({
    panelOptions,
    visualizationOptions,
    linkOptions
}) => {
    return (
        <QlikVisualizationProvider>
            <QlikActionsProvider>
                <QlikTitleProvider>
                    <Box height="100%">
                        <ConditionalWrapper
                            condition={!!panelOptions}
                            wrapper={children => (
                                <QlikPanel
                                    qlikAppId={visualizationOptions?.qlikAppId}
                                    {...panelOptions}>
                                    {children}
                                </QlikPanel>
                            )}>
                            <Box height="100%">
                                <QlikVisualizationApiCore
                                    {...visualizationOptions}
                                    linkOptions={linkOptions}
                                />
                            </Box>
                        </ConditionalWrapper>
                    </Box>
                </QlikTitleProvider>
            </QlikActionsProvider>
        </QlikVisualizationProvider>
    )
}
