import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Theme } from "@mui/material";
import { useQplusBootstrapContext } from "@databridge/qplus";

import { useAppContext } from "app/context/AppContext";
import { View } from "../shared/models/View";
import useSearchParamsQuery from "../shared/hooks/useSearchParamsQuery";
import SubHeaderWrapper from "./SubHeaderWrapper";
import { Page } from "./components/select/SelectView";

interface ISubHeaderProps {
    pageViews: View[];
}

const SubHeader: React.FC<ISubHeaderProps> = ({ pageViews }) => {
    const [isHeader, setIsHeader] = useState<boolean>(true);
    const [views, setViews] = useState<View[]>([]);
    const [parentPages, setParentPages] = useState<Page[]>([]);

    const { setIsHeaderVisible } = useAppContext();
    const { q } = useQplusBootstrapContext();
    const {
        searchParams: { view },
        setSearchParams
    } = useSearchParamsQuery();

    const theme = useTheme<Theme>();
    const findFirstTab = (pageViewsArg, viewName) =>
        pageViewsArg?.find(v => v?.view === viewName)?.subViews?.[0]?.tabs?.[0]?.url;
    const findUrl = (pageViewsArg, viewName) => pageViewsArg?.find(v => v?.view === viewName)?.url;

    useEffect(() => {
        q?.resize();
    }, [isHeader, q]);

    useEffect(() => {
        const newParentPages = pageViews?.map(v => ({
            label: v.view,
            route: v.route,
            url: findUrl(pageViews, v.view)
        }));
        setParentPages(newParentPages);
        setViews(pageViews);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme, pageViews]);

    useEffect(() => {
        if (views.length > 0) {
            if (views[0]?.url) {
                setSearchParams(view || views[0].url || "");
            } else {
                setSearchParams("", "");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, views]);

    const setUrlHelper = (pageViewsArg, viewName) => {
        const url = findUrl(pageViewsArg, viewName);
        const firstTab = findFirstTab(pageViewsArg, viewName);
        if (url) {
            setSearchParams(url, firstTab);
        }
    };

    const handlePageChangeCallback = (page: string) => {
        setUrlHelper(views, page);
    };

    const handleHeaderToggle = (toggle: boolean) => {
        setIsHeaderVisible(toggle);
        setIsHeader(toggle);
    };

    return (
        <SubHeaderWrapper
            parentPages={parentPages}
            shouldHideSubSettings
            handlePageChangeCallback={handlePageChangeCallback}
            handleHeaderToggleCallback={handleHeaderToggle}
            isHeaderVisible={isHeader}
        />
    );
};

export default SubHeader;
