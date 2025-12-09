import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "app/context/AppContext";
import { POCWEB_LAST_VISITED_PAGE } from "app/config/appConfig";
import { getSessionStorageItem } from "app/utils/storageUtils";

const LoaderPage = () => {
    const { defaultPage } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const pageTo = getSessionStorageItem(POCWEB_LAST_VISITED_PAGE) || defaultPage;
        navigate(`${pageTo}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultPage]);

    return <div>Loading...</div>;
};

export default LoaderPage;
