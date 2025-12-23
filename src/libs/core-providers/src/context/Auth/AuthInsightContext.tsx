import { useContext, createContext } from 'react'

import { User, BasicUserInfo } from '@libs/common-models'

export type AuthInsightContextType = {
    qesUser: User | null
    qesUserList: BasicUserInfo[]
    isAuthenticated: boolean
    logout: () => void
    authMe: () => void
    refreshUserList: () => void
}

export const AuthInsightContext = createContext<AuthInsightContextType>({
    isAuthenticated: false,
    qesUser: null,
    qesUserList: [],
    authMe: () => {
        throw new Error('authMe must be used within a AuthInsightContext')
    },
    refreshUserList: () => {
        throw new Error('refreshUserList must be used within a AuthInsightContext')
    },
    logout: () => {
        throw new Error('logout must be used within a AuthInsightContext')
    }
})

export const useAuthInsightContext = () => useContext(AuthInsightContext)
