/* eslint-disable @typescript-eslint/no-shadow */
import React, { ReactNode, useCallback } from "react";
import { useMount } from "react-use";
import { changeLanguage } from "i18next";
import {
    useQplusFieldListData,
    useQplusApp,
    useQplusValueExpression,
    useQplusStringExpression,
    useQplusI18nContext
} from "@databridge/qplus";

import { useAppContext } from "app/context/AppContext";
import {
    hiddenTagOptions,
    expIsUserGuard,
    fieldIsGuard,
    varLanguage,
    localization
} from "app/config/qlikConfig";
import { i18nConfig } from "app/config/i18nConfig";
import languageResources from "assets/i18n";

type ConfigurationProps = { children: ReactNode };

const Configurations = React.memo(({ children }: ConfigurationProps) => {
    const { qAppId } = useQplusApp();
    const { setFieldListData } = useQplusFieldListData();
    const { setValueExpression } = useQplusValueExpression();
    const { setStringExpression } = useQplusStringExpression();
    const { onLanguageChange } = useQplusI18nContext();
    const { isAppLoading, setIsUserGuard, setHiddenFields, setIsAppLoading } = useAppContext();

    const loadVariables = useCallback(async () => {
        await setValueExpression(
            fieldIsGuard,
            expIsUserGuard,
            (reply: { isGuard: number | undefined }) => {
                setIsUserGuard(reply?.isGuard === -1);
            },
            qAppId
        );
        await setStringExpression(
            localization,
            varLanguage,
            async (reply: { localization: string | number }) => {
                const isoLocale = i18nConfig[reply?.localization];
                const qplusLabels = languageResources.qplus[isoLocale];
                await changeLanguage(isoLocale);
                onLanguageChange(isoLocale, qplusLabels);
                setIsAppLoading(false);
            },
            qAppId
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadHiddenFields = useCallback(async () => {
        const f = await setFieldListData(qAppId, true);
        const filteredItems = f?.filter(i => i.qTags.indexOf(hiddenTagOptions) >= 0);
        const newFilteredItems = filteredItems?.map(f => f.qName);

        setHiddenFields(newFilteredItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useMount(async () => {
        await loadVariables();
        await loadHiddenFields();
    });

    if (isAppLoading) return null;

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
});

export default Configurations;
