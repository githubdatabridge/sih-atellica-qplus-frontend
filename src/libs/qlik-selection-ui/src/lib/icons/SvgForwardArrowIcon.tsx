import React, { FC } from 'react'

interface Props {
    props?: React.SVGProps<SVGSVGElement>
    color?: string
    width?: string
    height?: string
}

const SvgForwardArrowIcon: FC<Props> = ({ props, color, width, height }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 75 67.127">
            <g id="Gruppe_48" data-name="Gruppe 48" transform="translate(2 2)">
                <path
                    id="Pfad_128"
                    data-name="Pfad 128"
                    fill="none"
                    stroke="gray"
                    strokeMiterlimit={10}
                    strokeWidth="4px"
                    d="M2167.718,4202.563a31.36,31.36,0,1,0-31.359,31.563"
                    transform="translate(-2105 -4171)"
                />
                <path
                    id="Pfad_129"
                    data-name="Pfad 129"
                    fill="gray"
                    d="M2037.055,4468.973l10.943,16.5,10.943-16.5"
                    transform="translate(-1985.941 -4437.717)"
                />
            </g>
        </svg>
    )
}

export default SvgForwardArrowIcon
