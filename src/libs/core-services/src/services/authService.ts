import { CoreService } from './core'

export class AuthService {
    async authenticate(): Promise<string> {
        const res = await CoreService.getApi().post(
            '/auth/qlik',
            {},
            {
                headers: {
                    withCredentials: true
                }
            }
        )

        const sessionId = res.data

        return String(sessionId)
    }
}

export const authService = new AuthService()
