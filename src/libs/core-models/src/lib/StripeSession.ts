export class StripeSession {
    sessionID?: string
    sessionURL?: string
    publishableKey?: string

    constructor(session: any) {
        this.sessionID = session.sessionID
        this.sessionURL = session.sessionURL
        this.publishableKey = session.publishableKey
    }
}
