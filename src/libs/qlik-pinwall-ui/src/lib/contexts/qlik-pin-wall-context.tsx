import React, { useContext } from 'react'

import { QlikPinWallAppState, QlikPinWallAppDispatch } from './store/pinWall.actions'

/*----------  Context  ----------*/

export const QlikPinWallStateContext = React.createContext<QlikPinWallAppState | undefined>(
    undefined
)
export const QlikPinWallDispatchContext = React.createContext<QlikPinWallAppDispatch | undefined>(
    undefined
)

/*----------  Hooks  ----------*/

export const useQlikPinWallState = () => {
    const context = React.useContext(QlikPinWallStateContext)
    if (context === undefined) {
        throw new Error('useQlikPinWallState must be used within a PinWallProvider')
    }
    return context
}

export const useQlikPinWallDispatch = () => {
    const context = useContext(QlikPinWallDispatchContext)
    if (context === undefined) {
        throw new Error('useQlikPinWallDispatch must be used within a PinWallProvider')
    }
    return context
}
