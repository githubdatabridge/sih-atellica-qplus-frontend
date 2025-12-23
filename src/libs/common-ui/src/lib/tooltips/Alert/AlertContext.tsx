import React, { ReactNode, useContext, Dispatch } from 'react'

export enum AlertType {
    INFO = 'info',
    ERROR = 'error',
    SUCCESS = 'success',
    WARNING = 'warning'
}

export enum AlertDuration {
    SHORT = 1500,
    LONG = 5000,
    VERY_LONG = 10000
}

export const toastDefaults = {
    message: '',
    type: AlertType.INFO,
    duration: AlertDuration.LONG,
    actionUrl: null
}

export type AlertStatusType = {
    icon?: ReactNode
    bgColor?: string
    fillColor?: string
    titleCss?: any
    contentCss?: any
    actionButtonCss?: any
}

type AlertContextType = {
    alertInfoIcon?: AlertStatusType | null
    alertErrorIcon?: AlertStatusType | null
    alertWarningIcon?: AlertStatusType | null
    alertSuccessIcon?: AlertStatusType | null
    alertPaperCss?: any
    alertPaperElevation?: number
    filterNode?: AlertStatusType | null
    isLoading: boolean // show backdrop loader
    setAlertInfoIcon?: (infoIcon: AlertStatusType) => void
    setAlertErrorIcon?: (errorIcon: AlertStatusType) => void
    setAlertSuccessIcon?: (successIcon: AlertStatusType) => void
    setAlertWarningIcon?: (warningIcon: AlertStatusType) => void
    setAlertPaperElevation?: (elevation: number) => void
    setAlertPaperCss?: (css: any) => void
    showLoading: Dispatch<any>
    showToast: (
        message: string,
        type?: AlertType,
        duration?: AlertDuration,
        actionUrl?: string | null
    ) => void
}

export const AlertContext = React.createContext<AlertContextType>({
    isLoading: true, // show backdrop loader,
    alertInfoIcon: null,
    alertWarningIcon: null,
    alertSuccessIcon: null,
    alertErrorIcon: null,
    alertPaperCss: null,
    alertPaperElevation: null,
    setAlertInfoIcon: _infoIcon => {
        throw new Error('setInfoIcon() not implemented')
    },
    setAlertWarningIcon: _warningIcon => {
        throw new Error('setWarningIcon() not implemented')
    },
    setAlertErrorIcon: _infoIcon => {
        throw new Error('setErrorIcon() not implemented')
    },
    setAlertSuccessIcon: _infoIcon => {
        throw new Error('setSuccessIcon() not implemented')
    },
    setAlertPaperCss: _css => {
        throw new Error('setAlertPaperCss() not implemented')
    },
    setAlertPaperElevation: _elevation => {
        throw new Error('setAlertPaperElevation() not implemented')
    },
    showLoading: () => {
        throw new Error('showLoading() not implemented')
    },
    showToast: () => {
        throw new Error('showToast() not implemented')
    }
})

export const useAlertContext = (): AlertContextType => {
    return useContext(AlertContext)
}
