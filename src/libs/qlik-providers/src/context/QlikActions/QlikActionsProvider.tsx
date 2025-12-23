import React, { FC, ReactNode, useState } from 'react'

import { QlikActionsContext, QlikActionsContextType } from './QlikActionsContext'

interface Props {
    value?: QlikActionsContextType
    children: ReactNode
}

const QlikActionsProvider: FC<Props> = ({ value, children }) => {
    const [showActionsNode, setShowActionsNode] = useState<boolean | null>(false)
    const [actionsNode, setActionsNode] = useState<ReactNode | null>(null)

    return (
        <QlikActionsContext.Provider
            value={{ actionsNode, showActionsNode, setActionsNode, setShowActionsNode, ...value }}>
            {children}
        </QlikActionsContext.Provider>
    )
}

export default QlikActionsProvider
