import React, { FC } from 'react'

import { QlikVisualizationApiCore } from '@libs/qlik-base-ui'

interface IQlikVisualizationProps {
    qlikAppId: string
    properties: any
}

export const QlikVisualization: FC<IQlikVisualizationProps> = React.memo(
    ({ qlikAppId, properties }) => {
        return (
            <QlikVisualizationApiCore
                qlikAppId={qlikAppId}
                vizOptions={{
                    columns: [],
                    vizType: JSON.parse(properties)?.qInfo?.qType || 'table',
                    options: JSON.parse(properties)
                }}
                height="315px"
            />
        )
    }
)
