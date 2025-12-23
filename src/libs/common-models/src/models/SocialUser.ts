export class SocialUser {
    id?: string
    email?: string
    firstName?: string
    lastName?: string
    name?: string
    role?: string

    constructor(data: any) {
        this.id = data?.extId || data?.appUserId || ''
        this.firstName = data?.firstName || 'Anonymous'
        this.lastName = data?.lastName || 'User'
        this.name = data?.name
        this.email = data?.email || 'anonymous-user@databridge.ch'
        this.role = 'User'
    }

    get fullName(): string {
        return this.name ? this.name : `${this.firstName} ${this.lastName}`
    }

    get initials(): string {
        return (
            this.name?.replace(/\./g, '').substring(0, 2).toUpperCase() ||
            this.firstName?.substring(0, 2).toUpperCase() ||
            'AU'
        )
    }
}
