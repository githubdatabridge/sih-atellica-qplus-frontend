export interface ReportPayload {
    content: any | string // json
    title: string
    description?: string
    appUserId?: string | null
    visualizationType: string
    datasetId: number
    qlikState?: {
        qsBookmarkId: string
        qsSelectionHash?: number
    }
    isPinwallable: boolean
    pageId?: string
}

export interface ReportPatchPayload {
    content?: any | string // json
    title?: string
    description?: string
    appUserId?: string | null
    visualizationType?: string
    datasetId?: number
    qlikState?: {
        qsBookmarkId: string
        qsSelectionHash?: number
    }
    isPinwallable?: boolean
}

export interface ReportExport {
    content: any
    title: string
    description: string
    visualizationType: string
    dataset: {
        title: string
        type: string
        tags?: string[]
    }
}

export interface SharedReportUsers {
    appUserId: string
    name: string
    email?: string
}

export interface ShareReportPayload {
    appUserIds: string[]
}
