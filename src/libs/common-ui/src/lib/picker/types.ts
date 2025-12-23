export type DateRange = {
    startDate?: Date
    endDate?: Date
}

export type Setter<T> = React.Dispatch<React.SetStateAction<T>> | ((value: T) => void)

export enum NavigationAction {
    // eslint-disable-next-line no-unused-vars
    Previous = -1,

    // eslint-disable-next-line no-unused-vars
    Next = 1
}

export type DefinedRange = {
    startDate: Date
    endDate: Date
    label: string
}

export type Marker = symbol

export const MARKERS: { [key: string]: Marker } = {
    FIRST_MONTH: Symbol('firstMonth'),
    SECOND_MONTH: Symbol('secondMonth')
}
