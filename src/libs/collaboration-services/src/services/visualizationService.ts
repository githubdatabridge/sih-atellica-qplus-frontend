import { Visualization } from '@libs/common-models'

import { SocialService } from './core'

interface VisualizationPayload {
    appId: string
    componentId: string
    route: string
}

export class VisualizationService {
    async getVisualization({
        appId,
        componentId,
        route
    }: VisualizationPayload): Promise<Visualization> {
        const path = `/visualizations/${appId}/${route}/${componentId}`

        const { data: visualization } = await SocialService.getApi().getFull(path)

        return new Visualization(visualization)
    }

    async createVisualization({
        appId,
        componentId,
        route
    }: VisualizationPayload): Promise<Visualization> {
        const payload = {
            appId,
            componentId,
            pageId: route
        }

        const { data: visualization } = await SocialService.getApi().post(
            '/visualizations',
            payload
        )

        return new Visualization(visualization)
    }
}

export const visualizationService = new VisualizationService()
