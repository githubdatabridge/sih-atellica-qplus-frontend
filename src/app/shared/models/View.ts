import { QplusAction } from "@databridge/qplus-types";

import { SubView } from "./SubView";

export interface View {
    view: string;
    key?: string;
    route?: string;
    subViews: SubView[];
    url?: string;
    actions?: QplusAction[];
}
