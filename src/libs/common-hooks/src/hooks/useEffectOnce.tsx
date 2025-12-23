import { useEffect } from 'react'

export function useEffectOnce(cb) {
    useEffect(cb, [])
}
