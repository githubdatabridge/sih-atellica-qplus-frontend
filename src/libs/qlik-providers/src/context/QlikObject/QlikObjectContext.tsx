import { useContext, createContext } from 'react'

export type QlikObject = {
    key: number
    name: string
    data: any
    selected?: any
}

export type QlikObjectContextType = {
    qlikObjects?: QlikObject[]
    setQlikObjects: (objects: QlikObject[]) => void
}

export const QlikObjectContext = createContext<QlikObjectContextType>({
    qlikObjects: [],
    setQlikObjects: _objects => {
        throw new Error('setQlikObjects() must be used within a QlikObjectProvider')
    }
})

export const useQlikObjectContext = () => {
    const context = useContext(QlikObjectContext)

    if (context === undefined) {
        throw new Error('useQlikObjectContext must be used within a QlikObjectContext')
    }

    return context
}
