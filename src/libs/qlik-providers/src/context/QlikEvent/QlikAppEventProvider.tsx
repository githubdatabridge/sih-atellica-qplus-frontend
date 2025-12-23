import React, { ReactNode, useCallback } from 'react'

import { QlikAppEventContextType, QlikAppEventContext } from './QlikAppEventContext'
import { useQlikEventPreventionContext } from './QlikEventPreventionContext'

/*
https://qs-i-dev.databridge.ch/resources/translate/en-US/engine.json
-128": "Internal engine error",
-1": "Unknown error",
0": "Unknown error",
1": "Some data is not correctly specified.",
2": "The resource could not be found.",
3": "Resource already exists.",
4": "Invalid path",
5": "Access is denied",
6": "The system is out of memory.",
7": "Not initialized",
8": "Invalid parameters",
9": "Some parameters are empty.",
10": "Internal error",
11": "Corrupted data",
12": "Memory inconsistency",
13": "Action was aborted unexpectedly.",
14": "Validation cannot be performed at the moment. Please try again later.",
15": "Operation aborted",
16": "Connection lost. Make sure that Qlik Sense is running properly. If your session has timed out due to inactivity, refresh to continue working.",
*/

/*
https://qs-i-dev.databridge.ch/resources/translate/en-US/client.json
"ProxyError.OnEngineWebsocketFailed": "Connection to the Qlik Sense engine failed for unspecified reasons. Refresh your browser or contact your system administrator.",
"ProxyError.OnLicenseAccessDenied": "You cannot access Qlik Sense because you have no access pass.", "ProxyError.OnLicenseAccessDeniedPendingUserSync": "Your access pass credentials are being synced. Refresh your browser or contact your system administrator.",
"ProxyError.OnNoEngineAvailable": "No available Qlik Sense engine was found. Refresh your browser or contact your system administrator.", "ProxyError.OnSessionClosed": "Your session has been closed. Refresh your browser to continue working.",
"ProxyError.OnNoDataPrepServiceAvailable": "Data Profiling service is not available.",
"ProxyError.OnDataPrepServiceWebsocketFailed": "Data Profiling service connection failed. Refresh your browser.",
"ProxyError.OnSessionTimedOut": "Your session has timed out. Log back in to Qlik Sense to continue.",
*/

interface Props {
    value?: QlikAppEventContextType
    children: ReactNode
}

const QlikAppEventProvider = ({ value, children }: Props) => {
    const { isPreventingEvents } = useQlikEventPreventionContext()

    const qAppEventHandler = useCallback(
        (
            appId: string,
            type: string,
            event: any,
            onQlikAppClosedCallback: any,
            onQlikAppErrorCallback: any,
            onQlikAppWarningCallback: any
        ) => {
            if (isPreventingEvents) return

            if (event) {
                switch (type) {
                    case 'error':
                        if (onQlikAppErrorCallback) onQlikAppErrorCallback(appId, type, event)
                        break
                    case 'warning':
                        if (onQlikAppWarningCallback) onQlikAppWarningCallback(appId, type, event)
                        break
                    case 'closed':
                        if (onQlikAppClosedCallback) onQlikAppClosedCallback(appId, type, event)
                        break
                    default:
                        break
                }
            }
        },
        [isPreventingEvents]
    )

    const providerValues: QlikAppEventContextType = {
        qAppEventHandler
    }

    return (
        <QlikAppEventContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikAppEventContext.Provider>
    )
}

export default QlikAppEventProvider
