import React, { FC } from 'react'

import { useBaseUiContext, useI18n } from '@libs/common-providers'
import { InfoIcon } from '@libs/common-ui'

type TQlikToolbarInfoClasses = { iconButton?: string; icon?: string }

export interface IQlikToolbarInfoProps {
    title: string
    text: string
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    classNames?: Partial<TQlikToolbarInfoClasses>
}

const QlikToolbarInfo: FC<IQlikToolbarInfoProps> = ({
    title,
    text,
    color = 'primary',
    classNames
}) => {
    const { infoNode } = useBaseUiContext()
    const { t } = useI18n()

    return (
        <InfoIcon
            title={t(title)}
            text={t(text)}
            color={color}
            icon={infoNode}
            classNames={{
                icon: classNames?.icon || '',
                iconButton: classNames?.iconButton || ''
            }}
        />
    )
}

export default QlikToolbarInfo
