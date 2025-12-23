import { QMasterDimension } from '@libs/qlik-models'

import { MetaInfo } from './MetaInfo'

export interface ReportDimensions extends QMasterDimension {
    color?: string
    meta?: MetaInfo
    qFieldName?: string
}
