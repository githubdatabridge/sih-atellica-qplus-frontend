export default class QlikUtilApi {
    static applyMixins(derivedCtor: any, baseCtors: any[]): void {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                const baseCtorName = Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
                if (!baseCtorName) {
                    return
                }
                Object.defineProperty(derivedCtor.prototype, name, baseCtorName)
            })
        })
    }
}
