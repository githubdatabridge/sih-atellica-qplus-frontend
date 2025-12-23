const SvgDelete = props => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props?.width ? props.width : 24}
        height={props?.height ? props.height : 24}
        viewBox="0 0 24 24">
        <defs>
            <clipPath id="b">
                <path d="M0 0h24v24H0z" />
            </clipPath>
            <style>{'.b{fill:#1a1a1a'}</style>
        </defs>
        <g
            id="a"
            style={{
                clipPath: 'url(#b)'
            }}>
            <path fill={'#000'} transform="translate(5.769 8.538)" d="M0 0h12.462v12.462H0z" />
            <path
                fill={'#000'}
                d="M37.077 245.3v-1.385h-4.154v1.385h-5.538v2.769h15.23V245.3Z"
                transform="translate(-23 -240.916)"
            />
            <path
                style={{
                    fill: 'none'
                }}
                d="M0 0h24v24H0z"
            />
        </g>
    </svg>
)

export default SvgDelete
