import React, { useState, FC, useCallback, ReactNode } from 'react'

import { useMount } from 'react-use'

import { useInterval } from '@libs/common-hooks'
import { User, BasicUserInfo } from '@libs/common-models'
import { AuthProvider, useAuthContext } from '@libs/common-providers'
import { storage, KEYS } from '@libs/common-utils'
import { userService, qlikService } from '@libs/core-services'

import { AuthInsightContext } from './AuthInsightContext'

interface IAuthInsightProps {
    sessionPollingInMilliseconds?: number
    handleOnForbiddenCallback?: (error: string, message: string, statusCode: number) => void
    handleIsLoadingCallback?: () => void
    handleOnAuthInsightErrorCallback?: (error: any) => void
    handleQlikOnSessionExpiredCallback?: () => void
    children: ReactNode
}

const AuthInsight: FC<IAuthInsightProps> = ({
    sessionPollingInMilliseconds,
    handleOnForbiddenCallback,
    handleIsLoadingCallback,
    handleOnAuthInsightErrorCallback,
    handleQlikOnSessionExpiredCallback,
    children
}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [qesUser, setQesUser] = useState<User | null>(null)
    const [qesUserList, setQesUserList] = useState<BasicUserInfo[]>([])
    const { setAppUser, setAppUserList } = useAuthContext()

    const authMe = useCallback(async () => {
        try {
            const qUser = await userService.getCurrentUser()
            setQesUser(qUser)
            setIsAuthenticated(true)
            setAppUser({
                appUserId: qUser?.user?.appUserId,
                name: qUser?.user?.name || '',
                roles: qUser?.roles || [],
                scopes: qUser?.scopes || []
            })
            if (qUser?.roles && qUser?.roles.length) {
                const isAdmin = qUser.roles.some(
                    role => role.toLowerCase() === 'admin' || role.toLowerCase() === 'systemadmin'
                )
                storage.save(KEYS.QPLUS_ROLE_IS_ADMIN, isAdmin)
            }

            return qUser
        } catch (error) {
            if (handleOnForbiddenCallback)
                handleOnForbiddenCallback(
                    error?.data?.error,
                    error?.data?.message,
                    error?.data?.statusCode
                )

            throw new Error(error)
        }
    }, [])

    const getUserList = useCallback(async () => {
        try {
            const qUserList = await userService.getAllUsers()
            setQesUserList(qUserList)
            const qAppUserList: BasicUserInfo[] = []
            for (const qUser of qUserList) {
                qAppUserList.push({
                    appUserId: qUser.id,
                    name: qUser.name,
                    email: qUser.email
                })
            }
            setAppUserList(qAppUserList)
            return qUserList
        } catch (error) {
            throw new Error(error)
        }
    }, [])

    const refreshUserList = useCallback(async () => {
        try {
            const qUserList = await getUserList()
            setQesUserList(qUserList)
            setAppUserList(qUserList)
        } catch (error) {
            console.log('Qplus Error', error)
            throw new Error(error)
        }
    }, [])

    const logout = useCallback(async (): Promise<void> => {
        try {
            const res = await userService.preflightLogout()
            if (res) {
                // Clear storage and redirect to logout URL
                const url = await userService.getLogoutUrl()
                storage.removeMany(Object.values(KEYS))
                window.location.href = url.href
            } else {
                throw new Error('Internal Error')
            }
        } catch (error) {
            throw new Error()
        }
    }, [])

    useMount(async () => {
        try {
            setIsLoading(true)
            await Promise.all([authMe(), getUserList()])
            if (handleIsLoadingCallback) {
                handleIsLoadingCallback()
            }
        } catch (error) {
            if (handleOnAuthInsightErrorCallback) handleOnAuthInsightErrorCallback(error)
            throw new Error(error)
        } finally {
            setIsLoading(false)
        }
    })

    useInterval(async () => {
        try {
            if (handleQlikOnSessionExpiredCallback && !isLoading) {
                await qlikService.isActive()
            }
        } catch (error) {
            console.log('Qplus Session GAME OVER', new Date().valueOf())
            if (handleQlikOnSessionExpiredCallback) handleQlikOnSessionExpiredCallback()
            throw new Error(error)
        }
    }, sessionPollingInMilliseconds)

    const authProviderValues = {
        authMe,
        refreshUserList,
        logout,
        isAuthenticated,
        qesUser,
        qesUserList
    }

    if (isLoading) return null

    return (
        <AuthInsightContext.Provider value={authProviderValues}>
            {isAuthenticated && children}
        </AuthInsightContext.Provider>
    )
}

const AuthInsightProvider: FC<IAuthInsightProps> = ({
    sessionPollingInMilliseconds,
    children,
    handleQlikOnSessionExpiredCallback,
    handleOnForbiddenCallback,
    handleIsLoadingCallback,
    handleOnAuthInsightErrorCallback
}) => {
    return (
        // @ts-ignore
        <AuthProvider>
            <AuthInsight
                sessionPollingInMilliseconds={sessionPollingInMilliseconds}
                handleOnForbiddenCallback={handleOnForbiddenCallback}
                handleIsLoadingCallback={handleIsLoadingCallback}
                handleQlikOnSessionExpiredCallback={handleQlikOnSessionExpiredCallback}
                handleOnAuthInsightErrorCallback={handleOnAuthInsightErrorCallback}>
                {children}
            </AuthInsight>
        </AuthProvider>
    )
}

export default AuthInsightProvider
