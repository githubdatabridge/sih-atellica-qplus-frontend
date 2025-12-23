import { BasicUserInfo } from './BasicUserInfo'

export class User extends BasicUserInfo {
    user?: AppUser
    declare email?: string
    qlikUser?: any
    roles?: string[]
    scopes?: string[]

    constructor(user: any) {
        super(user)
        this.user = user.user
        this.email = user.email
        this.qlikUser = user.qlikUser
        this.roles = user.roles
        this.scopes = user.scopes
    }
}

type AppUser = {
    appUserId: string
    name: string
}
