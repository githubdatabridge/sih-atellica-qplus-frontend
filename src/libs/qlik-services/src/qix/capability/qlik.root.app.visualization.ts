import QVisualization from '../../models/QlikVisualization'

/**
 * @packageDocumentation
 * @module QixServices
 */
//PAM: Capability API Wrapper Class
export default class QlikAppVisualizationApi {
    theme: any
    qVisualization: any

    constructor(visualization) {
        this.qVisualization = visualization
    }

    async get(id: string): Promise<any> {
        return new QVisualization(await this.qVisualization.get(id))
    }

    async create(type: string, cols: any[], options: any): Promise<QVisualization> {
        return new QVisualization(await this.qVisualization.create(type, cols, options))
    }

    // --------------------------------------------------------------------------------------

    getVisualization(): any {
        return this.theme
    }

    setVisualization(theme): void {
        this.theme = theme
    }
}

export { QlikAppVisualizationApi }
