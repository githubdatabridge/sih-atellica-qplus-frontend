export class BasicUserInfo {
    id?: string
    appUserId: string
    name: string
    email?: string
    avatar?: string

    constructor(user) {
        this.id = user?.id
        this.appUserId = user.appUserId
        this.name = user.name
        this.email = user?.email
        this.avatar = user?.name?.substring(0, 2).toUpperCase()
    }
}
