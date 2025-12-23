import { QFieldFilter } from './QFieldSelection'

export type QSelection = {
    qSelectionHash?: number
    qHidePrefix?: string
    qHiddenFields?: string[]
    qDockedFields?: QFieldFilter[]
    qSelectedFields?: any[]
    qSelections?: any[]
    qSelectionCount?: number
    qForwardCount?: number
    qBackwardCount?: number
    qHistory?: any[]
    qAppId?: string
}
