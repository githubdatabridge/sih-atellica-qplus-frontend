import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

import { PAGE_SEARCH_PARAMS } from "app/shared/constants/constants";

const useSearchParamsQuery = () => {
    const [queryParams, setQueryParams] = useSearchParams("");
    const { VIEW, TAB } = PAGE_SEARCH_PARAMS;

    const setSearchParams = useCallback(
        (view?: string, tab?: string) =>
            setQueryParams(params => {
                view === "" ? params.delete(VIEW) : view !== undefined && params.set(VIEW, view);
                tab === "" ? params.delete(TAB) : tab !== undefined && params.set(TAB, tab);
                return params;
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setQueryParams]
    );

    const searchParams = {
        view: queryParams.get(VIEW),
        tab: queryParams.get(TAB)
    };

    return { searchParams, setSearchParams };
};

export default useSearchParamsQuery;
