import * as React from 'react'

function SvgExportPngIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={24} height={24} {...props}>
            <defs>
                <path
                    id="file-png_svg__a"
                    d="M16 0H2C.9 0 0 .9 0 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM5 4a2 2 0 11.001 3.999A2 2 0 015 4zM2 14.018l2.926-2.404 1.489 1.19 5.902-4.786 2.194 1.787L16 8.615v5.403H2z"
                />
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(3 3)">
                <mask id="file-png_svg__b" fill="#fff">
                    <use xlinkHref="#file-png_svg__a" />
                </mask>
                <use fill="#08743B" xlinkHref="#file-png_svg__a" />
                <g fill="#ABAEC0" mask="url(#file-png_svg__b)">
                    <path d="M-3-3h24v24H-3z" />
                </g>
            </g>
        </svg>
    )
}

export default SvgExportPngIcon
