import { useContext, createContext } from 'react'

export type QlikAppEventContextType = {
    qAppEventHandler: (
        appId: string,
        type: string,
        event: any,
        onQlikAppClosedCallback: any,
        onQlikAppErrorCallback: any,
        onQlikAppWarningCallback: any
    ) => void
}

export const QlikAppEventContext = createContext<QlikAppEventContextType>({
    qAppEventHandler: (
        _appId,
        _type,
        _event,
        _onQlikAppClosedCallback,
        _onQlikAppErrorCallback,
        _onQlikAppWarningCallback
    ) => {
        throw new Error('qAppEventHandler() must be used within a QlikAppEventProvider')
    }
})

export const useQlikAppEventContext = () => {
    const context = useContext(QlikAppEventContext)

    if (context === undefined) {
        throw new Error('useQlikAppEventContext must be used within a QlikAppEventContext')
    }

    return context
}
