export class QlikUtil {
    static transformNumericToDate(date: number): Date {
        const actualDate = new Date(Math.round((date - 25569) * 86400000))
        // since date was created in UTC shift it to the local timezone
        actualDate.setTime(actualDate.getTime() + actualDate.getTimezoneOffset() * 60 * 1000)
        return actualDate
    }

    static transformDateToNumeric(date: Date): number {
        return Math.round(date.getTime() / 86400000 + 25569)
    }

    static download(file: string): void {
        window.open(file, '_blank')
    }

    static generateId(): string {
        return Math.random().toString(36).substr(2, 9)
    }

    static generateIdendity(): string {
        const randomDigit = () => {
            const crypto = window.crypto
            if (crypto && crypto.getRandomValues) {
                const rands = new Uint8Array(1)
                crypto.getRandomValues(rands)
                return (rands[0] % 16).toString(16)
            } else {
                return ((Math.random() * 16) | 0).toString(16)
            }
        }

        return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, randomDigit)
    }
}
