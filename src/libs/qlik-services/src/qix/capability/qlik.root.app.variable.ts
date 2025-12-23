// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */

//PAM: Capability API Wrapper Class
export default class QlikAppVariableApi {
    qVariable: any

    constructor(qVariable) {
        this.qVariable = qVariable
    }

    async create(prop: any): Promise<any> {
        return await this.qVariable.create(prop)
    }

    async createSessionVariable(prop: any): Promise<any> {
        return await this.qVariable.createSessionVariable(prop)
    }

    async getById(id: string): Promise<any> {
        return await this.qVariable.get(id)
    }

    async getByName(name: string): Promise<any> {
        return await this.qVariable.getByName(name)
    }

    async getContent(name: string, callback: any): Promise<void> {
        const reply = await this.qVariable.getContent(name)
        callback(reply)
    }

    async setNumValue(name: string, val: number): Promise<any> {
        return await this.qVariable.setNumValue(name, val)
    }

    async setStringValue(name: string, strVal: string): Promise<any> {
        return await this.qVariable.setStringValue(name, strVal)
    }

    get(): Promise<any> {
        return this.variable
    }

    set(variable: any): void {
        this.variable = variable
    }
}

export { QlikAppVariableApi }
