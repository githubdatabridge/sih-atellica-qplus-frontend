import ContentLoader, { Instagram, Facebook } from 'react-content-loader'

export const MyFacebookLoader = () => (
    <Facebook width={450} height={215} style={{ width: '100%' }} />
)
export const MyInstagramLoader = () => <Instagram />

export const ChartLoader = (widthC: number, heightC: number) => {
    // Ensure a minimum height of 20px if height is less than 100
    const updatedHeight = heightC < 80 ? 40 : heightC

    // Define the height and spacing for the additional rects
    const rectHeight = Math.min(10, updatedHeight / 5) // Dynamic rect height based on total height
    const spacing = 10 // Spacing between the rects
    const totalAvailableHeight = updatedHeight - rectHeight // Height for additional rects (excluding the main rect)

    // Calculate the number of additional rects that fit in the available height
    const numAdditionalRects = Math.floor(totalAvailableHeight / (rectHeight * 2 + spacing))

    // Create an array for dynamic rect positions
    const additionalRects = Array.from({ length: numAdditionalRects }, (_, index) => ({
        y: (rectHeight + spacing) * (index + 1) // Position each rect dynamically
    }))

    return (
        <ContentLoader height={updatedHeight} style={{ width: '100%' }}>
            {/* Main Rect */}
            <rect
                x="0"
                y="0"
                rx="5"
                ry="5"
                width={numAdditionalRects > 0 ? '80%' : '100%'}
                height={updatedHeight}
            />

            {/* Small fixed rect */}
            {numAdditionalRects > 0 && (
                <rect x="83%" y="0" rx="4" ry="4" width="17%" height={rectHeight} />
            )}

            {/* Render additional rects dynamically based on available height */}
            {additionalRects.map((rect, index) => (
                <rect
                    key={index}
                    x="83%"
                    y={rect.y}
                    rx="3"
                    ry="3"
                    width="17%"
                    height={rectHeight}
                />
            ))}
        </ContentLoader>
    )
}
export const KpiChartLoader = () => (
    <ContentLoader style={{ width: '100%', marginTop: '20px' }}>
        {/* Only SVG shapes */}
        <rect x="10%" y="0" rx="5" ry="5" width="80%" height={10} />
        <rect x="20%" y="25" rx="3" ry="3" width="60%" height={10} />
        <rect x="20%" y="50" rx="3" ry="3" width="60%" height={30} />
        <rect x="10%" y="95" rx="3" ry="3" width="80%" height={10} />
        <rect x="15%" y="115" rx="3" ry="3" width="70%" height={10} />
    </ContentLoader>
)

export const ReactionLoader = () => (
    <ContentLoader height={20} style={{ width: '100px', height: '20px' }}>
        {/* Only SVG shapes */}
        <circle cx="10" cy="10" r="5" />
        <circle cx="30" cy="10" r="5" />
        <circle cx="50" cy="10" r="5" />
        <circle cx="70" cy="10" r="5" />
    </ContentLoader>
)

export const ReactionSummaryLoader = () => (
    <ContentLoader height={20} style={{ width: '150px', height: '50px' }}>
        {/* Only SVG shapes */}
        <rect x="0" y="5" rx="5" ry="5" width="40%" height={10} />
        <rect x="0" y="25" rx="5" ry="5" width="100%" height={1} />
        <rect x="0%" y="35" rx="3" ry="3" width="100%" height={10} />
    </ContentLoader>
)

export const FilterLoader = (width?: any, height?: any, x?: any, y?: any, css?: any) => (
    <ContentLoader style={{ width: width || '100%', ...css }}>
        <rect x={x || '0%'} y={y || '5'} rx="3" ry="3" width="100%" height={height || '25'} />
    </ContentLoader>
)

export const ListLoader = (
    height: number,
    items: number,
    offset: number,
    itemHeight = 15,
    x = 0,
    rx = 3,
    ry = 3,
    width = '100%'
) => {
    const itemsLoader = []
    let start = 0
    for (let index = 0; index < items; index++) {
        if (index === 0) start = -offset
        itemsLoader.push(
            <rect
                key={`rect-${index}`}
                x={x}
                y={`${start + offset}`}
                rx={rx}
                ry={ry}
                width={width}
                height={itemHeight}
            />
        )
        start = start + offset
    }
    return (
        <ContentLoader style={{ width: width, height: `${height}px`, padding: 20 }}>
            {itemsLoader}
        </ContentLoader>
    )
}

export const CircleLoader = (
    items: number,
    offset: number,
    width: number,
    height: number,
    cy = 50,
    r = 50,
    css?: any
) => {
    const itemsLoader = []
    let start = 0
    for (let index = 0; index < items; index++) {
        if (index === 0) start = 0
        itemsLoader.push(<circle key={`circle-${index}`} cx={`${start + offset}`} cy={cy} r={r} />)
        start = start + offset
    }
    return (
        <ContentLoader style={{ ...css, width: `${width}px`, height: `${height}px` }}>
            {itemsLoader}
        </ContentLoader>
    )
}
