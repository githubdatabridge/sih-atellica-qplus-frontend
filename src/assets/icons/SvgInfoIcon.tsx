import * as React from 'react'

function SvgInfoIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="24"
            height="24"
            viewBox="0 0 32 32">
            <defs>
                <clipPath id="b">
                    <rect width="32" height="32" />
                </clipPath>
            </defs>
            <g id="a">
                <circle fill="#1a1a1a" cx="12" cy="12" r="12" transform="translate(3.999 4)" />
                <g transform="translate(-162 -156)">
                    <rect fill="#ebebeb" width="4" height="2" transform="translate(174.999 168)" />
                    <rect fill="#ebebeb" width="6" height="2" transform="translate(174.999 177)" />
                    <rect fill="#ebebeb" width="2" height="2" transform="translate(176.999 164)" />
                    <rect fill="#ebebeb" width="2" height="7" transform="translate(176.999 170)" />
                </g>
                <rect fill="none" width="32" height="32" />
            </g>
        </svg>
    )
}

export default SvgInfoIcon
