import { QVariableEnum, QVariableItem } from './QVariable'

export interface QFieldSelectionInfo {
    fields: QFieldSelectedInfo[]
}

export interface QFieldSelectedInfo {
    qlikAppId?: string
    fieldName: string
    selected: string
    selectedCount: number
    totalCount: number
}

type QInfoOptions = {
    title: string
    color: string
}

type QDateOptions = {
    qlikAppId?: string
    height: string
    width: string
    css: any
    cssDefinedRange: any
    cssIconBox: any
    cssButtonText: any
    cssIconCalendar: any
    dateFormat: any
    qlikDateFormat: any
}

export type QVariableOptions = {
    qAppId?: string
    values?: QVariableItem[]
    variableName?: string
    defaultValue?: string
    placeHolder?: string
    adornment?: string
    isNum?: boolean
    css?: any
    formControlClass?: any
    selectRootClass?: any
    type: QVariableEnum
}

export type QMultiAppField = {
    qFieldName?: string
    qAppId?: string
}

export type QMultiAppFields = {
    key?: string
    qFields?: QMultiAppField[]
    isHidden?: boolean
    label?: string
    toggle?: boolean
    softLock?: boolean
    rank?: number
}

export type QFieldFilter = {
    id?: string
    qAppId: string
    qFieldName: string
    qFieldDef?: string
    qLibraryId?: string
    title?: string
    label?: string
    isDocked?: boolean
    isReadOnly?: boolean
    isFixed?: boolean
    toggle?: boolean
    softLock?: boolean
    rank?: number
    infoOptions?: QInfoOptions
    dateOptions?: QDateOptions
    variableOptions?: QVariableOptions
    tags?: string[]
    type?: string
    selection?: any
    autoSort?: boolean
    reverseSort?: boolean
    qSortCriterias?: {
        qSortByState?: number
        qSortByAscii?: number
        qSortByNumeric?: number
        qSortByFrequency?: number
        qSortByLoadOrder?: number
        qSortByExpression?: number
        qExpression?: string
        qSortByGreyness?: number
    }
}
