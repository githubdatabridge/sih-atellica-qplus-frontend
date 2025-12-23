import { QlikPinWallAppState, QlikPinWallActionType, QlikPinWallAction } from './pinWall.actions'

export const pinWallReducer = (state: QlikPinWallAppState, action: QlikPinWallAction) => {
    switch (action.type) {
        case QlikPinWallActionType.setPinWalls:
            return {
                ...state,
                pinWalls: action.pinWalls,
                activePinWall: state.activePinWall ? state.activePinWall : action.pinWalls[0],
                loading: false
            }
        case QlikPinWallActionType.showLoading:
            return {
                ...state,
                loading: action.loading
            }
        case QlikPinWallActionType.executeUpdating:
            return {
                ...state,
                isUpdating: action.isUpdating
            }
        case QlikPinWallActionType.setOffsetHeight:
            return {
                ...state,
                offsetHeight: action.offsetHeight
            }
        case QlikPinWallActionType.setPinWallRefreshInMilliseconds:
            return {
                ...state,
                refreshPinWallInMilliseconds: action.refreshPinWallInMilliseconds
            }
        case QlikPinWallActionType.raiseError:
            return {
                ...state,
                errorMessage: action.message
            }
        case QlikPinWallActionType.addPinWall:
            return {
                ...state,
                pinWalls: [...state.pinWalls, action.pinWall],
                activePinWallId: action.pinWall.id,
                activePinWall: action.pinWall,
                loading: false
            }
        case QlikPinWallActionType.updatePinWall:
            return {
                ...state,
                pinWalls: state.pinWalls.map(pw => {
                    if (pw.id !== action?.pinWall?.id) return pw

                    return action.pinWall
                }),
                activePinWall: action?.pinWall || null,
                loading: false
            }
        case QlikPinWallActionType.deletePinWall: {
            const newPinWalls = state.pinWalls.filter(p => p.id !== action.pinWallId)
            return {
                ...state,
                activePinWall: newPinWalls[0],
                pinWalls: newPinWalls
            }
        }
        case QlikPinWallActionType.setActivePinWall:
            return {
                ...state,
                activePinWall: action.pinWall,
                loading: false
            }
        case QlikPinWallActionType.setActivePinWallId:
            return {
                ...state,
                activePinWallId: action.pinWallId
            }
        case QlikPinWallActionType.setActivePinWallFilters:
            return {
                ...state,
                activePinWallFilters: action.pinWallFilters
            }
        case QlikPinWallActionType.setPinWallableReports:
            return {
                ...state,
                pinWallableReports: action.pinWallableReports
            }
        default:
            return state
    }
}
