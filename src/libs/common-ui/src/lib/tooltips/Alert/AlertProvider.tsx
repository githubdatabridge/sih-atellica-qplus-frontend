import React, { ReactNode, useCallback, useState } from 'react'

import BackdropLoader from '../../loaders/BackdropLoader'
import Toast from '../Toast/Toast'
import {
    AlertContext,
    AlertDuration,
    AlertStatusType,
    AlertType,
    toastDefaults
} from './AlertContext'

type ToastInfo = {
    message: string
    type: AlertType
    duration: AlertDuration
    actionUrl?: string | null
}

type AlertProviderProps = {
    children: ReactNode
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [isLoading, showLoading] = useState<boolean>(false)
    const [toast, setToastInfo] = useState<ToastInfo>(toastDefaults)
    const [alertInfoIcon, setInfo] = useState<AlertStatusType>(null)
    const [alertErrorIcon, setError] = useState<AlertStatusType>(null)
    const [alertSuccessIcon, setSuccess] = useState<AlertStatusType>(null)
    const [alertWarningIcon, setWarning] = useState<AlertStatusType>(null)
    const [alertPaperCss, setPaperCss] = useState<any>(null)
    const [alertPaperElevation, setPaperElevation] = useState<number>(null)
    const [shouldDisplayToast, setShouldDisplayToast] = useState<boolean>(false)

    const setAlertInfoIcon = useCallback((infoIcon: AlertStatusType) => {
        setInfo(infoIcon)
    }, [])

    const setAlertErrorIcon = useCallback((errorIcon: AlertStatusType) => {
        setError(errorIcon)
    }, [])

    const setAlertWarningIcon = useCallback((warningIcon: AlertStatusType) => {
        setWarning(warningIcon)
    }, [])

    const setAlertSuccessIcon = useCallback((successIcon: AlertStatusType) => {
        setSuccess(successIcon)
    }, [])

    const setAlertPaperCss = useCallback((css: any) => {
        setPaperCss(css)
    }, [])

    const setAlertPaperElevation = useCallback((elevation: number) => {
        setPaperElevation(elevation)
    }, [])

    const showToast = useCallback(
        (
            message: string,
            type: AlertType = AlertType.INFO,
            duration: AlertDuration = AlertDuration.LONG,
            actionUrl = null
        ) => {
            setToastInfo({ message, type, duration, actionUrl })
            setShouldDisplayToast(true)
        },
        []
    )

    const _handleErrorClose = () => setShouldDisplayToast(false)

    const providerValue = {
        alertInfoIcon,
        alertSuccessIcon,
        alertWarningIcon,
        alertErrorIcon,
        alertPaperCss,
        alertPaperElevation,
        setAlertInfoIcon,
        setAlertSuccessIcon,
        setAlertWarningIcon,
        setAlertErrorIcon,
        setAlertPaperCss,
        setAlertPaperElevation,
        isLoading,
        showLoading,
        showToast
    }

    return (
        <AlertContext.Provider value={providerValue}>
            <Toast
                open={shouldDisplayToast}
                onClose={_handleErrorClose}
                severity={toast.type}
                message={toast.message}
                actionUrl={toast.actionUrl}
            />
            {children}
            <BackdropLoader isLoading={isLoading} />
        </AlertContext.Provider>
    )
}

export default AlertProvider
