import { Action } from '@libs/common-models'

import { SocialService } from './core'

interface EditActionPayload {
    actionId: number
    payload: Partial<Action>
}

export class ActionService {
    async editAction({ actionId, payload }: EditActionPayload): Promise<boolean> {
        const { data } = await SocialService.getApi().put(`/actions/${actionId}`, payload)
        return data
    }
}

export const actionService = new ActionService()
