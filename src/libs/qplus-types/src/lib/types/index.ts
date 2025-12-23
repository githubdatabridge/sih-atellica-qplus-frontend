import { AlertDuration, AlertType } from '@libs/common-ui'
import { ColumnTypeEnum, DataTypesEnum, OrderByDirectionEnum } from '@libs/data-grid-ui'
import {
    QSettings as QlikSettings,
    QAuthMode as QlikAuthMode,
    QMasterDimension,
    QMasterMeasure,
    QSelection as QlikSelection,
    QApp as QlikApp,
    QDoc as QlikDoc,
    QMasterVisualization,
    QFieldFilter as QlikFieldFilter,
    QApiEnum as QlikApiEnum,
    QAction as QlikAction,
    QActionEnum as QlikActionEnum,
    QDeviceTypeEnum as QlikDeviceTypeEnum,
    QVariable as QlikVariable
} from '@libs/qlik-models'

export type QplusSettings = QlikSettings
export const QplusAuthModeEnum = QlikAuthMode
export type QplusApp = QlikApp
export type QplusDoc = QlikDoc
export type QplusSelection = QlikSelection
export type QplusDimension = QMasterDimension
export type QplusMeasure = QMasterMeasure
export type QplusVisualization = QMasterVisualization
export type QplusFieldFilter = QlikFieldFilter
export type QplusVariable = QlikVariable
export const QplusApiEnum = QlikApiEnum
export const QplusAlertDurationEnum = AlertDuration
export const QplusAlertTypeEnum = AlertType
export type QplusAction = QlikAction
export const QplusActionEnum = QlikActionEnum
export const QplusDeviceTypeEnum = QlikDeviceTypeEnum
export const QplusDataGridColumnTypeEnum = ColumnTypeEnum
export const QplusDataGridTypesEnum = DataTypesEnum
export const QplusDataGridOrderByEnum = OrderByDirectionEnum
