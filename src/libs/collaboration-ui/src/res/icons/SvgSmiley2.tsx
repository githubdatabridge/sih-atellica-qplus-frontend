import * as React from 'react'

function SvgSmiley2(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" {...props}>
            <g data-name="Gruppe 1">
                <g data-name="Pfad 1" fill="none">
                    <path d="M50 0A50 50 0 110 50 50 50 0 0150 0z" />
                    <path
                        d="M50 4a45.852 45.852 0 00-32.527 13.473 45.852 45.852 0 00-9.86 14.623C5.216 37.764 4 43.788 4 50s1.216 12.236 3.613 17.904a45.852 45.852 0 009.86 14.623 45.852 45.852 0 0014.623 9.86C37.764 94.784 43.788 96 50 96s12.236-1.216 17.904-3.613a45.852 45.852 0 0014.623-9.86 45.852 45.852 0 009.86-14.623C94.784 62.236 96 56.212 96 50s-1.216-12.236-3.613-17.904a45.852 45.852 0 00-9.86-14.623 45.852 45.852 0 00-14.623-9.86C62.236 5.216 56.212 4 50 4m0-4c27.614 0 50 22.386 50 50s-22.386 50-50 50S0 77.614 0 50 22.386 0 50 0z"
                        fill={props.fill || '#707070'}
                    />
                </g>
                <path
                    data-name="Pfad 2"
                    d="M36 24a9 9 0 11-9 9 9 9 0 019-9z"
                    fill={props.fill || '#707070'}
                />
                <path
                    data-name="Pfad 3"
                    d="M62 24a9 9 0 11-9 9 9 9 0 019-9z"
                    fill={props.fill || '#707070'}
                />
                <path
                    data-name="Pfad 4"
                    d="M23.5 55.5h26"
                    fill="none"
                    stroke={props.fill || '#707070'}
                    strokeWidth={4}
                />
            </g>
        </svg>
    )
}

export default SvgSmiley2
