import { useContext, createContext, Dispatch, SetStateAction } from 'react'

export type QlikEventPreventionContextType = {
    isPreventingEvents: boolean
    setIsPreventingEvents: Dispatch<SetStateAction<boolean>>
    delayEvent?: (ms: number) => void
}

export const QlikEventPreventionContext = createContext<QlikEventPreventionContextType>({
    isPreventingEvents: false,
    setIsPreventingEvents: () => {
        throw new Error('preventEvents() needs to be used within QlikEventPreventionProvider')
    },
    delayEvent: _ms => {
        throw new Error('delayEvent() needs to be used within QlikEventPreventionProvider')
    }
})

export const useQlikEventPreventionContext = () => useContext(QlikEventPreventionContext)
