import React, { ReactNode } from 'react'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { env } from 'env'

type RouterWrapperProp = {
    children: ReactNode
}

const RouterWrapper = ({ children }: RouterWrapperProp) => {
    const isBrowserRouter = env.REACT_APP_ROUTER === 'Hash'
    return isBrowserRouter ? (
        <BrowserRouter>{children}</BrowserRouter>
    ) : (
        <HashRouter>{children}</HashRouter>
    )
}

export default RouterWrapper
