export class Visualization {
    id: number
    /** Application ID coming from the enigma service */
    appId: string
    /** Current page route for example `/dashboard` */
    pageId: string
    /** A persistent string */
    componentId: string

    constructor(visualization: any) {
        this.id = visualization.id
        this.appId = visualization.appId
        this.pageId = visualization.pageId
        this.componentId = visualization.componentId
    }
}
