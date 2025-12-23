import { User, BasicUserInfo } from '@libs/common-models'
import { storage, KEYS } from '@libs/common-utils'

import { CoreService } from './core'

class UserService {
    async getCurrentUser() {
        const user = (await CoreService.getApi().get('/auth/me')) as User
        return user
    }

    async getAllUsers() {
        const response: BasicUserInfo[] = await CoreService.getApi().get('/users')
        const users = response.map(user => new BasicUserInfo(user))
        return users
    }

    async preflightLogout(): Promise<boolean> {
        const res = await CoreService.getApi().getFull('/qlik/saas/jwt/logout/preflight')
        return res.status === 204
    }

    getLogoutUrl() {
        const endpoint = storage.load(KEYS.QPLUS_API_URL)
        return new URL(`${endpoint}/qlik/saas/jwt/logout`)
    }
}

export const userService = new UserService()
