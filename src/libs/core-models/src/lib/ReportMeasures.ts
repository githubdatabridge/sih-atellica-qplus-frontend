import { QMasterMeasure } from '@libs/qlik-models'

import { MetaInfo } from './MetaInfo'

export interface ReportMeasures extends QMasterMeasure {
    color?: string
    meta?: MetaInfo
}
