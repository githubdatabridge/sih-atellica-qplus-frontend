import * as React from 'react'

function SvgIdea(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={20} height={20} {...props} viewBox="0 0 24 24" preserveAspectRatio="none">
            <defs>
                <path
                    id="idea_svg__a"
                    d="M12.003 3c-.46 0-.93.04-1.4.14-2.76.53-4.96 2.76-5.48 5.52-.48 2.61.48 5.01 2.22 6.56.43.38.66.91.66 1.47V19c0 1.1.9 2 2 2h.28a1.98 1.98 0 003.44 0h.28c1.1 0 2-.9 2-2v-2.31c0-.55.22-1.09.64-1.46a6.956 6.956 0 002.36-5.23c0-3.87-3.13-7-7-7zm2 16h-4v-1h4v1zm0-2h-4v-1h4v1zm-1.5-5.59V14h-1v-2.59l-1.83-1.82.71-.71 1.62 1.62 1.62-1.62.71.71-1.83 1.82z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <mask id="idea_svg__b" fill="#fff">
                    <use xlinkHref="#idea_svg__a" />
                </mask>
                <use fillRule="nonzero" xlinkHref="#idea_svg__a" />
                <g fill={props.fill || '#707070'} mask="url(#idea_svg__b)">
                    <path d="M0 0h24v24H0z" />
                </g>
            </g>
        </svg>
    )
}

export default SvgIdea
