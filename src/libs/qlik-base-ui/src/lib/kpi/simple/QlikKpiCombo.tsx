import React, { FC, ReactNode } from 'react'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

import { QlikBaseSocialProvider } from '@libs/collaboration-providers'
import { useQuery } from '@libs/common-hooks'
import {
    ConditionalWrapper,
    ErrorBoundary,
    ErrorPlaceholder,
    IBoxPanelProps
} from '@libs/common-ui'
import { QlikActionsProvider } from '@libs/qlik-providers'

import QlikPanel from '../../panel/QlikPanel'
import QlikSocialBar from '../../social/QlikSocialBar'
import QlikKpiComboCore, { IQlikKpiComboCoreProps } from './QlikKpiComboCore'

export interface IQlikKpiComboProps {
    panelOptions?: IBoxPanelProps
    kpiOptions: IQlikKpiComboCoreProps
    icon?: ReactNode
    enableSocialBar?: boolean
    visualizationComponent?: ReactNode
    children?: ReactNode
}

export const QlikKpiCombo: FC<IQlikKpiComboProps> = React.memo(
    ({ panelOptions, kpiOptions, icon, enableSocialBar, visualizationComponent, children }) => {
        const queryParams = useQuery()

        const visComponentIdQuery = queryParams.get('visComponentId') || ''

        const isHighlighted = visComponentIdQuery === kpiOptions.id

        return (
            <ErrorBoundary fallback={<ErrorPlaceholder text="QlikKpi error!" />}>
                <ConditionalWrapper
                    condition={enableSocialBar}
                    wrapper={children => (
                        <QlikBaseSocialProvider visComponentId={kpiOptions.id}>
                            {children}
                        </QlikBaseSocialProvider>
                    )}>
                    <QlikActionsProvider>
                        <QlikPanel {...panelOptions} highlighted={isHighlighted}>
                            <Box>
                                <QlikKpiComboCore
                                    icon={icon}
                                    {...kpiOptions}
                                    visualizationComponent={visualizationComponent}>
                                    {children}
                                </QlikKpiComboCore>
                            </Box>
                            {enableSocialBar && (
                                <>
                                    <Divider variant="fullWidth" />
                                    <QlikSocialBar />
                                </>
                            )}
                        </QlikPanel>
                    </QlikActionsProvider>
                </ConditionalWrapper>
            </ErrorBoundary>
        )
    }
)
