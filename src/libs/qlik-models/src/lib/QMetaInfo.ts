export interface QMetaInfo {
    width: number
    height: number
    pageHeight: number
    pages: number
    title: string
    subtitle: string
    visualization: string
    footnote: string
    fetchLimit: number
}

export interface QHeaderInfo {
    dimensions: string[]
    measures: string[]
}

export interface QListDataInfo {
    qText: string
    qNum: string
    qState: string
    qElemNumber: number
}

export interface QHypercubeSize {
    qcx: number
    qcy: number
}
