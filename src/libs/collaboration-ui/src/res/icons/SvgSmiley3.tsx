import * as React from 'react'

function SvgSmiley3(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" {...props}>
            <g data-name="Gruppe 1">
                <g data-name="Pfad 66" fill="none">
                    <path d="M50 0A50 50 0 110 50 50 50 0 0150 0z" />
                    <path
                        d="M50 4a45.852 45.852 0 00-32.527 13.473 45.852 45.852 0 00-9.86 14.623C5.216 37.764 4 43.788 4 50s1.216 12.236 3.613 17.904a45.852 45.852 0 009.86 14.623 45.852 45.852 0 0014.623 9.86C37.764 94.784 43.788 96 50 96s12.236-1.216 17.904-3.613a45.852 45.852 0 0014.623-9.86 45.852 45.852 0 009.86-14.623C94.784 62.236 96 56.212 96 50s-1.216-12.236-3.613-17.904a45.852 45.852 0 00-9.86-14.623 45.852 45.852 0 00-14.623-9.86C62.236 5.216 56.212 4 50 4m0-4c27.614 0 50 22.386 50 50s-22.386 50-50 50S0 77.614 0 50 22.386 0 50 0z"
                        fill={props.fill || '#707070'}
                    />
                </g>
                <path
                    data-name="Pfad 64"
                    d="M36 24a9 9 0 11-9 9 9 9 0 019-9z"
                    fill={props.fill || '#707070'}
                />
                <path
                    data-name="Pfad 63"
                    d="M29 68.659s23.324-8.234 42.5 0"
                    fill="none"
                    stroke={props.fill || '#707070'}
                    strokeWidth={4}
                />
                <path
                    data-name="Pfad 65"
                    d="M62 24a9 9 0 11-9 9 9 9 0 019-9z"
                    fill={props.fill || '#707070'}
                />
                <path
                    data-name="Pfad 62"
                    d="M62.043 40.387h0l.988 1.874a18.8 18.8 0 005.182 9.33c4.336 4.315 4.482 12.728-6.17 13.409h.988"
                    fill="none"
                    stroke={props.fill || '#707070'}
                    strokeWidth={4}
                />
                <path
                    data-name="Pfad 61"
                    d="M63.6 40.4l-3.757 7.049a29.213 29.213 0 01-3.015 4.145c-4.375 4.354-4.484 12.881 6.17 13.408"
                    fill="none"
                    stroke={props.fill || '#707070'}
                    strokeWidth={4}
                />
            </g>
        </svg>
    )
}

export default SvgSmiley3
