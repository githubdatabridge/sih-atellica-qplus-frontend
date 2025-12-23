import React, { FC } from 'react'

import QlikVisualizationPopperList from '../components/popper/QlikVisualizationPopperList'
import { useQlikVisualizationContext } from '../QlikVisualizationContext'
import { IQlikVisualizationCoreTypeOptions } from '../QlikVisualizationCore'

const QlikToolbarVizTypes: FC<IQlikVisualizationCoreTypeOptions> = ({
    types,
    css,
    showSettings
}) => {
    const { onVisualizationTypeChange, setVisualizationType } = useQlikVisualizationContext()

    const handleVisualizationChange = async (type: string) => {
        setVisualizationType(type)
        onVisualizationTypeChange(type)
    }

    return types && types?.length > 0 ? (
        <QlikVisualizationPopperList
            types={types}
            handleVisualizationClickCallback={handleVisualizationChange}
            showSettings={showSettings}
            css={css}
        />
    ) : null
}

export default QlikToolbarVizTypes
