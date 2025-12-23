import { QMeta } from './QMeta'

type TQStringReplace = {
    oldString: string
    newString: string
}

export interface QApp {
    qAppId: string
    qIsSessionApp?: boolean
    qIsDefault?: boolean
    qDoReload?: boolean
    qScriptReplaceStrings?: TQStringReplace[]
    qHiddenFields?: string[]
    qHidePrefix?: string
    qActions?: any[]
    qMeta?: QMeta
    qAppEvents?: string[]
    onQlikReloadErrorCallback?: () => void
    onQlikAppWarningCallback?: (appId: string, type: string, event: any) => void
    onQlikAppClosedCallback?: (appId: string, type: string, event: any) => void
    onQlikAppErrorCallback?: (appId: string, type: string, event: any) => void
}
