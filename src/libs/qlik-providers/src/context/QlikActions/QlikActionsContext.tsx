import { useContext, createContext, ReactNode } from 'react'

export type QlikActionsContextType = {
    actionsNode?: ReactNode | null
    showActionsNode?: boolean | null
    setShowActionsNode: (show: boolean) => void
    setActionsNode: (node: ReactNode | null) => void
}

export const QlikActionsContext = createContext<QlikActionsContextType>({
    actionsNode: null,
    showActionsNode: false,
    setActionsNode: (_node: ReactNode | null) => {
        throw new Error('setActionsNode() must be used within a QlikActionsProvider')
    },
    setShowActionsNode: _show => {
        throw new Error('setShowActionsNode() must be used within a QlikActionsProvider')
    }
})

export const useQlikActionsContext = () => useContext(QlikActionsContext)
