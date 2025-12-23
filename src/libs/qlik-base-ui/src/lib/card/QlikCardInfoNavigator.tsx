import React, { FC, useEffect, useState, useCallback, useRef, ReactNode } from "react";

import { useMount, useUnmount } from 'react-use'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

import { IconTooltip } from '@libs/common-ui'
import {
    useQlikFlattenListData,
    useQlikCreateList,
    useQlikLayout,
    useQlikFieldLock,
    useQlikUnlockSelectionsExcept,
    useQlikGetListObjectData
} from '@libs/qlik-capability-hooks'
import { useQlikApp } from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import { defList } from './definitions/defList'
import { useQlikCardContext } from './QlikCardContext'
import QlikCardInfoProgress from './QlikCardInfoProgress'

export interface IQlikEtopsCardInfoNavigatorProps {
    qlikAppId: string
    fieldName: string
    stateName?: string
    isFirstElementPreSelected?: boolean
    calcFieldName?: string
    children: ReactNode
}

const QlikEtopsCardInfoNavigator: FC<IQlikEtopsCardInfoNavigatorProps> = ({
    qlikAppId,
    children,
    fieldName,
    calcFieldName,
    stateName = '$',
    isFirstElementPreSelected = false
}) => {
    const { setCardIsLoading, setCardFooter } = useQlikCardContext()
    const { qSelectionMap } = useQlikSelectionContext()
    const { qAppId, qApi } = useQlikApp(qlikAppId)
    const { setListObjectData } = useQlikGetListObjectData()
    const { setFlattenListData } = useQlikFlattenListData()
    const { setCreateList } = useQlikCreateList()
    const { setLayout } = useQlikLayout()
    const { setFieldLock } = useQlikFieldLock()
    const { setUnlockSelectionsExcept } = useQlikUnlockSelectionsExcept()

    const [isLoading, setIsLoading] = useState(false)
    const [, setSelections] = useState<any>(null)
    const [maxIndex, setMaxIndex] = useState<number>(-1)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [data, setData] = useState<any>([])
    const [model, setModel] = useState<any>(null)

    let qModel = useRef<any>(null).current

    const { classes } = useStyles()

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
            setCardFooter(currentIndex.qElemNumber + 1, data?.length)
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }, [])

    useMount(async () => {
        setIsLoading(true)
        setCardIsLoading(true)
        const qDefList = defList(calcFieldName ?? fieldName, stateName)
        qModel = await setCreateList(qDefList, qAppId)
        await setLayout(qModel, updateList, true)
        await updateList(true)
        if (isFirstElementPreSelected)
            qModel.selectListObjectValues('/qListObjectDef', [0], false, true)
        setIsLoading(false)
        setCardIsLoading(false)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qAppId, qSelectionMap])

    const unlockFieldsExcept = useCallback(async () => {
        const qSelection = qSelectionMap.get(qAppId)
        await setUnlockSelectionsExcept(
            qSelection?.qSelections,
            fieldName,
            qSelection?.qHiddenFields,
            qAppId
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldName, qAppId, qSelectionMap, setUnlockSelectionsExcept])

    const handleNavigatorClick = async (index: number) => {
        try {
            if (index >= 0 && index <= maxIndex) {
                setIsLoading(true)
                setCardIsLoading(true)
                await unlockFieldsExcept()
                await model.selectListObjectValues('/qListObjectDef', [index], false, true)
                await setFieldLock(fieldName, qAppId)
                setCurrentIndex(index)
                setCardFooter(index + 1, data?.length)
                setCardIsLoading(false)
                setIsLoading(false)
            }
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }

    return !isLoading ? (
        <Box alignItems="center">
            <Typography className={classes.label}>
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
            </Typography>
        </Box>
    ) : (
        <QlikCardInfoProgress />
    )
}

export default QlikEtopsCardInfoNavigator

const useStyles = makeStyles()((theme: any) => ({
    arrowRight: {
        marginLeft: '10px',
        marginBottom: '4px',
        fontSize: '1.1rem',
        cursor: 'pointer',
        color: '#FFF'
    },
    arrowLeft: {
        marginRight: '10px',
        marginBottom: '4px',
        fontSize: '1.1rem',
        cursor: 'pointer',
        color: '#FFF'
    },
    label: {
        color: '#FFF',
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: '18px',
        textAlign: 'center'
    }
}))
