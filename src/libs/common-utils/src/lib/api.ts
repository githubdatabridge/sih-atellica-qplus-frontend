import axios, { AxiosInstance, AxiosResponse } from 'axios'

import { errorHandler } from './errorHandler'
import { debugInterceptor, tokenInterceptor } from './interceptors'

class ApiService {
    http: AxiosInstance = axios.create({
        baseURL: undefined,
        timeout: 30000
    })

    httpService = axios

    constructor(baseURL: string | undefined) {
        this.http.defaults.baseURL = baseURL

        // Add tokenInterceptor and debugInterceptor
        this.http.interceptors.request.use(tokenInterceptor)
        this.http.interceptors.request.use(debugInterceptor)
    }

    async get(path: string, config?: any): Promise<any> {
        const options = {
            ...config
        }

        return this.http
            .get(path, options)
            .then((response: AxiosResponse) => response.data)
            .catch(errorHandler)
    }

    async getFull(path: string, config?: any): Promise<any> {
        const options = {
            ...config
        }

        return this.http.get(path, options).catch(errorHandler)
    }

    async post(path: string, payload: any, config?: any): Promise<any> {
        const options = {
            ...config
        }
        return this.http.post(path, payload, options).catch(errorHandler)
    }

    async put(path: string, payload: any, config?: any): Promise<any> {
        const options = {
            ...config
        }

        return this.http.put(path, payload, options).catch(errorHandler)
    }

    async delete(path: string, config?: any): Promise<any> {
        const options = {
            ...config
        }

        return this.http.delete(path, options).catch(errorHandler)
    }

    async patch(path: string, payload: any, config?: any): Promise<any> {
        const options = {
            ...config
        }

        return this.http.patch(path, payload, options).catch(errorHandler)
    }

    async postFile(path: string, file: any, config?: any): Promise<any> {
        const options = {
            headers: { 'Content-Type': 'multipart/form-data' },
            ...config
        }

        const formData = new FormData()
        formData.append('file', file)
        return this.http.post(path, formData, options).catch(errorHandler)
    }
}
export default ApiService
