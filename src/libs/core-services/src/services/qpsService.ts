import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import { storage, KEYS } from '@libs/common-utils'

function qpsInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    config.headers.set('Content-Type', 'application/json')
    config.headers.set('withCredentials', 'true')
    config.withCredentials = true // Set withCredentials separately as it's not part of headers
    return config
}

const qpsEndpoint = storage.load(KEYS.QPLUS_QLIK_ENDPOINT) || ''
const vp = storage.load(KEYS.QPLUS_VIRTUAL_PROXY) || ''
const qpsDeletePath = `${vp ? `/${vp}/` : '/'}qps/user`

// Create a dedicated Axios instance for this service
const qpsAxiosInstance: AxiosInstance = axios.create({
    baseURL: qpsEndpoint,
    timeout: 30000
})

// Apply the interceptor
qpsAxiosInstance.interceptors.request.use(qpsInterceptor)

export class QpsService {
    async logout(): Promise<boolean> {
        try {
            const res = await qpsAxiosInstance.delete(qpsDeletePath, {})
            return res.status === 204
        } catch (error) {
            // Handle error appropriately
            console.error('Error during logout:', error)
            return false
        }
    }
}

export const qpsService = new QpsService()
