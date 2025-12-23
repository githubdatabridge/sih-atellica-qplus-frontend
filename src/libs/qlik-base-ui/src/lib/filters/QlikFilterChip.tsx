import React, { FC, useRef, useState } from 'react'

import { useMount, useUnmount } from 'react-use'

import { Tabs, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import {
    useQlikCreateList,
    useQlikGetListObjectData,
    useQlikFlattenListData,
    useQlikLayout
} from '@libs/qlik-capability-hooks'
import { useQlikApp } from '@libs/qlik-providers'

import { qlikDefFieldList } from './definitions/qlikDefFieldList'
import QlikFilterChipField from './QlikFilterChipField'

export interface IQlikFilterChipProps {
    qlikAppId?: string
    fieldName: string
    fieldTitle: string
    cssLocked?: any
    cssPossible?: any
    cssChipSelected?: any
    cssExcluded?: any
}

export const QlikFilterChip: FC<IQlikFilterChipProps> = ({
    qlikAppId,
    fieldName,
    fieldTitle,
    cssLocked,
    cssPossible,
    cssChipSelected,
    cssExcluded
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const { classes } = useStyles()
    const targetRef = useRef<any>()
    const { qApi, qAppId } = useQlikApp(qlikAppId)
    const { setListObjectData } = useQlikGetListObjectData()
    const { setFlattenListData } = useQlikFlattenListData()
    const { setCreateList } = useQlikCreateList()
    const { setLayout } = useQlikLayout()
    const [data, setData] = useState<any>([])
    const [model, setModel] = useState<any>(null)
    let qModel = useRef<any>(null).current

    const updateList = async () => {
        try {
            setIsLoading(true)
            if (!qModel) return
            const qLayout = await (qModel as any).getLayout()
            if (!qLayout) return
            const qData = await setListObjectData(
                '/qListObjectDef',
                qModel,
                qLayout.qListObject.qSize,
                qAppId
            )

            const data = setFlattenListData(qData, qAppId)
            setData(data)
            setModel(qModel)
        } catch (error) {
            console.log('Qplus Error', error)
        } finally {
            setIsLoading(false)
        }
    }

    useMount(async () => {
        setIsLoading(true)
        const qDefList = qlikDefFieldList(fieldName, 0, 1, 0)
        qModel = await setCreateList(qDefList, qAppId)
        await setLayout(qModel, updateList, true)
        await updateList()
        setIsLoading(false)
    })

    useUnmount(() => {
        const m = qModel || model
        if (m) {
            m.removeAllListeners()
            qApi.destroySessionObject(m.id)
        }
    })

    if (isLoading) return null

    return (
        <Tabs
            classes={{ root: classes.tabs }}
            ref={targetRef}
            value={false}
            onChange={() => undefined}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            indicatorColor="secondary"
            textColor="primary"
            aria-label="scrollable force tabs example">
            <QlikFilterChipField
                qlikAppId={qlikAppId}
                fieldName={fieldName}
                fieldTitle={fieldTitle}
                data={data}
                cssLocked={cssLocked}
                cssPossible={cssPossible}
                cssChipSelected={cssChipSelected}
                cssExcluded={cssExcluded}
            />
        </Tabs>
    )
}

export default QlikFilterChip

const useStyles = makeStyles()((theme: Theme) => ({
    tabs: { minHeight: 0, maxWidth: '950px', marginLeft: '-30px' }
}))
