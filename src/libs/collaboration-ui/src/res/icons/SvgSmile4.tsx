import * as React from 'react'

function SvgSmile4(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={20} height={20} {...props} viewBox="0 0 24 24" preserveAspectRatio="none">
            <defs>
                <path
                    id="smile-4_svg__a"
                    d="M2.595 11.54l.679.373c.17.094.307.253.362.455.023.085.019.044.145 2.523l5.908-1.592c.56-.147 1.13.17 1.276.71.147.54-.185 1.096-.744 1.243l-2.716.75.135.494a.915.915 0 01.022.371l-.718 3.358a1.033 1.033 0 01-.907.86l-3.682.448c-.512.058-.985-.222-1.118-.71l-1.203-4.42a.992.992 0 01.109-.769l2.452-4.094zM9.99 0C15.52 0 20 4.48 20 10S15.52 20 9.99 20c-.516 0-1.023-.04-1.518-.115l.43-1.96A7.998 7.998 0 0018 10c0-4.42-3.58-8-8-8a7.998 7.998 0 00-7.99 8.417L.409 12.839C.143 11.939 0 10.986 0 10 0 4.48 4.47 0 9.99 0zM11 10a1 1 0 010 2H9a1 1 0 010-2h2zm2.5-4l.144.007A1.5 1.5 0 1113.5 6zm-7 0l.144.007A1.5 1.5 0 116.5 6z"
                />
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(2 2)">
                <mask id="smile-4_svg__b" fill="#fff">
                    <use xlinkHref="#smile-4_svg__a" />
                </mask>
                <use fillRule="nonzero" xlinkHref="#smile-4_svg__a" />
                <g fill={props.fill || '#707070'} mask="url(#smile-4_svg__b)">
                    <path d="M-2-2h24v24H-2z" />
                </g>
            </g>
        </svg>
    )
}

export default SvgSmile4
