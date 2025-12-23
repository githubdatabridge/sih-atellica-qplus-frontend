export default class QlikMixinAppBookmarkApi {
    async _qPlusGetBookmarks(app: any): Promise<any> {
        const bookmarks = []
        const r = await app.getList('BookmarkList')
        const l = r.layout?.qBookmarkList?.qItems
        for (let i = 0; i <= l.length - 1; i++) {
            bookmarks.push({
                id: l[i].qInfo.qId,
                name: l[i].qMeta.title,
                description: l[i].qMeta.description
            })
        }
        return bookmarks
    }
}
