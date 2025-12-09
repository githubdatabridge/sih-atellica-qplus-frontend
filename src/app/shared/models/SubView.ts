import { LayoutView } from "./LayoutView";

export interface SubView {
    title: string;
    layout?: LayoutView[][];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tabs?: any[];
}
