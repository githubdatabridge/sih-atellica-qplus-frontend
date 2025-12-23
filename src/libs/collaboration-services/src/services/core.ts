import { ApiService, KEYS, storage } from '@libs/common-utils'

class SocialService {
    static getApi(): ApiService {
        const apiUrl = storage.load(KEYS.QPLUS_API_URL)
        return new ApiService(apiUrl)
    }
}

export { SocialService }
