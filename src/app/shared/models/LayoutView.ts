import { GridView } from './GridView'

export interface LayoutView {
    id?: string
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    height?: string
    type?: string
    export?: string[]
    calculationCondition?: string
    grid?: GridView[]
}
