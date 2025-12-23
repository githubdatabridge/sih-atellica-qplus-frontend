import { AxiosResponse } from 'axios'

import { TagLabel } from '@libs/collaboration-models'

import { SocialService } from './core'

interface CreateUserLabelPayload {
    label: string
    color: string
    //qsUserId: string
    appUserId: string
}

interface UpdateLabelPayload {
    labelId: number
    payload: Partial<TagLabel>
}

export class LabelService {
    basePath = '/labels'

    async createLabel(payload: CreateUserLabelPayload): Promise<TagLabel> {
        const { data: userLabel } = await SocialService.getApi().post(this.basePath, payload)

        return new TagLabel(userLabel)
    }

    async fetchLabels(): Promise<TagLabel[]> {
        const response = await SocialService.getApi().get(this.basePath)

        return response.data.map((lbl: TagLabel) => new TagLabel(lbl))
    }

    async fetchLabel(labelId: number): Promise<TagLabel> {
        const requestUrl = `${this.basePath}/${labelId}`

        const { data: userLabel } = await SocialService.getApi().get(requestUrl)

        return new TagLabel(userLabel)
    }

    async removeLabel(labelId: number): Promise<AxiosResponse> {
        const requestUrl = `${this.basePath}/${labelId}`

        const data = await SocialService.getApi().delete(requestUrl)

        return data
    }

    async updateLabel({ labelId, payload }: UpdateLabelPayload): Promise<AxiosResponse> {
        const requestUrl = `${this.basePath}/${labelId}`

        const data = await SocialService.getApi().put(requestUrl, payload)

        return data
    }
}

export const labelService = new LabelService()
