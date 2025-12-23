const SvgDrag = props => (
    <svg
        id="Ebene_1"
        data-name="Ebene 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        {...props}>
        <defs>
            <style>{`.cls-1{fill:${props?.color ? props.color : '#1a1a1a'}}`}</style>
        </defs>
        <circle className="cls-1" cx={13} cy={8} r={2} />
        <circle className="cls-1" cx={13} cy={16} r={2} />
        <circle className="cls-1" cx={13} cy={24} r={2} />
        <circle className="cls-1" cx={19} cy={8} r={2} />
        <circle className="cls-1" cx={19} cy={16} r={2} />
        <circle className="cls-1" cx={19} cy={24} r={2} />
        <path
            style={{
                fill: 'none'
            }}
            d="M0 0h32v32H0z"
        />
    </svg>
)

export default SvgDrag
