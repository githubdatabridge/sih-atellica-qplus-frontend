import { Action } from '@libs/common-models'

import { CoreService } from './core'

interface AddActionPayload {
    reportId: number
    //qsUserId: string
    appUserId: string
}

interface EditActionPayload {
    actionId: number
    payload: Partial<Action>
}

export class ActionService {
    async addAction({ reportId, appUserId /*qsUserId*/ }: AddActionPayload): Promise<Action> {
        const payload = {
            reportId,
            appUserId
        }

        const { data: newAction } = await CoreService.getApi().post('/actions', payload)

        return new Action(newAction)
    }

    async editAction({ actionId, payload }: EditActionPayload): Promise<boolean> {
        const { data } = await CoreService.getApi().put(`/actions/${actionId}`, payload)
        return data
    }

    async removeAction(actionId: number): Promise<any> {
        const { data } = await CoreService.getApi().delete(`/actions/${actionId}`)
        return data
    }
}

export const actionService = new ActionService()
