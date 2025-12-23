export const useRgbAsNumber = (): any => {
    const getRGB = str => {
        const match = str.match(
            /rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/
        )
        return match ? `${match[1]} ${match[2]} ${match[3]}` : {}
    }

    return { getRGB }
}
