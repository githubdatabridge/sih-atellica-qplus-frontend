import { useState, useCallback } from 'react'

export const useQlikLayout = () => {
    const [qAction, setQAction] = useState<any>({
        loading: false,
        qResponse: null,
        error: null
    })

    const setLayout = useCallback(
        async (model: any, callback: any, invalidation = true, key = 0) => {
            try {
                setQAction({ loading: true, qResponse: null, error: null })
                if (invalidation) model?.on('changed', key === 0 ? callback : callback(key))
                const r = await model.getLayout()
                setQAction({ loading: false, qResponse: { r }, error: null })
                return r
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
            }
        },
        []
    )

    return { qAction, setLayout }
}

export default useQlikLayout
