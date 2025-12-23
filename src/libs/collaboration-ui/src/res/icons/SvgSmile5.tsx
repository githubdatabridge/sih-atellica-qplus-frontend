import * as React from 'react'

function SvgSmile5(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={20} height={20} {...props} viewBox="0 0 24 24" preserveAspectRatio="none">
            <defs>
                <path
                    id="smile-5_svg__a"
                    d="M9.99 0C15.52 0 20 4.48 20 10S15.52 20 9.99 20C4.47 20 0 15.52 0 10S4.47 0 9.99 0zM10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 9c2.33 0 4.32 1.45 5.12 3.5h-1.67c-.69-1.19-1.97-2-3.45-2-1.48 0-2.75.81-3.45 2H4.88C5.68 12.45 7.67 11 10 11zm3.5-5l.144.007A1.5 1.5 0 1113.5 6zm-7 0l.144.007A1.5 1.5 0 116.5 6z"
                />
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(2 2)">
                <mask id="smile-5_svg__b" fill="#fff">
                    <use xlinkHref="#smile-5_svg__a" />
                </mask>
                <use fillRule="nonzero" xlinkHref="#smile-5_svg__a" />
                <g fill={props.fill || '#707070'} mask="url(#smile-5_svg__b)">
                    <path d="M-2-2h24v24H-2z" />
                </g>
            </g>
        </svg>
    )
}

export default SvgSmile5
