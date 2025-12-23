import QixGlobalApi from './enigma/qix.global'
import QixDocApi from './enigma/qix.global.doc'

//PAM: Capability API Wrapper Class
export { QixDocApi }

export default class QixEnigmaApi {
    $apiGlobal: QixGlobalApi
    $apiInternalDoc: QixDocApi

    static async initEnigma(
        environment: any,
        config: any,
        onQlikEngineSessionErrorCallback?: any
    ): Promise<QixEnigmaApi> {
        const e = new QixEnigmaApi()
        e.$apiGlobal = await QixGlobalApi.create(
            environment,
            config,
            onQlikEngineSessionErrorCallback
        )
        return e
    }

    static async initInternalEnigma(): Promise<QixEnigmaApi> {
        const e = new QixEnigmaApi()
        e.$apiGlobal = await QixGlobalApi.createInternal()
        return e
    }
}

export { QixEnigmaApi }
