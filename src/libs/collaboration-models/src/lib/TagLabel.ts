export class TagLabel {
    id: string
    /*   qsUserId: string */
    appUserId: string
    name: string
    handle: string
    color?: string
    createdAt: string
    updatedAt: string
    deletedAt: string

    constructor(noteLabel: any = {}) {
        this.id = noteLabel.id
        /*   this.qsUserId = noteLabel.qsUserId */
        this.appUserId = noteLabel.appUserId
        this.name = noteLabel.name
        this.handle = noteLabel.handle
        this.color = noteLabel.color
        this.createdAt = noteLabel.createdAt || new Date()
        this.updatedAt = noteLabel.updatedAt || new Date()
        this.deletedAt = noteLabel.deletedAt || new Date()
    }
}

export class LabelModel {
    appUserId: string
    //qsUserId: string
    name: string
    readonly handle: string
    color: string

    constructor(noteLabel: any = {}) {
        this.appUserId = noteLabel.appUserId
        this.name = noteLabel.name
        this.color = noteLabel.color || 'white'
        this.handle = noteLabel.name
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/\W+/g, '') // Remove all non-word chars
            .replace(/--+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
    }
}
