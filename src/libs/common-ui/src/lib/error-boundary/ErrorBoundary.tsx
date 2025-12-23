import React, { Component, ErrorInfo, ReactNode } from 'react'

import ErrorPlaceholder from './ErrorPlaceholder'

export interface IErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

export interface IErrorBoundaryState {
    hasError: boolean
}

class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
    public state: IErrorBoundaryState = {
        hasError: false
    }

    public static getDerivedStateFromError(_: Error): IErrorBoundaryState {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback ? this.props.fallback : <ErrorPlaceholder />
        }

        return this.props.children
    }
}

export default ErrorBoundary
