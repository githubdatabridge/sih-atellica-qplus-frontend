// @ts-nocheck

/**
 * @packageDocumentation
 * @module QixServices
 */

//PAM: Capability API Wrapper Class
export default class QlikThemeApi {
    qTheme: any

    constructor(theme) {
        this.qTheme = theme
    }

    async get(id: string): Promise<any> {
        return await this.qTheme.get(id)
    }

    async save(id: string): Promise<void> {
        return await this.qTheme.save(id)
    }

    async apply(id: string): Promise<any> {
        return await this.qTheme.apply(id)
    }

    async getApplied(): Promise<any> {
        return await this.qTheme.getApplied()
    }

    getTheme(): Promise<any> {
        return this.qTheme
    }

    setTheme(theme): void {
        this.qTheme = theme
    }
}

export { QlikThemeApi }
