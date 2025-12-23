import { ReactNode, useState } from 'react'

import {
    QlikEventPreventionContextType,
    QlikEventPreventionContext
} from './QlikEventPreventionContext'

interface Props {
    value?: QlikEventPreventionContextType
    children: ReactNode
}

const QlikEventPreventionProvider = ({ value, children }: Props) => {
    const [isPreventingEvents, setPreventingEvents] = useState(false)

    const setIsPreventingEvents = (prevent: boolean) => {
        setPreventingEvents(prevent)
    }

    const delayEvent = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const providerValues: QlikEventPreventionContextType = {
        isPreventingEvents,
        setIsPreventingEvents,
        delayEvent
    }

    return (
        <QlikEventPreventionContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikEventPreventionContext.Provider>
    )
}

export default QlikEventPreventionProvider
