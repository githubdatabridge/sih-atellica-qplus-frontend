export class UserPreferences {
    chatbot?: boolean
    forecast?: boolean
    socialBar?: boolean
    notifications?: boolean

    themeMain?: string // newSettings.theme.main
    language?: 'EN' | 'DE' | 'IT' | 'FR'
    additionalPreferences?: any
    customerId?: string
    userId?: string
    appUserId?: string

    constructor(preferences: any) {
        this.chatbot = preferences.chatbot
        this.forecast = preferences.forecast
        this.socialBar = preferences.socialBar
        this.notifications = preferences.notifications
        this.themeMain = preferences.themeMain
        this.language = preferences.language
        this.additionalPreferences = preferences.additionalPreferences
        this.customerId = preferences.customerId
        this.appUserId = preferences.appUserId
    }

    get appSettingsObject() {
        return {
            theme: {
                main: this.themeMain
            }
        }
    }
}

export const defaultPreferences = new UserPreferences({
    chatbot: true,
    forecast: true,
    socialBar: false,
    notifications: true,
    themeMain: '',
    language: 'EN',
    additionalPreferences: {},
    customerId: '',
    userId: '',
    appUserId: ''
})
