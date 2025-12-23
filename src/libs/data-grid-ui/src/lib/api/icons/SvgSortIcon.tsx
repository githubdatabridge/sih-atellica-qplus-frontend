import React, { FC } from 'react'

interface Props {
    props?: React.SVGProps<SVGSVGElement>
    colorUp?: string
    colorDown?: string
}

const SvgSortIcon: FC<Props> = ({ props, colorUp, colorDown }) => {
    return (
        <svg
            width="24"
            height="37"
            viewBox="0 0 24 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M7 14.5L12 9.5L17 14.5H7Z" fill={colorUp || '#ECECEC'} />
            <path d="M17 22.5L12 27.5L7 22.5H17Z" fill={colorDown || '#ECECEC'} />
        </svg>
    )
}

export default SvgSortIcon
