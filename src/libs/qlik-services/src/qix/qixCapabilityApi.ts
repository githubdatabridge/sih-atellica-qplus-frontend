/**
 * @packageDocumentation
 * @module QixServices
 */

import QlikMixinsApi from './capability/qlik.mixins'
import QlikMixinsAppApi from './capability/qlik.mixins.app'
import QlikMixinAppBookmarkApi from './capability/qlik.mixins.app.bookmark'
import QlikMixinAppFieldApi from './capability/qlik.mixins.app.field'
import QlikMixinAppObjectApi from './capability/qlik.mixins.app.object'
import QlikMixinAppSelectionApi from './capability/qlik.mixins.app.selection'
import QlikMixinAppVisualizationApi from './capability/qlik.mixins.app.visualization'
import QlikRootApi, { QlikAppApi } from './capability/qlik.root'
import QlikUtilApi from './capability/qlik.utils'

export { QlikAppApi }
//PAM: Capability API Wrapper Class

export default class QixCapabilityApi {
    $apiRoot: QlikRootApi
    $apiMixin: QlikMixinsApi

    static async initialize(environment: any, qlik: any, config: any): Promise<QixCapabilityApi> {
        const c = new QixCapabilityApi()
        c.$apiRoot = await QlikRootApi.initialize(environment, qlik, config)
        c.$apiMixin = new QlikMixinsApi()
        QlikUtilApi.applyMixins(QlikMixinsApi, [
            QlikMixinsAppApi,
            QlikMixinAppFieldApi,
            QlikMixinAppObjectApi,
            QlikMixinAppSelectionApi,
            QlikMixinAppBookmarkApi,
            QlikMixinAppVisualizationApi
        ])
        return c
    }
}

export { QixCapabilityApi }
