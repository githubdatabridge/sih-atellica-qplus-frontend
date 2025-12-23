import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

const useReplaceQueryParams = () => {
    const navigate = useNavigate()

    const setReplaceQueryParams = useCallback(
        (rId: number, type: string, op?: string, toPath?: string) => {
            const { pathname } = new URL(window.location.href)
            const isHashRoute = window.location.hash?.startsWith('#')
            const path = isHashRoute ? window.location.hash.substring(2) : pathname
            const params = new URLSearchParams({
                type,
                reportId: `${rId}`
            })
            if (op) {
                params.append('op', op)
            }
            if (!window.location.href.includes(`${params}`)) {
                const newPath = path.split('?')[0] || path
                navigate(`${isHashRoute ? '/' : ''}${newPath}?${params}`, { replace: true })
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        []
    )

    return { setReplaceQueryParams }
}

export default useReplaceQueryParams
