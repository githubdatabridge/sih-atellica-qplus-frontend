import React, { ReactNode } from 'react'

export interface IConditionalWrapperProps {
    condition: boolean
    wrapper: (children: ReactNode) => JSX.Element
    children: ReactNode
}

const ConditionalWrapper = ({ condition, wrapper, children }: IConditionalWrapperProps) => (
    <>{condition ? wrapper(children) : children}</>
)

export default ConditionalWrapper
