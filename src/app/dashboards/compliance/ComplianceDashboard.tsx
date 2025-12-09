import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { Theme } from "@mui/material";
import {
    useQplusApp,
    useQplusAppAction,
    useQplusClearAll,
    useQplusFieldClear,
    useQplusPreferencesContext,
    useQplusSelectionContext,
    useWindowDimensions
} from "@databridge/qplus";
import { QplusAction } from "@databridge/qplus-types";

import { DASHBOARD_VIEW_URL } from "app/shared/constants/constants";
import { useAppContext } from "app/context/AppContext";
import { getComplianceDefinition } from "app/shared/definitions/compliance";
import useSearchParamsQuery from "app/shared/hooks/useSearchParamsQuery";
import { View } from "app/shared/models/View";
import RenderGridLayout from "../shared/components/RenderGridLayout";
import PageTabs from "../shared/components/RenderTabs";
import DashboardTemplate from "../shared/components/DashboardTemplate";
import { filterDataSource, filterMeasurementDate } from "./options/filters";

function ComplianceDashboard() {
    const PAGE_NAME = "compliance";

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [windowHeight, setWindowHeight] = useState<number>(0);
    const [views, setViews] = useState<View[]>([]);
    const [currentView, setCurrentView] = useState<string>("");
    const [currentSubPage, setCurrentSubPage] = useState<string>("");

    const { height } = useWindowDimensions();
    const { isUserGuard, setDefaultFilters, pages } = useAppContext();
    const { qAppId } = useQplusApp(pages.get(PAGE_NAME));
    const { setClearAll } = useQplusClearAll();
    const { setFieldClear } = useQplusFieldClear();
    const { setQlikAction } = useQplusAppAction();
    const { userPreferences } = useQplusPreferencesContext();
    const { setDockedFields } = useQplusSelectionContext();
    const {
        searchParams: { view }
    } = useSearchParamsQuery();

    const { t } = useTranslation();
    const theme = useTheme<Theme>();

    const findView = (jsonViews, url) => jsonViews?.find(v => v?.url === url);
    const getSubViews = useCallback((jsonViews: View[], viewName: string) => {
        const tSubPages = jsonViews
            .filter(v => v?.view === viewName)
            .flatMap(v => v.subViews.map(sv => sv.title));
        setCurrentSubPage(tSubPages[0]);
    }, []);

    const setDockedUnionArray = useCallback(
        (savedFilters, defaultFilters) => {
            const set1 = new Set(
                defaultFilters.map(({ qFieldName, qAppId: qaid }) =>
                    JSON.stringify({ qFieldName, qAppId: qaid })
                )
            );
            const uniqueArray = [
                ...defaultFilters,
                ...(savedFilters || []).filter(obj => {
                    const key = JSON.stringify({ qFieldName: obj.qFieldName, qAppId: obj.qAppId });
                    return !set1.has(key);
                })
            ];

            setDockedFields(uniqueArray);
        },
        [setDockedFields]
    );

    const triggerActions = useCallback(
        async (actualView: string, actions: QplusAction[]) => {
            if (actualView === DASHBOARD_VIEW_URL.DASHBOARD) {
                await setFieldClear(filterMeasurementDate.qFieldName, qAppId);
            }
            if (actions) {
                for (const action of actions) {
                    // eslint-disable-next-line no-await-in-loop
                    await setQlikAction({ ...action, qAppId });
                }
            }
            setIsLoading(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [qAppId]
    );

    const setuptViewsHelper = useCallback(
        async () => {
            try {
                setIsLoading(true);
                if (views.length > 0) {
                    const v = findView(views, view);
                    const vName = v?.view || views[0].view;
                    getSubViews(views, vName);
                    await triggerActions(currentView, v?.actions);
                }
                setCurrentView(view);
            } finally {
                setIsLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [views, view, currentView]
    );

    useEffect(() => {
        const timer = setTimeout(() => setWindowHeight(height), 500); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, [height]);

    useEffect(() => {
        const savedFilters = userPreferences?.additionalPreferences?.filters[PAGE_NAME];

        const defaultFilters = [
            {
                ...filterMeasurementDate,
                isDocked: false,
                qAppId: pages.get(PAGE_NAME),
                isFixed: true,
                rank: -2,
                dateOptions: {
                    height: "40px",
                    width: "210px",
                    dateFormat: "dd/MM/yyyy",
                    qlikDateFormat: "dd/MM/yyyy",
                    css: {
                        backgroundColor: theme.palette.common.highlight5,
                        height: "40px",
                        borderRadius: "4px",
                        marginRight: "10px"
                    },
                    cssDefinedRange: {
                        color: theme.palette.primary.contrastText,
                        backgroundColor: theme.palette.info.main
                    },
                    cssIconBox: {
                        width: "30px",
                        paddingRight: "10px",
                        paddingTop: "1px"
                    },
                    cssButtonText: {
                        textAlign: "left",
                        paddingLeft: "10px",
                        opacity: 1
                    },
                    cssIconCalendar: {
                        color: theme.palette.common.secondaryText,
                        cursor: "pointer"
                    }
                }
            },
            ...(isUserGuard
                ? [
                      {
                          ...filterDataSource,
                          qAppId: pages.get(PAGE_NAME),
                          isDocked: false,
                          isFixed: true,
                          rank: -1
                      }
                  ]
                : [])
        ];

        setDockedUnionArray(savedFilters, defaultFilters);
        setDefaultFilters(defaultFilters);

        return () => {
            setClearAll(qAppId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserGuard]);

    useEffect(() => {
        const jsonViews: View[] = getComplianceDefinition(t, windowHeight - 200);
        setViews(jsonViews);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setuptViewsHelper();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [views, view]);

    const currentPage = findView(views, view)?.view || views[0]?.view;

    const renderViews = useMemo(
        () =>
            getComplianceDefinition(t, windowHeight - 200, theme)
                ?.filter(v => v.view === currentPage)
                ?.map((v: View, index: number) => {
                    const subView = v.subViews.find(sv => sv.title === currentSubPage);
                    return subView?.tabs ? (
                        <PageTabs
                            key={`page_tabs_${PAGE_NAME}_${view}_${index}`}
                            tabs={subView.tabs}
                            page={PAGE_NAME}
                        />
                    ) : (
                        <RenderGridLayout
                            key={`grid_layout_${PAGE_NAME}_${index}`}
                            content={subView?.layout}
                            qlikAppId={qAppId}
                        />
                    );
                }),
        [t, windowHeight, theme, currentPage, view, qAppId, currentSubPage]
    );

    if (windowHeight === 0 || !currentSubPage || isLoading) return null;

    return <DashboardTemplate>{renderViews}</DashboardTemplate>;
}

export default ComplianceDashboard;
