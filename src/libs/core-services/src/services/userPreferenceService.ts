import { UserPreferences, defaultPreferences } from '@libs/core-models'

import { CoreService } from './core'

class UserPreferenceService {
    async getPreferences(): Promise<UserPreferences> {
        try {
            const data = await CoreService.getApi().get('/app-user-preferences')
            return new UserPreferences(data)
        } catch {
            return defaultPreferences
        }
    }

    async updatePreferences(payload: Partial<UserPreferences>): Promise<UserPreferences> {
        const { data } = await CoreService.getApi().put('/app-user-preferences', payload)

        return new UserPreferences(data)
    }
}

export const userPreferenceService = new UserPreferenceService()
