import React, { memo, FC } from 'react'

import { useEffectOnce } from 'react-use'

import { useQlikApp } from '@libs/qlik-providers'

export interface IQlikNativeSelectionBarProps {
    qlikAppId?: string
}

const QlikNativeSelectionBar: FC<IQlikNativeSelectionBarProps> = ({ qlikAppId }) => {
    const { qApi } = useQlikApp(qlikAppId)

    useEffectOnce(() => {
        qApi?.getObject('qvselectionbar', 'CurrentSelections', null)
    })

    return <div style={{ width: '100%' }} id="qvselectionbar" />
}

export default memo(QlikNativeSelectionBar)
