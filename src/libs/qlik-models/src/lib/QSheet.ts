export type TQSheetObject = {
    id: string
    type: string
}

export interface QSheet {
    qlikAppId?: string
    id: string
    title: string
    description: string
    approved: boolean
    published: boolean
    type: string
    labelExpression: string
    showCondition: string
    cells: TQSheetObject[]
}
