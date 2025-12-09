import * as React from "react";

function SvgFilterIcon(props: React.SVGProps<SVGSVGElement>) {
    const { width, height } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={width || "32"}
            height={height || "32"}
            viewBox="0 0 32 32">
            <defs>
                <clipPath id="b">
                    <rect width="32" height="32" />
                </clipPath>
            </defs>
            <g id="a">
                <path
                    fill={props?.fill || `#1a1a1a`}
                    d="M192,199H164l11.407,11h0v13l5.185-2.527V210h0Z"
                    transform="translate(-162 -195)"
                />
                <rect fill="none" width="32" height="32" />
            </g>
        </svg>
    );
}

export default SvgFilterIcon;
