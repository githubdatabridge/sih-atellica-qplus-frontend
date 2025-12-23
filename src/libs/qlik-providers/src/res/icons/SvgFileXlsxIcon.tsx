import * as React from 'react'

function SvgFileXlsxIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={24} height={24} {...props}>
            <defs>
                <path
                    id="file-xls_svg__a"
                    d="M16 0c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V2C0 .9.9 0 2 0zM7.423 4H3.844l3.55 4.665L3 14h3.54l2.527-3.284L11.474 14H15l-4.226-5.335L14.493 4h-3.64L9.086 6.537 7.423 4z"
                />
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(3 3)">
                <mask id="file-xls_svg__b" fill="#fff">
                    <use xlinkHref="#file-xls_svg__a" />
                </mask>
                <use fill="#08743B" xlinkHref="#file-xls_svg__a" />
                <g fill="#ABAEC0" mask="url(#file-xls_svg__b)">
                    <path d="M-3-3h24v24H-3z" />
                </g>
            </g>
        </svg>
    )
}

export default SvgFileXlsxIcon
