import React, { FC, useEffect, useState, useCallback, useRef, ReactNode } from 'react'

import { useMount, useUnmount } from 'react-use'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import IconButton from '@mui/material/IconButton'

import { makeStyles } from 'tss-react/mui'

import { IconTooltip } from '@libs/common-ui'
import {
    useQlikFlattenListData,
    useQlikCreateList,
    useQlikLayout,
    useQlikFieldLock,
    useQlikGetListObjectData
} from '@libs/qlik-capability-hooks'
import { useQlikApp } from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import { defList } from './definitions/defList'
import QlikKpiAdvancedProgress from './QlikKpiAdvancedProgress'

export interface IQlikKpiAdvancedNavigatorProps {
    qlikAppId: string
    fieldName: string
    stateName?: string
    isFirstElementPreSelected?: boolean
    calcFieldName?: string
    themeMode?: string
    children: ReactNode
}

const QlikKpiAdvancedNavigator: FC<IQlikKpiAdvancedNavigatorProps> = ({
    qlikAppId,
    children,
    fieldName,
    calcFieldName,
    stateName = '$',
    isFirstElementPreSelected = false,
    themeMode = 'light'
}) => {
    const { qAppId, qApi } = useQlikApp(qlikAppId)
    const { qSelectionMap } = useQlikSelectionContext()
    const { setListObjectData } = useQlikGetListObjectData()
    const { setFlattenListData } = useQlikFlattenListData()
    const { setCreateList } = useQlikCreateList()
    const { setLayout } = useQlikLayout()
    const { setFieldLock } = useQlikFieldLock()

    const [isLoading, setIsLoading] = useState(false)
    const [, setSelections] = useState<any>(null)
    const [maxIndex, setMaxIndex] = useState<number>(-1)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [, setData] = useState<any>([])
    const [model, setModel] = useState<any>(null)

    let qModel = useRef<any>(null).current

    const updateList = useCallback(async (mount = false) => {
        try {
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
            const currentIndex = data.find(
                (d: any) => d.qState === 'S' || d.qState === 'O' || d.qState === 'L'
            )
            setCurrentIndex(currentIndex?.qElemNumber || 0)
            setMaxIndex((data?.length ?? 1) - 1)
            setData(data)
            setModel(qModel)
            return currentIndex?.qElemNumber || 0
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }, [])

    useMount(async () => {
        setIsLoading(true)
        const qDefList = defList(calcFieldName ?? fieldName, stateName)
        qModel = await setCreateList(qDefList, qAppId)
        await setLayout(qModel, updateList, true)
        const elemNumber = await updateList(true)
        if (isFirstElementPreSelected)
            qModel.selectListObjectValues('/qListObjectDef', [elemNumber], false, true)
        setIsLoading(false)
    })

    useUnmount(() => {
        const m = qModel || model
        if (m) {
            m.removeAllListeners()
            qApi.destroySessionObject(m.id)
        }
    })

    useEffect(() => {
        const qSelection = qSelectionMap.get(qAppId)
        setSelections(qSelection?.qSelections)
    }, [qAppId, qSelectionMap])

    const handleNavigatorClick = async (index: number) => {
        try {
            if (index >= 0 && index <= maxIndex) {
                setIsLoading(true)
                await model.selectListObjectValues('/qListObjectDef', [index], false, true)
                await setFieldLock(fieldName, qAppId)
                setCurrentIndex(index)
                setIsLoading(false)
            }
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }

    const useStyles = makeStyles()((theme: any) => ({
        arrowRight: {
            marginLeft: '10px',
            marginBottom: '1px',
            fontSize: '0.7rem',
            cursor: 'pointer',
            color: themeMode === 'light' ? '#000' : '#FFF'
        },
        arrowLeft: {
            marginRight: '10px',
            marginBottom: '1px',
            fontSize: '0.7rem',
            cursor: 'pointer',
            color: themeMode === 'light' ? '#000' : '#FFF'
        }
    }))

    const { classes } = useStyles()

    return !isLoading ? (
        <>
            <IconTooltip title={'Back'}>
                <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleNavigatorClick(currentIndex - 1)}>
                    <ArrowBackIosIcon
                        className={classes.arrowLeft}
                        style={{
                            opacity: currentIndex > 0 ? 1 : 0.5
                        }}
                    />{' '}
                </IconButton>
            </IconTooltip>
            {children}
            <IconTooltip title={'Forward'}>
                <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleNavigatorClick(currentIndex + 1)}>
                    <ArrowForwardIosIcon
                        className={classes.arrowRight}
                        style={{
                            opacity: currentIndex < maxIndex ? 1 : 0.5
                        }}
                    />{' '}
                </IconButton>
            </IconTooltip>
        </>
    ) : (
        <QlikKpiAdvancedProgress />
    )
}

export default QlikKpiAdvancedNavigator
