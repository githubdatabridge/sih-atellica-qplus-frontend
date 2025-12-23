import { Base64 } from 'js-base64'

export enum KEYS {
    QPLUS_API_URL = '__QPLUS_API_URL__',
    QPLUS_QLIK_ENDPOINT = '__QPLUS_QLIK_ENDPOINT__',
    QPLUS_GATEWAY = '__QPLUS_GATEWAY__',
    QPLUS_VIRTUAL_PROXY = '__QPLUS_VIRTUAL_PROXY__',
    QPLUS_TENANT_ID = '__QPLUS_TENANT_ID__',
    QPLUS_CUSTOMER_ID = '__QPLUS_CUSTOMER_ID__',
    QPLUS_MASHUP_APP_ID = '__QPLUS_MASHUP_APP_ID__',
    QPLUS_ROLE_IS_ADMIN = '__QPLUS_ROLE_IS_ADMIN__',
    QPLUS_SAAS_TOKEN = '__QPLUS_SAAS_TOKEN__',
    QPLUS_IS_DEBUG = '__QPLUS_SAAS_TOKEN__'
}

class Storage {
    save(key: KEYS, value: unknown): void {
        try {
            const encodedData = Base64.encode(JSON.stringify(value))
            localStorage.setItem(key, encodedData)
        } catch (error) {
            // Error saving data
            console.error('storage', error)
            localStorage.removeItem(key)
        }
    }

    load(key: KEYS): any {
        try {
            const data = window.localStorage.getItem(key)
            if (!data) {
                return null
            }

            // We have data!!
            const baseData = Base64.decode(data)
            return JSON.parse(baseData)
        } catch (error) {
            console.error('storage', error)
            localStorage.removeItem(key)
        }
    }

    remove(key: KEYS): void {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error('storage', error)
        }
    }

    removeMany(keys: KEYS[]): void {
        try {
            keys.forEach(key => localStorage.removeItem(key))
        } catch (error) {
            console.error('storage', error)
        }
    }

    clear(): void {
        localStorage.clear()
    }
}

export const storage = new Storage()
