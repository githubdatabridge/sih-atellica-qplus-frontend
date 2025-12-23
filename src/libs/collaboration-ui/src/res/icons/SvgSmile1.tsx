import * as React from 'react'

function SvgSmile1(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={20} height={20} {...props} viewBox="0 0 24 24" preserveAspectRatio="none">
            <defs>
                <path
                    id="smile-1_svg__a"
                    d="M11.99 2C17.52 2 22 6.48 22 12s-4.48 10-10.01 10C6.47 22 2 17.52 2 12S6.47 2 11.99 2zM12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM8.55 14c.7 1.19 1.97 2 3.45 2 1.48 0 2.76-.81 3.45-2h1.67a5.495 5.495 0 01-10.24 0zm6.95-6l.144.007A1.5 1.5 0 1115.5 8zm-7 0l.144.007A1.5 1.5 0 118.5 8z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <mask id="smile-1_svg__b" fill="#fff">
                    <use xlinkHref="#smile-1_svg__a" />
                </mask>
                <use fillRule="nonzero" xlinkHref="#smile-1_svg__a" />
                <g fill={props.fill || '#707070'} mask="url(#smile-1_svg__b)">
                    <path d="M0 0h24v24H0z" />
                </g>
            </g>
        </svg>
    )
}

export default SvgSmile1
