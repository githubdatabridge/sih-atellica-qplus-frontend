import React, { FC, useState, useRef } from 'react'

import { useMount, useUnmount } from 'react-use'

import { Accordion } from '@libs/common-ui'
import { useQlikApp } from '@libs/qlik-providers'

import QlikVisualizationCore from '../visualizations/QlikVisualizationCore'

export interface IQlikVisualizationListProps {
    qlikAppId?: string
    tags: string[]
}

const defMasterVizList = () => {
    const qDef = {
        qInfo: {
            qType: 'masterobject',
            qId: ''
        },
        qAppObjectListDef: {
            qType: 'masterobject',
            qData: {
                name: '/metadata/name',
                visualization: '/visualization',
                tags: '/metadata/tags'
            }
        }
    }
    return qDef
}

const QlikVisualizationList: FC<IQlikVisualizationListProps> = ({ qlikAppId, tags }) => {
    const { qEnigmaApi } = useQlikApp(qlikAppId)

    const [isLoading, setIsLoading] = useState<any>(true)
    const [model, setModel] = useState<any>(null)
    const [vizList, setVizList] = useState<any[]>([])

    let qModel = useRef<any>(null).current

    const contains = (
        haystack: { filter: (arg0: (v: any) => any) => { (): any; new (): any; length: any } },
        needles: string | any[]
    ) => {
        return (
            haystack.filter(v => {
                return needles.includes(v)
            }).length === needles.length
        )
    }

    useMount(async () => {
        const qFilteredItems: any[] = []
        qModel = await qEnigmaApi?.dApp.createSessionObject(defMasterVizList())

        if (!qModel) return

        const qLayout = await qModel.getLayout()
        const qItems = (qLayout as any).qAppObjectList.qItems

        qItems.forEach(
            (item: {
                qMeta: {
                    tags: {
                        filter: (arg0: (v: any) => any) => { (): any; new (): any; length: any }
                    }
                }
            }) => {
                if (contains(item.qMeta.tags, tags)) qFilteredItems.push(item)
            }
        )

        setModel(qModel)
        setVizList(qFilteredItems)
        setIsLoading(false)
    })

    useUnmount(() => {
        const m = qModel || model
        if (m) {
            m.removeAllListeners()
            m.close()
        }
    })

    const renderVizList = (): any[] => {
        const result = vizList.map((item, i) => {
            return {
                title: item.qMeta.title,
                component: (
                    <QlikVisualizationCore
                        enableFullscreen
                        id={item.qInfo.qId}
                        titleOptions={{
                            disableQlikNativeTitles: true
                        }}
                        height="250px"
                    />
                )
            }
        })
        return result
    }

    if (isLoading) return <></>

    return vizList.length > 0 ? (
        <Accordion panels={renderVizList()}></Accordion>
    ) : (
        <div>Sorry I can not help you this time! :-(</div>
    )
}

export default QlikVisualizationList
