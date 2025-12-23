import QlikMixinAppApi from './qlik.mixins.app'

export default class QlikMixinsApi {
    $apiMixinApp: QlikMixinAppApi

    constructor() {
        this.$apiMixinApp = new QlikMixinAppApi()
    }
}
