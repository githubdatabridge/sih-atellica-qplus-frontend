export type QVariableItem = {
    key: string
    value: any
}

export type QVariableClasses = {
    formControl?: string
    select?: string
    root?: string
    menuItem?: string
}

export enum QVariableEnum {
    SELECT = 'select',
    INPUT = 'input'
}

export type QVariable = {
    values?: QVariableItem[]
    variableName?: string
    defaultValue?: string
    placeHolder?: string
    includeInBookmark?: boolean
    adornment?: string
    isNum?: boolean
    css?: any
    classNames?: Partial<QVariableClasses>
    isTriggeredOnInit?: boolean
    type: QVariableEnum
}
