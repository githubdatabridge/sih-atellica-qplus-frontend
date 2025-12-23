import { FC } from 'react'

import QlikReportingProvider from '../contexts/QlikReportingProvider'
import QlikReportingAdminCore, { IQlikReportingAdminCoreProps } from './QlikReportingAdminCore'

const QlikReportingAdmin: FC<IQlikReportingAdminCoreProps> = ({
    height,
    onDeleteCascade,
    classNames,
    isExportVisible,
    color = 'secondary',
    LoaderComponent
}) => {
    return (
        <QlikReportingProvider>
            <QlikReportingAdminCore
                height={height}
                classNames={classNames}
                onDeleteCascade={onDeleteCascade}
                isExportVisible={isExportVisible}
                color={color}
                LoaderComponent={LoaderComponent}
            />
        </QlikReportingProvider>
    )
}

export default QlikReportingAdmin
