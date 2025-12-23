import * as React from 'react'

function SvgChat(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" preserveAspectRatio="none" {...props}>
            <defs>
                <style>{`.chat_svg__cls-3{fill:none;stroke:${
                    props.fill || '#707070'
                };stroke-width:4px}`}</style>
                <path
                    id="ypk4p8eura"
                    d="M13.75 0C17.202 0 20 2.863 20 6.396v5.208C20 15.137 17.202 18 13.75 18H.694C.311 18 0 17.682 0 17.29V6.395C0 2.863 2.798 0 6.25 0h7.5zM13 2H7C3.94 2 2.099 3.732 2.004 6.705L2 6.95v8.501c0 .418.11.532.456.548l.1.002H13c3.025 0 4.9-1.808 4.996-4.711L18 11.05V6.949C18 3.869 16.09 2 13 2zm2 8v2H5v-2h10zm0-4v2H5V6h10z"
                />
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(2 3)">
                <mask id="c0doii79qb" fill="#fff">
                    <use xlinkHref="#ypk4p8eura" />
                </mask>
                <use fill={props.fill || '#707070'} xlinkHref="#ypk4p8eura" />
                <g fill={props.fill || '#707070'} mask="url(#c0doii79qb)">
                    <path
                        d="M0 0H24V24H0z"
                        transform="translate(-2 -3)"
                        className="chat_svg__cls-3"
                    />
                </g>
            </g>
        </svg>
    )
}

export default SvgChat
