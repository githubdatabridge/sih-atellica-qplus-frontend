export type EmailTemplate = {
    emailContentID?: string
    emailType?: number
    emailContentTitle?: string
    languageID?: string
    languageTitle?: string
    subject?: string
    body?: string
    footer?: string
    bannerUrl?: string
}

export class EmailTemplates {
    value?: EmailTemplate[]

    constructor(emailTemplates: any) {
        this.value = emailTemplates.value
    }
}
