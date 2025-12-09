import { useEffect, useRef } from "react";

import {
    POCWEB_DEFAULT_PAGE,
    POCWEB_PAGES_PARAMS,
    POCWEB_VIRTUAL_PROXY
} from "app/config/appConfig";
import { createQlikAppObject } from "app/utils/appUtils";
import { setSessionStorageItem, getSessionStorageItem } from "app/utils/storageUtils";
import startup from "app/json/startup.json";

export const useAppInit = (isDev, setAppInit) => {
    const initDoneRef = useRef(false);

    useEffect(() => {
        const initApp = async () => {
            if (initDoneRef.current) {
                return;
            }
            try {
                const pages = new Map();
                const qApps = [];
                let defaultPage = "";
                let vp = "";

                // Development mode setup
                if (isDev) {
                    startup.pages.forEach(page => {
                        pages.set(page.page, page.qlikAppId);

                        if (page.page !== "reporting") {
                            const initials = page.page.substring(0, 1);
                            qApps.push(
                                createQlikAppObject(page.qlikAppId, initials, "#32b0d0", "#FFF")
                            );
                        }
                    });
                    defaultPage = startup.default;
                    vp = startup.vp;
                } else {
                    const params = new URLSearchParams(window.location.search);
                    Object.entries(POCWEB_PAGES_PARAMS).forEach(([key, storageKey]) => {
                        const paramValue = params.get(key) || getSessionStorageItem(storageKey);
                        pages.set(key, paramValue);

                        if (paramValue && key !== "reporting") {
                            const initials = key.substring(0, 1);
                            qApps.push(
                                createQlikAppObject(paramValue, initials, "#32b0d0", "#FFF")
                            );
                        }
                        setSessionStorageItem(storageKey, paramValue);
                    });

                    vp = params.get("vp") || getSessionStorageItem(POCWEB_VIRTUAL_PROXY) || "";
                    setSessionStorageItem(POCWEB_VIRTUAL_PROXY, vp);
                    defaultPage =
                        params.get("default") ||
                        getSessionStorageItem(POCWEB_DEFAULT_PAGE) ||
                        pages.entries().next().value;
                    setSessionStorageItem(POCWEB_DEFAULT_PAGE, defaultPage);
                }

                // Update app state
                setAppInit({
                    defaultPage,
                    qApps,
                    vp,
                    pages,
                    hasWrongConfiguration: pages.size === 0 || !vp // This should be determined based on your validation logic
                });

                initDoneRef.current = true;
            } catch (error) {
                console.error("Error initializing app:", error);
                // Handle initialization error
            }
        };

        initApp();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

export default useAppInit;
