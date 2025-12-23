export enum ProxyErrorMessage {
    EngineWebsocketFailed = 'ProxyError.OnEngineWebsocketFailed',
    LicenseAccessDenied = 'ProxyError.OnLicenseAccessDenied',
    NoEngineAvailable = 'ProxyError.OnNoEngineAvailable',
    NoDataPrepServiceAvailable = 'ProxyError.OnNoDataPrepServiceAvailable',
    DataPrepServiceWebsocketFailed = 'ProxyError.OnDataPrepServiceWebsocketFailed',
    OnSessionLoggedOut = 'ProxyError.OnSessionLoggedOut',
    OnSessionTimedOut = 'ProxyError.OnSessionTimedOut',
    AccessDenied = 'Access denied'
}

export enum ProxyInfoMessage {
    SessionMessageClosed = 'Session closed.'
}
