import React, { FC } from 'react'

interface Props {
    props?: React.SVGProps<SVGSVGElement>
    color: string
}

const SvgIconControlClear: FC<Props> = ({ props, color }) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <rect x="0.5" y="0.5" width="15" height="15" stroke={color} stroke-dasharray="3 3" />
            <path
                d="M11 4.9375C8.75996 4.9375 6.9375 6.75996 6.9375 9C6.9375 11.24 8.75996 13.0625 11 13.0625C13.24 13.0625 15.0625 11.24 15.0625 9C15.0625 6.75996 13.24 4.9375 11 4.9375ZM12.692 10.25L12.25 10.692L11 9.44199L9.75 10.692L9.308 10.25L10.558 9L9.308 7.75L9.75 7.30801L11 8.55801L12.25 7.30801L12.692 7.75L11.442 9L12.692 10.25Z"
                fill={color}
            />
        </svg>
    )
}

export default SvgIconControlClear
