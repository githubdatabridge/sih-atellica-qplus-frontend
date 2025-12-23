import { useContext, createContext } from 'react'

export type QlikCardContextType = {
    isCardLoading?: boolean | null
    cardFooter?: string | null
    setCardIsLoading: (isLoading: boolean) => void
    setCardFooter: (currentIndex: number, maxIndex: number) => void
}

export const QlikCardContext = createContext<QlikCardContextType>({
    setCardIsLoading: _isLoading => {
        throw new Error('setCardIsLoading() must be used within a QlikCardContext')
    },
    setCardFooter: (_currentIndex, _maxIndex) => {
        throw new Error('setCardFooter() must be used within a QlikCardContext')
    }
})

export const useQlikCardContext = () => useContext(QlikCardContext)
