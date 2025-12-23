import { Report } from '@libs/common-models'
import { PinWall, PinWallFilters } from '@libs/core-models'
import { pinWallService } from '@libs/core-services'

import { getPinWallFilterMappings } from '../../utils'

export type QlikPinWallAppDispatch = (action: QlikPinWallAction) => void

export type QlikPinWallAppState = {
    loading: boolean
    offsetHeight: number
    pinWalls: PinWall[]
    activePinWall: PinWall | null
    activePinWallId: number | null
    activePinWallFilters: PinWallFilters[]
    pinWallableReports: Report[]
    refreshPinWallInMilliseconds: number
    errorMessage: string
    isUpdating: boolean
}

export enum QlikPinWallActionType {
    /*----------  loading  ----------*/
    showLoading = '@pinWall/loading',
    /*----------  pinWalls  ----------*/
    setPinWalls = '@pinWall/setPinWalls',
    setOffsetHeight = '@pinWall/setOffsetHeight',
    fetchPinWalls = '@pinWall/fetchPinWalls',
    addPinWall = '@pinWall/addPinWall',
    raiseError = '@pinWall/raiseError',
    refreshPinWall = '@pinWall/refreshPinWall',
    deletePinWall = '@pinWall/deletePinWall',
    updatePinWall = '@pinWall/updatePinWall',
    executeUpdating = '@pinWall/executeUpdating',
    setActivePinWallId = '@pinWall/setActivePinWallId',
    setActivePinWall = '@pinWall/setActivePinWall',
    setActivePinWallFilters = '@pinWall/setActivePinWallFilters',
    setRefreshPinWall = '@pinWall/setRefreshPinWall',
    setPinWallableReports = '@pinWall/setPinWallableReports',
    setPinWallRefreshInMilliseconds = '@pinWall/setPinWallRefreshInMilliseconds'
}

export const defaultPinWallAppState = {
    loading: false,
    offsetHeight: 150,
    pinWalls: [],
    activePinWall: null,
    activePinWallFilters: [],
    pinWallableReports: [],
    activePinWallId: null,
    refreshPinWallInMilliseconds: 0,
    errorMessage: '',
    isUpdating: false
}

/*------------------*/

export const showLoading = (loading = true) =>
    ({ type: QlikPinWallActionType.showLoading, loading } as const)

export const raiseError = (message = '') =>
    ({ type: QlikPinWallActionType.raiseError, message } as const)

export const executeUpdating = (isUpdating = false) =>
    ({ type: QlikPinWallActionType.executeUpdating, isUpdating } as const)

export const setOffsetHeight = (offsetHeight = 150) =>
    ({ type: QlikPinWallActionType.setOffsetHeight, offsetHeight } as const)

export const setPinWalls = (pinWalls: PinWall[]) =>
    ({ type: QlikPinWallActionType.setPinWalls, pinWalls } as const)

export const setPinWallRefreshInMilliseconds = (refreshPinWallInMilliseconds: number) =>
    ({
        type: QlikPinWallActionType.setPinWallRefreshInMilliseconds,
        refreshPinWallInMilliseconds
    } as const)

export const fetchPinWalls = async (dispatch: QlikPinWallAppDispatch, loader = true) => {
    try {
        if (loader) dispatch(showLoading())

        const pinWalls = await pinWallService.getAllPinWalls()

        dispatch(setPinWalls(pinWalls))
    } catch (error) {
        console.log('Qplus Error', error)
    } finally {
        dispatch(showLoading(false))
    }
}

export const refreshPinWall = async (
    dispatch: QlikPinWallAppDispatch,
    id: number,
    loader = true
) => {
    try {
        if (loader) dispatch(showLoading())

        const pinWall = await pinWallService.getPinWall(id)
        dispatch(setActivePinWall(pinWall))
    } catch (error) {
        console.log('Qplus Error', error)
    } finally {
        dispatch(showLoading(false))
    }
}

export const getPinWallFilters = async (
    dispatch: QlikPinWallAppDispatch,
    id: number,
    loader = true
) => {
    try {
        if (loader) dispatch(showLoading())

        const pinWallFiltersRaw = await pinWallService.getPinWallFilters(id)
        const pinWallFilters = getPinWallFilterMappings(pinWallFiltersRaw)
        dispatch(setActivePinWallFilters(pinWallFilters))
        return pinWallFilters
    } catch (error) {
        console.log('Qplus Error', error)
    } finally {
        dispatch(showLoading(false))
    }
}

export const persistPinWall = async (
    dispatch: QlikPinWallAppDispatch,
    pinWall: PinWall,
    loader = true
) => {
    try {
        dispatch(executeUpdating(true))
        if (loader) dispatch(showLoading())
        if (pinWall) {
            await pinWallService.updatePinWall(pinWall.id, {
                content: pinWall?.content
            })
        }
        dispatch(executeUpdating(false))
    } catch (error) {
        console.log('Qplus Error', error)
        dispatch(raiseError(error?.data?.message))
    } finally {
        dispatch(showLoading(false))
    }
}

export const addPinWall = (pinWall: PinWall) =>
    ({ type: QlikPinWallActionType.addPinWall, pinWall } as const)

export const deletePinWall = (pinWallId: number) =>
    ({ type: QlikPinWallActionType.deletePinWall, pinWallId } as const)

export const updatePinWall = (pinWall: PinWall) =>
    ({ type: QlikPinWallActionType.updatePinWall, pinWall } as const)

export const setActivePinWallId = (pinWallId: number) =>
    ({ type: QlikPinWallActionType.setActivePinWallId, pinWallId } as const)

export const setActivePinWall = (pinWall: PinWall) => {
    return { type: QlikPinWallActionType.setActivePinWall, pinWall } as const
}
export const setActivePinWallFilters = (pinWallFilters: PinWallFilters[]) => {
    return { type: QlikPinWallActionType.setActivePinWallFilters, pinWallFilters } as const
}

export const setPinWallableReports = (pinWallableReports: Report[]) => {
    return { type: QlikPinWallActionType.setPinWallableReports, pinWallableReports } as const
}

export type QlikPinWallAction =
    | ReturnType<typeof showLoading>
    | ReturnType<typeof raiseError>
    | ReturnType<typeof executeUpdating>
    | ReturnType<typeof setOffsetHeight>
    | ReturnType<typeof setPinWalls>
    | ReturnType<typeof addPinWall>
    | ReturnType<typeof deletePinWall>
    | ReturnType<typeof updatePinWall>
    | ReturnType<typeof setActivePinWallId>
    | ReturnType<typeof setActivePinWall>
    | ReturnType<typeof setActivePinWallFilters>
    | ReturnType<typeof setPinWallableReports>
    | ReturnType<typeof setPinWallRefreshInMilliseconds>
