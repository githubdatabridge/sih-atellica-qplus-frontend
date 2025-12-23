import React, { ReactNode, useCallback, useState } from 'react'

import { QlikCardContext, QlikCardContextType } from './QlikCardContext'

interface IQlikCardProviderProps {
    value?: QlikCardContextType
    children: ReactNode
}

const QlikCardProvider: React.FC<IQlikCardProviderProps> = ({ value = {}, children }) => {
    const [cardFooter, setFooter] = useState<string>(null)
    const [isCardLoading, setIsLoading] = useState<boolean>(null)

    const setCardIsLoading = useCallback((isLoading: boolean) => {
        setIsLoading(isLoading)
    }, [])

    const setCardFooter = useCallback((currentIndex: number, maxIndex: number) => {
        setFooter(`${currentIndex} of ${maxIndex}`)
    }, [])

    return (
        <QlikCardContext.Provider
            value={{
                cardFooter,
                isCardLoading,
                setCardFooter,
                setCardIsLoading,
                ...value
            }}>
            {children}
        </QlikCardContext.Provider>
    )
}

export default QlikCardProvider
