import { View } from "app/shared/models/View";
import { TFunction } from "i18next";

export const getReportingViews = (
    t: TFunction<"translation", undefined, "translation">
): View[] => [
    {
        view: t("sih-subheader-select-view-reporting-selfservice"),
        route: "/apps/dashboards/reporting",
        subViews: []
    },
    {
        view: t("sih-subheader-select-view-reporting-pinwall"),
        route: "/apps/dashboards/reporting/pinwall",
        subViews: []
    }
];
