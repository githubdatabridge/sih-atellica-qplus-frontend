import React, { ReactNode, useCallback } from 'react'

import { useQlikContext } from '../Qlik/QlikContext'
import { useQlikEventPreventionContext } from './QlikEventPreventionContext'
import { QlikGlobalEventContextType, QlikGlobalEventContext } from './QlikGlobalEventContext'
import { ProxyErrorMessage } from './types'

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
"ProxyError.onQlikGlobalSessionTimeoutCallback": "Your session has timed out. Log back in to Qlik Sense to continue.",
*/

interface Props {
    value?: QlikGlobalEventContextType
    children: ReactNode
}

const QlikGlobalEventProvider = ({ value, children }: Props) => {
    const { isPreventingEvents } = useQlikEventPreventionContext()
    const {
        settings: {
            onQlikGlobalSessionTimeoutCallback,
            onQlikGlobalErrorCallback,
            onQlikGlobalWarningCallback,
            onQlikGlobalClosedCallback,
            onQlikGlobalAccessDeniedCallback
        }
    } = useQlikContext()

    const globalEventHandler = useCallback(
        (type: string, event: any) => {
            if (isPreventingEvents) return

            if (event) {
                switch (type) {
                    case 'error':
                        if (onQlikGlobalErrorCallback) onQlikGlobalErrorCallback(type, event)
                        switch (event?.message) {
                            case ProxyErrorMessage.OnSessionLoggedOut:
                                if (onQlikGlobalSessionTimeoutCallback)
                                    onQlikGlobalSessionTimeoutCallback(true, type, event)
                                break
                            case ProxyErrorMessage.OnSessionTimedOut:
                                if (onQlikGlobalSessionTimeoutCallback)
                                    onQlikGlobalSessionTimeoutCallback(true, type, event)
                                break
                            case ProxyErrorMessage.AccessDenied:
                                if (onQlikGlobalAccessDeniedCallback)
                                    onQlikGlobalAccessDeniedCallback(event?.message)
                                break
                            default:
                                break
                        }
                        break
                    case 'warning':
                        if (onQlikGlobalWarningCallback) onQlikGlobalWarningCallback(type, event)
                        break
                    case 'closed':
                        if (onQlikGlobalClosedCallback) onQlikGlobalClosedCallback(type, event)
                        switch (event?.message) {
                            default:
                                break
                        }
                        break
                    default:
                        break
                }
            }
        },
        [
            isPreventingEvents,
            onQlikGlobalErrorCallback,
            onQlikGlobalWarningCallback,
            onQlikGlobalClosedCallback,
            onQlikGlobalSessionTimeoutCallback,
            onQlikGlobalAccessDeniedCallback
        ]
    )

    const providerValues: QlikGlobalEventContextType = {
        globalEventHandler
    }

    return (
        <QlikGlobalEventContext.Provider value={{ ...providerValues, ...value }}>
            {children}
        </QlikGlobalEventContext.Provider>
    )
}

export default QlikGlobalEventProvider
