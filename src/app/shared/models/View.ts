import { SubView } from './SubView'

export interface View {
    view: string
    route?: string
    subViews: SubView[]
    url?: string
}
