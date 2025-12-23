import { QFieldFilter } from '@libs/qlik-models'

import { MetaInfo } from './MetaInfo'

export interface ReportFilters extends QFieldFilter {
    meta?: MetaInfo
}
