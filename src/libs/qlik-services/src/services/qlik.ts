import { ApiService, KEYS, storage } from '@libs/common-utils'

class QlikService {
    private static instance: QlikService
    qApi: ApiService

    private constructor() {
        if (QlikService.instance) {
            throw new Error('Error - use QlikService.getApi()')
        }
        this.qApi = new ApiService(storage.load(KEYS.QPLUS_API_URL))
    }

    static getApi(): ApiService {
        QlikService.instance = QlikService.instance || new QlikService()
        return QlikService.instance.qApi
    }
}

export { QlikService }
