import React, { FC } from 'react'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

import { QlikBaseSocialProvider } from '@libs/collaboration-providers'
import { ConditionalWrapper } from '@libs/common-ui'
import { QlikActionsProvider } from '@libs/qlik-providers'

import QlikSocialBar from '../../social/QlikSocialBar'
import QlikKpiAdvancedComboCore, { IQlikKpiAdvancedCoreProps } from './QlikKpiAdvancedCore'

export interface IQlikKpiAdvancedComboProps {
    kpiOptions: IQlikKpiAdvancedCoreProps
    enableSocialBar?: boolean
}

export const QlikKpiAdvancedCombo: FC<IQlikKpiAdvancedComboProps> = React.memo(
    ({ kpiOptions, enableSocialBar }) => {
        return (
            <ConditionalWrapper
                condition={enableSocialBar}
                wrapper={children => (
                    <QlikBaseSocialProvider visComponentId={kpiOptions.id}>
                        {children}
                    </QlikBaseSocialProvider>
                )}>
                <QlikActionsProvider>
                    <Box height="100%" alignItems="center" justifyContent="center">
                        <QlikKpiAdvancedComboCore {...kpiOptions} />
                    </Box>
                    {enableSocialBar && (
                        <>
                            <Divider variant="fullWidth" />
                            <QlikSocialBar />
                        </>
                    )}
                </QlikActionsProvider>
            </ConditionalWrapper>
        )
    }
)
