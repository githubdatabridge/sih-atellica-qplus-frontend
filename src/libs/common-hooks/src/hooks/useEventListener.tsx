import { useEffect, useRef } from 'react'

export const useEventListener = (
    eventType = '',
    listener = () => null,
    target = null,
    options = null
) => {
    const savedListener = useRef<any>(null)

    useEffect(() => {
        savedListener.current = listener
    }, [listener])

    useEffect(() => {
        if (!target?.addEventListener) return

        const eventListener = event => savedListener.current(event)

        target.addEventListener(eventType, eventListener, options)

        return () => {
            target.removeEventListener(eventType, eventListener, options)
        }
    }, [eventType, target, options])
}
