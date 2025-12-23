import { useCallback } from 'react'

import charts from '../json/charts.json'

const useVizDefaultOptions = () => {
    const setVizDefaultOptions = useCallback((type: string) => {
        return charts[type]
    }, [])

    return { setVizDefaultOptions }
}

export default useVizDefaultOptions
