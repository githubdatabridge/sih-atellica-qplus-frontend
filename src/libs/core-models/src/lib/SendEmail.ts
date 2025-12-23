type SendEmailParam = {
    key: string
    value: string
}

export interface SendEmail {
    to: string
    emailContentID: string
    parameters: SendEmailParam[]
}
