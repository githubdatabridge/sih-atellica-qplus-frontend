import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

const useReplaceQueryParams = () => {
    const navigate = useNavigate()

    const setReplaceQueryParams = useCallback(
        (pId: number, type: string) => {
            const params = new URLSearchParams({
                type,
                pinwallId: `${pId}`
            })
            navigate(`?${params}`, { replace: true })
        },
        [navigate]
    )

    return { setReplaceQueryParams }
}

export default useReplaceQueryParams
