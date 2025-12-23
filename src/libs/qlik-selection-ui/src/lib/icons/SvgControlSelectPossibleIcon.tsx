import React, { FC } from 'react'

interface Props {
    props?: React.SVGProps<SVGSVGElement>
    color?: string
}

const SvgIconControlSelectPossible: FC<Props> = ({ props, color = '#000' }) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <rect x="3.5" y="3.5" width="9" height="9" stroke={color} />
            <rect x="0.5" y="0.5" width="15" height="15" stroke={color} stroke-dasharray="3 3" />
        </svg>
    )
}

export default SvgIconControlSelectPossible
