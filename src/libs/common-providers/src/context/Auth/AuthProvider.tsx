import React, { useState, FC, ReactNode } from 'react'

import { User, BasicUserInfo } from '@libs/common-models'

import { AuthContext } from './AuthContext'

type AuthProviderProps = {
    children: ReactNode
}
export const AuthProvider: FC = ({ children }: AuthProviderProps) => {
    const [tenantId, setTenantId] = useState<string>(null)
    const [customerId, setCustomerId] = useState<string>(null)
    const [appUser, setAppUser] = useState<User | null>(null)
    const [appUserList, setAppUserList] = useState<BasicUserInfo[]>([])

    const authProviderValues = {
        tenantId,
        customerId,
        appUser,
        appUserList,
        setTenantId,
        setCustomerId,
        setAppUser,
        setAppUserList
    }

    return <AuthContext.Provider value={authProviderValues}>{children}</AuthContext.Provider>
}

export default AuthProvider
