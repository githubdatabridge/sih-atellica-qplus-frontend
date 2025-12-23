import React, { memo, FC, useState, useRef, useEffect, useCallback } from 'react'

import { useMount, useUnmount } from 'react-use'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import LockIcon from '@mui/icons-material/Lock'
import { Box, TextField, InputAdornment, CircularProgress } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { useTheme, Theme } from '@mui/material/styles'

import { IconTooltip } from '@libs/common-ui'
import {
    useQlikGetListObjectData,
    useQlikFlattenListData,
    useQlikCreateList,
    useQlikLayout,
    useQlikFieldLock,
    useQlikUnlockSelectionsExcept
} from '@libs/qlik-capability-hooks'
import { useQlikApp } from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import { defList } from './definitions/defList'
import SearchIcon from './icons/search.svg'
import { useQlikCardContext } from './QlikCardContext'

export interface IQlikCardInfoSelectProps {
    qlikAppId: string
    fieldName: string
    calcFieldName?: string
    stateName?: string
    isFirstElementPreSelected?: boolean
}

const QlikCardInfoSelect: FC<IQlikCardInfoSelectProps> = ({
    qlikAppId,
    fieldName,
    calcFieldName,
    stateName = '$',
    isFirstElementPreSelected = false
}) => {
    const { setCardFooter } = useQlikCardContext()
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
    const [, setValue] = useState<number[]>([])
    const [data, setData] = useState<any>([])
    const [model, setModel] = useState<any>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [values, setValues] = useState({ name: '' })

    let qModel = useRef<any>(null).current

    const theme = useTheme()

    const updateList = useCallback(async () => {
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
            setValue(
                data
                    .filter((d: any) => d.qState === 'S')
                    .map((e: { qElemNumber: any }) => e.qElemNumber)
            )
            setData(data)
            setModel(qModel)
        } catch (error) {
            console.log('Qplus Error', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useMount(async () => {
        setIsLoading(true)
        const qDefList = defList(calcFieldName ?? fieldName, stateName)
        qModel = await setCreateList(qDefList, qAppId)
        await setLayout(qModel, updateList, true)
        await updateList()
        if (isFirstElementPreSelected)
            qModel.selectListObjectValues('/qListObjectDef', [0], false, true)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qAppId])

    const handleSearchChange = (evt: any) => {
        const { name, value } = evt.target
        if (value.length > 0) setIsSearching(true)

        if (value.length === 0) setIsSearching(false)

        setValues({ ...values, [name]: value })
        setTimeout(() => model.searchListObjectFor('/qListObjectDef', value), 300)
    }

    const resetSearch = () => {
        setValues({ ...values, name: '' })
        model.searchListObjectFor('/qListObjectDef', '')
        setIsSearching(false)
    }

    const handleSelectValuesClick = async (qElemNumber: number) => {
        try {
            setIsLoading(true)
            await unlockFieldsExcept()
            model.selectListObjectValues('/qListObjectDef', [qElemNumber], false, true)
            await setFieldLock(fieldName, qAppId)
            setCardFooter(qElemNumber + 1, data?.length)
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }

    const unlockFieldsExcept = useCallback(async () => {
        const qSelection = qSelectionMap.get(qAppId)
        await setUnlockSelectionsExcept(
            qSelection?.qSelections,
            fieldName,
            qSelection?.qHiddenFields
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldName, qAppId, qSelectionMap, setUnlockSelectionsExcept])

    const Row = ({ index, style }: ListChildComponentProps) => {
        const isSelected = data[index].qState === 'S'
        const isPossible = data[index].qState === 'P' || data[index].qState === 'O'
        const isLocked = data[index].qState === 'L'

        const textStyle = () => {
            //if (data[index].qState === 'X') return 'line-through'
            return 'none'
        }

        const textColor = () => {
            if (isSelected || isLocked) return '#fff'
            return 'inherit'
        }

        const backgroudStyle = () => {
            if (isSelected) return theme.palette.secondary.main
            if (isLocked) return theme.palette.primary.dark
            if (!isSelected && !isPossible) return '#DDDDDD'

            return '#fff'
        }
        return (
            <Box
                display="flex"
                height="24px"
                key={data[index].qElemNumber}
                style={style}
                flexGrow="1">
                <Box
                    display="flex"
                    alignItems="center"
                    flexGrow="1"
                    padding="4px"
                    borderRadius="4px"
                    height="22px"
                    marginBottom="2px"
                    style={{ backgroundColor: backgroudStyle(), cursor: 'pointer' }}
                    onClick={() => {
                        handleSelectValuesClick(data[index].qElemNumber)
                    }}>
                    <p style={{ textDecoration: textStyle(), color: textColor(), flexGrow: 1 }}>
                        {/*   {hasNumberText ? data[index].qNum : data[index].qText} */}{' '}
                        {data[index].qText}
                    </p>
                    {isSelected && <CheckIcon fontSize="small" style={{ fill: '#fff' }} />}
                    {isLocked && <LockIcon fontSize="small" style={{ fill: '#fff' }} />}
                </Box>
            </Box>
        )
    }

    const view = (
        <Box>
            <Box
                display="flex"
                alignItems="center"
                flexGrow="1"
                marginBottom="6px"
                marginTop="10px">
                <TextField
                    size="small"
                    fullWidth
                    name="name"
                    variant="outlined"
                    value={values.name}
                    label={'Search'}
                    onChange={handleSearchChange}
                    SelectProps={{
                        MenuProps: { disablePortal: true }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {isSearching ? (
                                    <IconTooltip title={'Cancel'}>
                                        <IconButton edge="end" size="small" onClick={resetSearch}>
                                            <CloseIcon />
                                        </IconButton>
                                    </IconTooltip>
                                ) : (
                                    <IconTooltip title={'Search'}>
                                        <IconButton edge="end" size="small">
                                            <img
                                                src={SearchIcon}
                                                style={{ width: '16px', height: '16px' }}
                                                alt={'Search'}
                                            />
                                        </IconButton>
                                    </IconTooltip>
                                )}
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
            <FixedSizeList height={300} width={300} itemSize={24} itemCount={data.length}>
                {Row}
            </FixedSizeList>
        </Box>
    )

    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="column" position="relative">
                {isLoading && (
                    <Box
                        display="flex"
                        position="absolute"
                        top={0}
                        left={0}
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                        style={{
                            opacity: 0.8,
                            background: '#fff',
                            zIndex: 100
                        }}>
                        <CircularProgress color="secondary" size={24} />
                    </Box>
                )}
                {view}
            </Box>
        </Box>
    )
}

export default memo(QlikCardInfoSelect)
