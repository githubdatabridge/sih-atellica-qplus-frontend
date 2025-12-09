declare global {
    interface Window {
        env: RuntimeEnvs;
    }
    interface RuntimeEnvs {
        VITE_QLIK_HOST_NAME: string;
        VITE_TENANT_ID: string;
        VITE_CUSTOMER_ID: string;
        VITE_MASHUP_APP_ID: string;
        VITE_QPLUS_APP_API: string;
        VITE_LOGIN_URL: string;
        VITE_DEFAULT_THEME: string;
        VITE_QLIK_GLOBAL_EVENTS: string;
        VITE_QLIK_APP_EVENTS: string;
        VITE_INSIGHT_SOCKET_PATH: string;
        VITE_ROUTER: string;
        VITE_APP_VERSION: string;
    }
}

export const env = { ...import.meta.env, ...window.env };
