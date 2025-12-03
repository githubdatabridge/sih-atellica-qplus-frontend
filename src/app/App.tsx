import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Base64 } from "js-base64";
import CssBaseline from "@mui/material/CssBaseline";

import ThemeProvider from "app/context/ThemeProvider";
import AppProvider from "app/context/AppProvider";
import { TAppInit, TPages, TQlikApp } from "app/context/AppContext";

import Main from "./Main";
import startup from "./json/startup.json";
import { env } from "env";

const QUERY_PARAM_VP = "vp";
const QUERY_PARAM_DEFAULT = "default";
const QUERY_PARAM_COMPLIANCE = "compliance";
const QUERY_PARAM_AUDIT = "audit";
const QUERY_PARAM_REPORTING = "reporting";

const IS_DEV = process.env.NODE_ENV === "development";

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appInit, setAppInit] = useState<TAppInit>({});
  const navigate = useNavigate();
  const location = useLocation();

  const POCWEB_PAGES_PARAMS = useMemo(() => {
    return {
      reporting: "__SIH_POCWEB_REPORTING_APP_ID__",
      compliance: "__SIH_POCWEB_COMPLIANCE_APP_ID__",
      audit: "__SIH_POCWEB_AUDIT_APP_ID__",
    };
  }, []);

  const POCWEB_DEFAULT_PAGE = {
    default: "__SIH_POCWEB_DEFAULT_PAGE__",
  };
  const POCWEB_VIRTUAL_PROXY = {
    vp: "__SIH_POCWEB_VIRTUAL_PROXY__",
  };

  const setSessionStorageItem = (key: string, value: string) => {
    const encodedData = Base64.encode(JSON.stringify(value));
    sessionStorage.setItem(key, encodedData);
  };

  const getSessionStorageItem = (key: string): string => {
    const data = sessionStorage.getItem(key);
    if (!data) {
      return null;
    }

    const baseData = Base64.decode(data);
    return JSON.parse(baseData);
  };

  const addPageHelper = (
    pages: Map<string, string>,
    qApps: TQlikApp[],
    appId: string,
    storageKey: string,
    page: string
  ) => {
    if (appId) {
      pages.set(page, appId);
      qApps.push({
        qAppId: appId,
        qActions: [],
        qMeta: {
          backgroundColor: "",
          color: "",
        },
        qAppEvents: [],
        qIsDefault: false,
      });
      setSessionStorageItem(storageKey, appId);
    } else {
      sessionStorage.removeItem(storageKey);
    }
  };

  const isPocWebQueryParamHelper = (params: URLSearchParams) => {
    return (
      params.get(QUERY_PARAM_VP) !== null ||
      params.get(QUERY_PARAM_COMPLIANCE) !== null ||
      params.get(QUERY_PARAM_AUDIT) !== null ||
      params.get(QUERY_PARAM_REPORTING) !== null ||
      params.get(QUERY_PARAM_DEFAULT) !== null
    );
  };

  const isValidGuidHelper = (param: string) => {
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(param);
  };

  useEffect(() => {
    let defaultPage = "";
    let queryParams = "";
    let defaultQlikAppId = "";
    let vp = "";
    let pages: TPages = new Map<string, string>();
    let isInGuidFormat = true;
    let isDefaultPageValid = true;
    const qApps: TQlikApp[] = [];

    try {
      setIsLoading(true);
      const { search } = window.location;
      const params = new URLSearchParams(search);

      if (IS_DEV) {
        for (const page of startup.pages) {
          pages.set(page.page, page.qlikAppId);
          queryParams = queryParams + `${page.page}=${page.qlikAppId}&`;
          qApps.push({
            qAppId: page.qlikAppId,
            qActions: [],
            qMeta: {
              backgroundColor: "",
              color: "",
            },
            qAppEvents: [],
            qIsDefault: false,
          });
        }
        defaultPage = startup.default;
        const defaultAppId = pages.get(QUERY_PARAM_COMPLIANCE);
        defaultQlikAppId = defaultAppId || qApps?.[0].qAppId;
        vp = startup.vp;
      } else {
        const isPocWebUrl =
          Array.from(params as any).length > 0 &&
          isPocWebQueryParamHelper(params);

        // -------------------------------------------------------------------------Add pags in Map structure
        for (const [k, v] of Object.entries(POCWEB_PAGES_PARAMS)) {
          addPageHelper(
            pages,
            qApps,
            params.get(k) || (!isPocWebUrl && getSessionStorageItem(v)),
            v,
            k
          );
        }
        // -------------------------------------------------------------------------Add virtual proxy
        vp =
          params.get(QUERY_PARAM_VP) ||
          (!isPocWebUrl &&
            getSessionStorageItem(POCWEB_VIRTUAL_PROXY[QUERY_PARAM_VP])) ||
          "";
        if (vp) setSessionStorageItem(POCWEB_VIRTUAL_PROXY[QUERY_PARAM_VP], vp);

        // -------------------------------------------------------------------------Add default page

        defaultPage =
          params.get(QUERY_PARAM_DEFAULT) ||
          (!isPocWebUrl &&
            getSessionStorageItem(POCWEB_DEFAULT_PAGE[QUERY_PARAM_DEFAULT])) ||
          "";

        isDefaultPageValid = Boolean(pages.get(defaultPage));

        if (defaultPage && isDefaultPageValid)
          setSessionStorageItem(
            POCWEB_DEFAULT_PAGE[QUERY_PARAM_DEFAULT],
            defaultPage
          );

        // -------------------------------------------------------------------------Validate Qlik App Ids

        // 👇️ Using for...of
        for (const [, value] of pages) {
          if (!isValidGuidHelper(value)) {
            isInGuidFormat = false;
            break;
          }
        }

        // -------------------------------------------------------------------------Get default Qlik App Id

        const defaultAppId = pages.get(defaultPage);
        defaultQlikAppId = defaultAppId || qApps?.[0]?.qAppId || "";
      }

      // -------------------------------------------------------------------------Make array of qlik apps unique
      const qlikAppMap = new Map();
      for (let app of qApps) {
        qlikAppMap.set(app.qAppId, app);
      }
      const uniqueQlikApps = [...qlikAppMap.values()];

      // -------------------------------------------------------------------------Validation
      const isValid =
        (qApps.length > 0 || pages.size > 0) &&
        defaultPage &&
        isInGuidFormat &&
        isDefaultPageValid &&
        defaultQlikAppId;

      if (IS_DEV)
        console.log(
          "DEBUG",
          process.env.NODE_ENV,
          defaultPage,
          defaultQlikAppId,
          uniqueQlikApps,
          vp,
          pages,
          isDefaultPageValid,
          isInGuidFormat
        );

      // -------------------------------------------------------------------------Cleanup query params in URL

      if (isValid) {
        params.delete(QUERY_PARAM_COMPLIANCE);
        params.delete(QUERY_PARAM_AUDIT);
        params.delete(QUERY_PARAM_REPORTING);
        params.delete(QUERY_PARAM_VP);
        params.delete(QUERY_PARAM_DEFAULT);
        if (env.REACT_APP_ROUTER === "Hash") {
          window.history.pushState(
            {},
            document.title,
            window.location.pathname
          );
        } else {
          navigate({
            pathname: location.pathname,
            search: params.toString(),
          });
        }
      }

      // -------------------------------------------------------------------------Set configuration in state

      setAppInit({
        defaultPage,
        qApps: uniqueQlikApps,
        vp: vp,
        pages: pages,
        hasWrongConfiguration: !isValid,
      });
    } catch (error) {
      console.log("Insight Error", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (appInit) {
      setIsLoading(false);
    }
  }, [appInit]);

  const isEmpty = Object.keys(appInit).length === 0;

  if (isLoading) return null;

  return (
    <ThemeProvider>
      <AppProvider
        isInitialized={!isEmpty}
        hostname={
          env.REACT_APP_QLIK_HOST_NAME ?? process.env.REACT_APP_QLIK_HOST_NAME
        }
        vp={appInit.vp}
        qApps={appInit.qApps}
        defaultPage={appInit.defaultPage}
        pages={appInit.pages}
        hasWrongConfiguration={appInit.hasWrongConfiguration}
      >
        <CssBaseline />
        <Main />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
