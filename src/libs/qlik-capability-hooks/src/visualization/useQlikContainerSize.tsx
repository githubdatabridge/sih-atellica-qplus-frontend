import { useState, useEffect } from 'react'

const useQlikContainerSize = myRef => {
    const getDimensions = () => ({
        widthC: myRef?.current?.offsetWidth,
        heightC: myRef?.current?.offsetHeight
    })

    const [dimensions, setDimensions] = useState({ widthC: 0, heightC: 0 })

    useEffect(() => {
        const handleResize = () => {
            const dimensions = getDimensions()
            setDimensions(dimensions)
        }

        if (myRef.current) {
            setDimensions(getDimensions())
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [myRef])

    return dimensions
}

export default useQlikContainerSize
