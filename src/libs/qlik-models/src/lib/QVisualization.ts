export interface QVisualizationExportDataOptions {
    format: string
    state: string
}

export interface QVisualizationExportImgSettings {
    height: number | string
    width: number | string
    format?: string
}

export interface QVisualizationExportPdfSettings {
    documentSize: string | any
    orientation: string
    aspectRatio: number
    objectSize?: any
}
