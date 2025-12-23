import React, { FC } from 'react'

interface Props {
    props?: React.SVGProps<SVGSVGElement>
    color?: string
}

const SvgIconControlSelectAlternative: FC<Props> = ({ props, color = '#000' }) => {
    return (
        <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <rect x="0.5" y="0.5" width="15" height="16" stroke={color} stroke-dasharray="3 3" />
            <rect x="2.5" y="3.6875" width="4" height="4" stroke={color} />
            <rect x="9.5" y="3.6875" width="4" height="4" stroke={color} />
            <rect x="2.5" y="10.0625" width="4" height="4" stroke={color} />
            <rect x="9.5" y="10.0625" width="4" height="4" stroke={color} />
        </svg>
    )
}

export default SvgIconControlSelectAlternative
