import React, { ReactNode, useCallback, useState } from 'react'

import { QlikObject, QlikObjectContext, QlikObjectContextType } from './QlikObjectContext'

export interface QlikObjectProps {
    value?: QlikObjectContextType
    children: ReactNode
}

const QlikObjectProvider: React.FC<QlikObjectProps> = ({ value = {}, children }) => {
    const [qlikObjects, setObjects] = useState<QlikObject[]>([])

    const setQlikObjects = useCallback((qlikObjects: QlikObject[]) => {
        setObjects(qlikObjects)
    }, [])

    return (
        <QlikObjectContext.Provider
            value={{
                qlikObjects,
                setQlikObjects,
                ...value
            }}>
            {children}
        </QlikObjectContext.Provider>
    )
}

export default QlikObjectProvider
