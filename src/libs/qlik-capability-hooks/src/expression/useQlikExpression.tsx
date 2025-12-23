import { useState, useRef, useEffect, useCallback } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'

import useQlikCreateGenericObject from '../app/useQlikCreateGenericObject'
import useQlikLayout from '../object/useQlikLayout'

export interface QlikExpressionProps {
    qlikAppId?: string
    expressions: string[]
    invalidation?: boolean
    isCalculated?: boolean
}

const useQlikExpression = ({
    qlikAppId,
    expressions,
    invalidation = true,
    isCalculated = true
}: QlikExpressionProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { qAppId } = useQlikApp(qlikAppId)
    const { qAppMap } = useQlikAppContext()
    const { setGenericObject } = useQlikCreateGenericObject()
    const { setLayout } = useQlikLayout()

    const [kpis, setKpis] = useState<string[]>([])
    const kpiIds = useRef<string[]>(expressions.map(_e => uuidv4())).current
    const qModel = useRef<any>(null)
    const qTimeoutIdRef = useRef<any>(0)

    const updateKpi = useCallback(async () => {
        try {
            setIsLoading(true)
            if (!qModel.current) return

            const kpiLayout = await (qModel.current as any).getLayout()
            if (kpiLayout) {
                const newKpiIds = kpiIds?.map(uuid => kpiLayout[uuid])
                setKpis(newKpiIds)
                setIsLoading(false)
            }
        } finally {
            setIsLoading(false)
        }
    }, [kpiIds, setKpis, setIsLoading])

    const initializeKpi = useCallback(async () => {
        try {
            setIsLoading(true)
            const qlikExpressions: any = expressions.reduce(
                (prev: any, qStringExpression: any, index: number) => ({
                    ...prev,
                    [kpiIds[index]]: { qStringExpression }
                }),
                {}
            )

            qModel.current = await setGenericObject(qlikExpressions, qAppId)

            if (!qModel.current) initializeKpi()

            if (qModel.current) {
                const layout = await setLayout(
                    qModel.current,
                    debounceCallbackQlikData,
                    invalidation
                )
                if (layout) {
                    const newKpiIds = kpiIds.map(uuid => layout[uuid])
                    setKpis(newKpiIds)
                }
            }
        } finally {
            setIsLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expressions, invalidation, kpiIds, qAppId, setKpis])

    const debounceCallbackQlikData = (timeout = 1000) => {
        if (qTimeoutIdRef.current) {
            clearTimeout(qTimeoutIdRef.current) // Cancel the previous execution
        }
        qTimeoutIdRef.current = setTimeout(() => {
            updateKpi()
            qTimeoutIdRef.current = null // Reset the timeout ID
        }, timeout)
    }

    useEffect(() => {
        if (qAppMap.size > 0) {
            if (!isCalculated) return
            initializeKpi()
        }
        return () => {
            const app = qAppMap.get(qAppId)
            const m = qModel.current
            if (m) {
                m?.removeAllListeners()
                app?.qApi?.destroySessionObject(m.id)
                qModel.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qAppMap])

    return { qIsLoading: isLoading, qKpis: kpis }
}

export default useQlikExpression
