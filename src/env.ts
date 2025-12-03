declare global {
    interface Window {
        env: any
    }
}

export const env = { ...process.env, ...window.env }

window.env = {
    REACT_APP_QLIK_HOST_NAME: 'qs-i-dev.databridge.ch',
    REACT_APP_TENANT_ID: 'single_hardcoded_for_now',
    REACT_APP_CUSTOMER_ID: 'hardcoded_for_now',
    REACT_APP_MASHUP_APP_ID: 'insight_poc',
    REACT_APP_INSIGHT_APP_API: 'https://qs-i-dev.databridge.ch:3009',
    REACT_APP_LOGIN_URL:
        'https://qs-i-dev.databridge.ch/anonym/extensions/sh-mash-login/index.html',
    REACT_APP_DEFAULT_THEME: 'qplus-sih-theme-light',
    REACT_APP_QLIK_GLOBAL_EVENTS: 'closed,warning,error',
    REACT_APP_QLIK_APP_EVENTS: 'closed,warning,error',
    REACT_APP_INSIGHT_SOCKET_PATH: '/socket.io'
}
