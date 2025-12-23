import { FC } from 'react'

import { QlikActionsProvider } from '@libs/qlik-providers'

import QlikReportingCore, { IQlikReportingCoreProps } from './QlikReportingCore'

const QlikReporting: FC<IQlikReportingCoreProps> = ({
    qlikAppId,
    height = 700,
    children,
    defaultAppFilters = [],
    LoaderComponent,
    views,
    isToolbarWithDivider,
    showSignature,
    showWizardImage,
    showPinWallList,
    color,
    classNames,
    exportOptions
}) => {
    return (
        <QlikActionsProvider>
            <QlikReportingCore
                qlikAppId={qlikAppId}
                height={height}
                defaultAppFilters={defaultAppFilters}
                LoaderComponent={LoaderComponent}
                views={views}
                isToolbarWithDivider={isToolbarWithDivider}
                showSignature={showSignature}
                showWizardImage={showWizardImage}
                showPinWallList={showPinWallList}
                color={color}
                classNames={classNames}
                exportOptions={exportOptions}>
                {children}
            </QlikReportingCore>
        </QlikActionsProvider>
    )
}

export default QlikReporting
