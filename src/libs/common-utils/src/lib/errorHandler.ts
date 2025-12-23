/**
 * @packageDocumentation
 * @module API Wrapper
 */

import axios from 'axios'

export const errorHandler = async (error: any) => {
    try {
        const status = error.response?.status

        if (axios.isCancel(error)) {
            return Promise.reject()
        }

        if (status === 404) {
            return Promise.reject({
                status: 404,
                message: 'Not found'
            })
        }

        if (status === 500) {
            return Promise.reject({
                status: 500,
                message: 'Unable to complete request'
            })
        }

        return Promise.reject(error?.response)
    } catch {
        return Promise.reject('Unable to complete request')
    }
}
