import React, { FC, ReactNode } from 'react'

import Box from '@mui/material/Box'

import QlikCardInfoCore, { IQlikCardInfoCoreProps } from './QlikCardInfoCore'
import QlikCardProvider from './QlikCardProvider'

export interface IQlikCardComboProps {
    cardInfoOptions: IQlikCardInfoCoreProps
    css?: unknown
}

export const QlikCardInfo: FC<IQlikCardComboProps> = React.memo(({ cardInfoOptions }) => {
    return (
        <QlikCardProvider>
            <Box height="100%" alignItems="center" justifyContent="center">
                <QlikCardInfoCore {...cardInfoOptions} />
            </Box>
        </QlikCardProvider>
    )
})

export default QlikCardInfo
