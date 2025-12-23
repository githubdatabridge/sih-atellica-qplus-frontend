import {
    QVisualizationExportDataOptions,
    QVisualizationExportImgSettings,
    QVisualizationExportPdfSettings
} from '@libs/qlik-models'

// https://help.qlik.com/en-US/sense-developer/April2020/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/VisualizationAPI/QVisualization.htm
export default class QVisualization {
    qVisualization: any

    constructor(qVisualization: any) {
        this.qVisualization = qVisualization
    }

    async show(elem: string, options?: any): Promise<any> {
        if (elem) {
            return await this.qVisualization.show(elem, options)
        }
    }

    async close(): Promise<any> {
        return await this.qVisualization.close()
    }

    async exportData(options?: QVisualizationExportDataOptions, vp?: string): Promise<void> {
        const lnk = await this.qVisualization.exportData(options || { format: 'OOXML', state: 'P' })
        const exportLink = lnk.replace(vp, `/${vp}/`)
        window.open(exportLink)
    }

    async exportImg(settings: QVisualizationExportImgSettings, vp?: string): Promise<void> {
        const lnk = await this.qVisualization.exportImg(settings)
        const exportLink = lnk.replace(vp, `/${vp}`)
        window.open(exportLink, '_blank')
    }

    async exportPdf(settings: QVisualizationExportPdfSettings, vp?: string): Promise<void> {
        const lnk = await this.qVisualization.exportPdf(settings)
        const exportLink = lnk.replace(vp, `/${vp}`)
        window.open(exportLink, '_blank')
    }

    async resize(): Promise<void> {
        await this.qVisualization.resize()
    }

    async toggleDataView(): Promise<boolean> {
        return await this.qVisualization.toggleDataView()
    }

    async setOptions(options: any): Promise<any> {
        await this.qVisualization.setOptions(options)
    }
}
