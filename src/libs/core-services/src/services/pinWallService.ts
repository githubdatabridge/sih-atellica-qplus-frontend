import { PinWall, PinWallFiltersRaw } from '@libs/core-models'

import { CoreService } from './core'

interface CreatePayload {
    title: string
    description?: string
    content: any
    qlikState?: [
        {
            qsBookmarkId: string
            qsSelectionHash: 0
        }
    ]
}

interface UpdatePayload {
    content?: any
    title?: string
    description?: string
    qlikState?: {
        qsBookmarkId: string
        qsSelectionHash: number
    }[]
}

class PinWallService {
    async getAllPinWalls() {
        const response = await CoreService.getApi().get('/pin-walls')

        return response.map(pw => new PinWall(pw))
    }
    async getPinWall(pinWallId: number) {
        const response = await CoreService.getApi().get(`/pin-walls/${pinWallId}`)

        return new PinWall(response)
    }
    async getPinWallFilters(pinWallId: number) {
        const response = (await CoreService.getApi().get(
            `/pin-walls/${pinWallId}/filters`
        )) as PinWallFiltersRaw

        return response
    }

    async createPinWall(payload: CreatePayload) {
        const { data } = await CoreService.getApi().post('/pin-walls', payload)
        return new PinWall(data)
    }

    async deletePinWall(pinWallId: number) {
        const { data } = await CoreService.getApi().delete(`/pin-walls/${pinWallId}`)

        return { data }
    }

    async updatePinWall(pinWallId: number, payload: UpdatePayload) {
        const { data } = await CoreService.getApi().patch(`/pin-walls/${pinWallId}`, payload)

        return new PinWall(data)
    }
}

export const pinWallService = new PinWallService()
