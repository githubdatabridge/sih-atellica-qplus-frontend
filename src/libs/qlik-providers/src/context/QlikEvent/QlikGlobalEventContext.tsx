import { useContext, createContext } from 'react'

export type QlikGlobalEventContextType = {
    globalEventHandler: (type: string, event: any) => void
}

export const QlikGlobalEventContext = createContext<QlikGlobalEventContextType>({
    globalEventHandler: (_type, _event) => {
        throw new Error('globalEventHandler() must be used within a QlikGlobalEventProvider')
    }
})

export const useQlikGlobalEventContext = () => useContext(QlikGlobalEventContext)
