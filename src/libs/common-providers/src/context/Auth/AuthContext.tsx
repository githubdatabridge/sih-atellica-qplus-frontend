import { useContext, createContext, ReactNode } from "react";

import { User, BasicUserInfo } from '@libs/common-models'

export type AuthContextType = {
    appUser: User | null
    appUserList: BasicUserInfo[]
    tenantId?: string
    customerId?: string
    setAppUser: (u: User) => void
    setAppUserList: (appUserList: BasicUserInfo[]) => void
    setTenantId: (tenantId: string) => void
    setCustomerId: (customerId: string) => void
}

export const AuthContext = createContext<AuthContextType>({
    appUser: null,
    appUserList: null,
    setAppUser: (_user: User) => {
        throw new Error('setUser must be used within a AuthContext')
    },
    setAppUserList: (_userList: BasicUserInfo[]) => {
        throw new Error('setAppUserList must be used within a AuthContext')
    },
    setTenantId: (_tenantId: string) => {
        throw new Error('setTenantId must be used within a AuthContext')
    },
    setCustomerId: (_customerId: string) => {
        throw new Error('setCustomerId must be used within a AuthContext')
    }
})

export const useAuthContext = () => useContext(AuthContext)
