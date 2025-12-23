import React, { FC } from 'react'

interface Props {
    props?: React.SVGProps<SVGSVGElement>
    color?: string
    width?: string
    height?: string
}

const SvgBackwardArrowIcon: FC<Props> = ({ props, color, width, height }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 75 67.126">
            <g id="Gruppe_47" data-name="Gruppe 47" transform="translate(-1966.998 -57.135)">
                <path
                    id="Pfad_128"
                    data-name="Pfad 128"
                    fill="none"
                    stroke="gray"
                    strokeMiterlimit={10}
                    strokeWidth="4px"
                    d="M2105,4202.563a31.36,31.36,0,1,1,31.359,31.563"
                    transform="translate(-127.72 -4111.865)"
                />
                <path
                    id="Pfad_129"
                    data-name="Pfad 129"
                    fill="gray"
                    d="M2058.941,4468.973l-10.943,16.5-10.943-16.5"
                    transform="translate(-70.057 -4378.583)"
                />
            </g>
        </svg>
    )
}

export default SvgBackwardArrowIcon
