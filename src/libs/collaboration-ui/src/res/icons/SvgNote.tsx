import * as React from 'react'

function SvgNote(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={24} height={24} {...props}>
            <defs>
                <path
                    id="note_svg__a"
                    d="M3.019 3v2.04c-.51.112-.938.6-.995 1.137l-.007.123V13h.012v4.536c0 .66.496 1.372 1.087 1.453l.112.008H8V13h6.013V6.3c0-.618-.508-1.206-1.103-1.278l-.12-.007h-2.783V3h3.27c1.447.002 2.63 1.157 2.717 2.615l.005.17V14l-6.998 7L9 20.996V21H2.7C1.263 20.998.091 19.77.004 18.22L0 18.04V5.783c.002-1.48 1.131-2.69 2.556-2.779L2.722 3h.297zm8.988 12H10v2.001L12.007 15zM9 0v2.005H7.984v3.003H9V7l-1.572.005L6.5 12l-.885-4.995H4V5.008h.997V2.005H4V0h5z"
                />
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(4 1)">
                <mask id="note_svg__b" fill="#fff">
                    <use xlinkHref="#note_svg__a" />
                </mask>
                <use fill="#707070" fillRule="nonzero" xlinkHref="#note_svg__a" />
                <g fill="#707070" mask="url(#note_svg__b)">
                    <path d="M-4-1h24v24H-4z" />
                </g>
            </g>
        </svg>
    )
}

export default SvgNote
