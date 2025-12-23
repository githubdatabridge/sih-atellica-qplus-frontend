import React, { FC, ReactNode } from 'react'

import { useAuthContext } from '@libs/common-providers'

export interface CanProps {
    userDomainId: string
    children: ReactNode
}

const Can: FC<CanProps> = ({ userDomainId, children }) => {
    const { appUser } = useAuthContext()

    if (userDomainId !== appUser?.appUserId) return null

    return <>{children}</>
}
export default Can
