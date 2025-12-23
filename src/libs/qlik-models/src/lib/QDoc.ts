import { QMeta } from './QMeta'

export interface QDoc {
    qDocId: string
    qIsDefault?: boolean
    qActions?: any[]
    qMeta?: QMeta
    dDoc?: any
    qHiddenFields?: string[]
    qHidePrefix?: string
    onQlikEngineSessionErrorCallback?: (
        qDocId: string,
        sessionReference: any,
        request: any,
        code: number,
        parameter: string,
        message: string
    ) => void
}
