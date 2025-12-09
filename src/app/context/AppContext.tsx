import { useContext, createContext } from "react";
import { QplusFieldFilter } from "@databridge/qplus-types";

export type TPages = Map<string, string>;

export type TQlikMeta = {
    backgroundColor: string;
    color: string;
};

export type TQlikApp = {
    qAppId: string;
    qActions: unknown[];
    qAppEvents: string[];
    qMeta: TQlikMeta;
    qIsDefault?: boolean;
    onQlikAppClosedCallback?: (appId, type, event) => void;
    onQlikAppErrorCallback?: (appId, type, event) => void;
};

export type TAppInit = {
    vp: string;
    pages: TPages;
    defaultPage: string;
    qApps: TQlikApp[];
    hasWrongConfiguration?: boolean;
};

export type AppContextType = {
    isAdminRole?: boolean;
    isAppLoading?: boolean;
    isUserGuard?: boolean;
    isHeaderVisible?: boolean;
    defaultFilters?: QplusFieldFilter[];
    hiddenFields?: string[];
    hostname?: string;
    vp: string;
    defaultPage?: string;
    pages: TPages;
    selectionCount?: number;
    showSessionExpirationDialog?: boolean;
    setIsAdminRole: (isAdmin: boolean) => void;
    setIsHeaderVisible: (isVisible: boolean) => void;
    setDefaultFilters: (filters: QplusFieldFilter[]) => void;
    setHiddenFields: (hiddenFields: string[]) => void;
    setIsUserGuard: (isGuard: boolean) => void;
    setIsAppLoading: (isAppLoading: boolean) => void;
    setSelectionCount: (count: number) => void;
    setShowSessionExpirationDialog: (show: boolean) => void;
    logoutUser: () => void;
};

export const AppContext = createContext<AppContextType>({
    hostname: "",
    vp: "",
    isUserGuard: false,
    isAppLoading: true,
    isHeaderVisible: true,
    defaultFilters: [],
    hiddenFields: [],
    showSessionExpirationDialog: false,
    selectionCount: 0,
    pages: new Map<string, string>(),
    defaultPage: "",
    isAdminRole: false,
    logoutUser: undefined,
    setIsUserGuard: _json => {
        throw new Error("setIsUserGuard() must be used within a AppProvider");
    },
    setIsAppLoading: _isAppLoading => {
        throw new Error("setIsAppLoading() must be used within a AppProvider");
    },
    setDefaultFilters: _filters => {
        throw new Error("setDefaultFilters() must be used within a AppProvider");
    },
    setHiddenFields: _hiddenFields => {
        throw new Error("setHiddenFields() must be used within a AppProvider");
    },
    setIsHeaderVisible: _isVisible => {
        throw new Error("setIsHeaderVisible() must be used within a AppProvider");
    },
    setShowSessionExpirationDialog: _show => {
        throw new Error("setShowSessionExpirationDialog() must be used within a AppProvider");
    },
    setSelectionCount: _count => {
        throw new Error("setSelectionCount() must be used within a AppProvider");
    },
    setIsAdminRole: _isAdmin => {
        throw new Error("setIsAdminRole() must be used within a AppProvider");
    }
});

export const useAppContext = () => useContext(AppContext);
