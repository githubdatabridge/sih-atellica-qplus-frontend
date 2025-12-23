const SvgSpinner = props => (
    <svg
        fill="none"
        viewBox="0 0 56 47"
        height={200}
        width={200}
        style={{
            background: '0 0',
            shapeRendering: 'auto'
        }}
        {...props}>
        <g
            className="ldl-scale"
            style={{
                transformOrigin: '50% 50%',
                transform: 'rotate(0deg) scale(.48,.48)'
            }}>
            <g
                className="ldl-ani"
                style={{
                    transformOrigin: '28px 23.5px',
                    transform: 'matrix(1,0,0,1,0,0)',
                    animation:
                        '1.28205s linear 0s infinite normal forwards running bounce-eaf5c5d0-78bb-4e0c-9a93-7f4ed87cb643'
                }}>
                <g className="ldl-layer">
                    <path
                        fill="#fff"
                        d="m14.187 19.677 9.864-15.22 2.507 4.733-7.906 12.2-13.66 21.078-3.957-2.498 13.152-20.293Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                        style={{
                            fill: '#fff'
                        }}
                        className="ldl-ani"
                    />
                </g>
                <g className="ldl-layer">
                    <path
                        fill="#F0C132"
                        d="m41.954 19.592.003-.004L31.93 3.457l-2.462 4.96 8.034 12.929-.003.004 13.884 22.34 3.935-2.59-13.365-21.508Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                        style={{
                            fill: '#f0c132'
                        }}
                        className="ldl-ani"
                    />
                </g>
            </g>
        </g>
        <style id="bounce-eaf5c5d0-78bb-4e0c-9a93-7f4ed87cb643">
            {
                '@keyframes bounce-eaf5c5d0-78bb-4e0c-9a93-7f4ed87cb643{0%{animation-timing-function:cubic-bezier(.1361,.2514,.2175,.8786);transform:translate(0,0) scaleY(1)}37%{animation-timing-function:cubic-bezier(.7674,.1844,.8382,.7157);transform:translate(0,-39.96px) scaleY(1)}72%{animation-timing-function:cubic-bezier(.1118,.2149,.2172,.941);transform:translate(0,0) scaleY(1)}87%{animation-timing-function:cubic-bezier(.7494,.2259,.8209,.6963);transform:translate(0,19.900000000000002px) scaleY(.602)}to{transform:translate(0,0) scaleY(1)}}'
            }
        </style>
    </svg>
)

export default SvgSpinner
