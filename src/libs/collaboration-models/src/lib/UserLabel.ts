export class UserLabel {
    id: number
    label: string
    color: string
    //qsUserId: string
    appUserId: string

    constructor(userLabel: any) {
        this.id = userLabel.id
        this.label = userLabel.label
        this.color = userLabel.color
        //this.qsUserId = userLabel.qsUserId
        this.appUserId = userLabel.appUserId
    }
}
