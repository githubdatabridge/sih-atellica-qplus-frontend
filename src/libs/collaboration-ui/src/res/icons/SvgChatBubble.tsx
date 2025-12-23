import * as React from 'react'

function SvgChatBubble({ fill, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M3.418 14.843c.046-.171-.057-.409-.155-.58-.03-.052-.063-.101-.099-.149a7.805 7.805 0 01-1.289-4.297c-.014-4.385 3.622-7.943 8.118-7.943 3.921 0 7.194 2.717 7.96 6.323.114.534.172 1.08.172 1.626 0 4.391-3.496 8.005-7.992 8.005-.715 0-1.68-.18-2.206-.327a14.793 14.793 0 01-1.187-.395 1.215 1.215 0 00-.906.014l-2.65.957a.627.627 0 01-.182.047.377.377 0 01-.374-.38.62.62 0 01.023-.129l.767-2.772z"
                stroke={fill || '#fff'}
                strokeWidth={1.5}
                strokeMiterlimit={10}
                strokeLinecap="round"
            />
            <path d="M7 6h6v1H7V6zM7 9h6v1H7V9z" fill={fill || '#fff'} />
            <path d="M7 9h6v1H7V9z" fill={fill || '#fff'} />
            <path d="M7 9h6v1H7V9zM7 12h4v1H7v-1z" fill={fill || '#fff'} />
        </svg>
    )
}

export default SvgChatBubble
