import React, { memo, FC, useState, useRef, useCallback } from 'react'

import { useMount, useUnmount } from 'react-use'

import { CircularProgress } from '@mui/material'

import { v4 as uuidv4 } from 'uuid'

import { useQlikContainerSize, useQlikVisualizationCreate } from '@libs/qlik-capability-hooks'
import { useQlikApp } from '@libs/qlik-providers'

export type TQSortCriterias = {
    autoSort?: boolean
    reverseSort?: boolean
    qSortByState?: number
    qSortByNumeric?: number
    qSortByFrequency?: number
    qSortByAscii?: number
    qSortByExpression?: number
    qSortByLoadOrder?: number
    qSortByGreyness?: number
    qExpression?: string
}
export interface IQlikSelectionNativeFieldTooltipProps {
    qlikAppId?: string
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    width?: string
    height?: string
    fieldName: string
    label: string
    sortCriterias: TQSortCriterias
}

// Reference found => https://github.com/qlik-oss/catwalk/blob/master/src/components/filterbox.jsx
const QlikSelectionNativeFieldTooltip: FC<IQlikSelectionNativeFieldTooltipProps> = React.memo(
    ({ qlikAppId, fieldName, sortCriterias, label, color = 'secondary', width, height }) => {
        const [isLoading, setIsLoading] = useState<boolean>(true)
        const [visualizationElementId] = useState(uuidv4())
        const [viz, setViz] = useState<any>(null)
        const { qAppId } = useQlikApp(qlikAppId)
        const { setVisualizationCreate } = useQlikVisualizationCreate()

        const qTargetRef = useRef<any>()
        const qVizRef = useRef<any>(null)

        const { widthC, heightC } = useQlikContainerSize(qTargetRef)

        const createViz = useCallback(
            async (vizType: string, columns: any[], options: any) => {
                try {
                    setIsLoading(true)

                    if (qVizRef.current) {
                        await qVizRef.current.close()
                    }

                    const opts = { ...(options || {}) }
                    const vizNew = await setVisualizationCreate(vizType, columns, opts, qAppId)
                    if (vizNew) {
                        qVizRef.current = vizNew.qVisualization
                        setViz(vizNew.qVisualization)
                    }

                    return vizNew
                } catch (error) {
                    console.log('Qplus Error', error)
                } finally {
                    setIsLoading(false)
                }
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
        )

        const vizHandler = useCallback(
            async vizOptions => {
                if (vizOptions?.vizType) {
                    const vizNew = await createViz(
                        vizOptions.vizType,
                        vizOptions.columns,
                        vizOptions.options
                    )
                    if (vizNew) {
                        qVizRef.current = vizNew.qVisualization
                        setViz(vizNew.qVisualization)
                    }
                    const element = document.getElementById(visualizationElementId)
                    if (visualizationElementId && vizNew && element) {
                        await vizNew.show(visualizationElementId)
                    }
                }
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [visualizationElementId]
        )

        useMount(async () => {
            // Create props to pass to Qlik Visualization Api for listbox object
            const baseOptions = {
                vizType: 'listbox',
                columns: [fieldName],
                options: {
                    showTitles: true,
                    title: label || fieldName,
                    qListObjectDef: {
                        qDef: {
                            autoSort: sortCriterias.autoSort,
                            reverseSort: sortCriterias.reverseSort
                        }
                    }
                }
            }

            // Construct the qSortCriterias object based on passed props
            const qSortCriterias = {
                ...(sortCriterias?.qSortByState && { qSortByState: sortCriterias.qSortByState }),
                ...(sortCriterias?.qSortByNumeric && {
                    qSortByNumeric: sortCriterias.qSortByNumeric
                }),
                ...(sortCriterias?.qSortByAscii && { qSortByAscii: sortCriterias.qSortByAscii }),
                ...(sortCriterias?.qSortByFrequency && {
                    qSortByFrequency: sortCriterias.qSortByFrequency
                }),
                ...(sortCriterias?.qSortByLoadOrder && {
                    qSortByLoadOrder: sortCriterias.qSortByLoadOrder
                }),
                ...(sortCriterias?.qSortByGreyness && {
                    qSortByGreyness: sortCriterias.qSortByGreyness
                }),
                ...(sortCriterias?.qSortByExpression && {
                    qSortByExpression: sortCriterias.qSortByExpression
                }),
                ...(sortCriterias?.qExpression && {
                    qExpression: sortCriterias.qExpression
                })
            }
            // If any sorting criteria is set, add it to the baseOptions
            if (Object.keys(qSortCriterias).length > 0) {
                baseOptions.options.qListObjectDef.qDef['qSortCriterias'] = [qSortCriterias]
            }

            await vizHandler(baseOptions)
        })

        useUnmount(() => {
            const vis = qVizRef.current || viz

            if (vis) {
                vis.close()
                qVizRef.current = null
                qTargetRef.current = null
            }
        })

        const renderViz = useCallback(
            () => {
                return (
                    <>
                        <div
                            id={visualizationElementId}
                            style={{
                                width: isLoading ? 0 : width || '325px',
                                height: isLoading ? 0 : height || '400px',
                                paddingTop: 4,
                                visibility: isLoading ? 'hidden' : 'visible',
                                zIndex: 99
                            }}
                        />
                        {isLoading ? (
                            <div
                                ref={qTargetRef}
                                style={{
                                    height: height || '400px',
                                    width: width || '325px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 99
                                }}>
                                <CircularProgress size={40} color={color} />
                            </div>
                        ) : null}
                    </>
                )
            }, // eslint-disable-next-line react-hooks/exhaustive-deps
            [visualizationElementId, qTargetRef, widthC, heightC, isLoading]
        )

        return renderViz()
    }
)

export default memo(QlikSelectionNativeFieldTooltip)
