class UtilService {
    dateFromQlikNumber(n: number): Date {
        // return: Date from Qlik number
        const d = new Date(Math.round((n - 25569) * 86400 * 1000))
        // since date was created in UTC shift it to the local timezone
        d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000)
        return d
    }

    kFormatter(num: number): number {
        try {
            const fix: any = (Math.abs(num) / 1000).toFixed(1)
            return Math.abs(num) > 999 ? Math.sign(num) * fix : Math.sign(num) * Math.abs(num)
        } catch (e) {
            return 0
        }
    }

    formatNumber(n: number, decimal = 0): string | number {
        try {
            if (n < 1e3) return n ? n.toFixed(decimal) : n
            if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(decimal) + 'K'
            if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(decimal) + 'M'
            if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(decimal) + 'B'
            if (n >= 1e12) return +(n / 1e12).toFixed(decimal) + 'T'
            return ''
        } catch (e) {
            return ''
        }
    }

    flatten(items: any[]): any[] {
        const flat: any = []

        items.forEach(item => {
            if (Array.isArray(item)) {
                flat.push(...this.flatten(item))
            } else {
                flat.push(item)
            }
        })

        return flat
    }

    generateIdendity(): string {
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

        return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, randomDigit);
    }
}

export const utilService = new UtilService()
