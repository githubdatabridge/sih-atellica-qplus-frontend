import * as React from 'react'

function SvgArrowDown(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12.0001 21.749C17.3846 21.749 21.7501 17.3835 21.7501 11.999C21.7501 6.61449 17.3846 2.24902 12.0001 2.24902C6.61559 2.24902 2.25012 6.61449 2.25012 11.999C2.25012 17.3835 6.61559 21.749 12.0001 21.749ZM8.2459 11.249L11.2501 14.2293V7.21777H12.7501V14.2293L15.7543 11.249L16.8109 12.3135L12.0001 17.0868L7.18934 12.3131L8.2459 11.249Z"
                fill="#cf4784"
            />
        </svg>
    )
}

export default SvgArrowDown
