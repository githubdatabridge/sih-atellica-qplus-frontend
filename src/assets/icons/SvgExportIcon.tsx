import * as React from 'react'

function SvgExportIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            id="Icons"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 32 32">
            <rect
                fill="#1a1a1a"
                x="8"
                y="2"
                width="2"
                height="6"
                transform="translate(14 -4) rotate(90)"
            />
            <rect
                fill="#1a1a1a"
                x="-4"
                y="15"
                width="22"
                height="2"
                transform="translate(23 9) rotate(90)"
            />
            <rect
                fill="#1a1a1a"
                x="8"
                y="24"
                width="2"
                height="6"
                transform="translate(36 18) rotate(90)"
            />
            <polygon fill="#1a1a1a" points="19 10 25 16 19 22 19 10" />
            <rect
                fill="#1a1a1a"
                x="12.5"
                y="11.5"
                width="4"
                height="9"
                transform="translate(30.5 1.5) rotate(90)"
            />
            <rect fill="none" width="32" height="32" />
        </svg>
    )
}

export default SvgExportIcon
