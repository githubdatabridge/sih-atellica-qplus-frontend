import { InternalAxiosRequestConfig } from 'axios'

import { KEYS, storage } from './storage'

// Debug interceptor function
export const debugInterceptor = (
    config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    if (storage.load(KEYS.QPLUS_IS_DEBUG)) {
        console.log(
            `🛸 API Debugger\n`,
            `URL: ${config.url}\n`,
            `Data: ${JSON.stringify(config.data)}\n`,
            `Params: ${JSON.stringify(config.params)}\n`
        )
    }
    return config
}

// Token interceptor function
export const tokenInterceptor = (
    config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    const tenantId = storage.load(KEYS.QPLUS_TENANT_ID) || ''
    const customerId = storage.load(KEYS.QPLUS_CUSTOMER_ID) || ''
    const mashupAppId = storage.load(KEYS.QPLUS_MASHUP_APP_ID) || ''
    const virtualProxy = storage.load(KEYS.QPLUS_VIRTUAL_PROXY) || ''
    const isAdmin = storage.load(KEYS.QPLUS_ROLE_IS_ADMIN)
    const qSaaSToken = storage.load(KEYS.QPLUS_SAAS_TOKEN) || ''

    config.headers['Content-Type'] = 'application/json'
    config.headers['x-tenant-id'] = tenantId
    config.headers['x-customer-id'] = customerId
    config.headers['x-app-name'] = mashupAppId

    if (qSaaSToken) {
        config.headers['Authorization'] = `Bearer ${qSaaSToken}`
    }

    if (virtualProxy) {
        config.headers['x-vp'] = virtualProxy
    }

    if (typeof isAdmin === 'boolean') {
        config.headers['x-app-admin'] = isAdmin.toString()
    } else {
        config.headers['x-app-admin'] = 'false'
    }

    config.withCredentials = true
    return config
}
