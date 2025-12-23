//PAM: Capability API Wrapper Class
export default class QlikAppBookmarkApi {
    qBookmark: any

    constructor(bookmark) {
        this.qBookmark = bookmark
    }

    async apply(id: string): Promise<any> {
        return await this.qBookmark.apply(id)
    }

    async create(title: string, description: string): Promise<any> {
        return await this.qBookmark.create(title, description)
    }

    async remove(id: string): Promise<any> {
        return await this.qBookmark.remove(id)
    }

    get(): any {
        return this.qBookmark
    }

    set(qBookmark): void {
        this.qBookmark = qBookmark
    }
}

export { QlikAppBookmarkApi }
