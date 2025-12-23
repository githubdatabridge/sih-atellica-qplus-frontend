export interface QMasterMeasure {
    qLibraryId: string
    type?: string
    label: string
    title?: string
    tags: string[]
    expression: string
    numFormat: any
    total?: boolean
    color?: string
    qFieldName?: string
    qAppId?: string
}
