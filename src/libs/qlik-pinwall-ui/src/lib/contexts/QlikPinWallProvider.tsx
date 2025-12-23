import React, { ReactNode, useReducer } from 'react'

import { QlikPinWallDispatchContext, QlikPinWallStateContext } from './qlik-pin-wall-context'
import { defaultPinWallAppState } from './store/pinWall.actions'
import { pinWallReducer } from './store/pinWall.reducer'

interface Props {
    children: ReactNode
}

const QlikPinWallProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(pinWallReducer, defaultPinWallAppState)

    return (
        <QlikPinWallStateContext.Provider value={state}>
            <QlikPinWallDispatchContext.Provider value={dispatch}>
                {children}
            </QlikPinWallDispatchContext.Provider>
        </QlikPinWallStateContext.Provider>
    )
}

export default QlikPinWallProvider
