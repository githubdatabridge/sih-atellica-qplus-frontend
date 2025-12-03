import { LayoutView } from './LayoutView'

export interface SubView {
    title: string
    layout?: LayoutView[][]
    tabs?: any[]
}
