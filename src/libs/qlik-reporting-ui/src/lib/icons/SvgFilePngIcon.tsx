import React, { FC } from 'react'

interface Props {
    color?: string
    props?: React.SVGProps<SVGSVGElement>
}

const SvgFilePngIcon: FC<Props> = ({ color, props }) => {
    return (
        <svg width={20} height={20} {...props}>
            <defs>
                <path
                    fill={color || '#08743B'}
                    d="M16 0H2C.9 0 0 .9 0 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM5 4a2 2 0 11.001 3.999A2 2 0 015 4zM2 14.018l2.926-2.404 1.489 1.19 5.902-4.786 2.194 1.787L16 8.615v5.403H2z"
                />
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(3 3)">
                <path d="M-3-3h24v24H-3z" fill={color || '#08743B'} />
            </g>
        </svg>
    )
}

export default SvgFilePngIcon
