import React, { memo, FC, useState, useRef, useEffect, useCallback } from 'react'

import { useMount, useUnmount, useToggle } from 'react-use'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

import CheckIcon from '@mui/icons-material/Check'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import CloseIcon from '@mui/icons-material/Close'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import {
    Box,
    TextField,
    InputAdornment,
    Typography,
    Divider,
    CircularProgress,
    IconButton
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { useColorStyles, useDebounce } from '@libs/common-hooks'
import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { QMultiAppField } from '@libs/qlik-models'

import translation from '../../constants/translation'
import { useQlikSelectionField } from '../../hooks'
import SvgClearIcon from '../../icons/SvgClearIcon'
import SvgIconControlSelectAll from '../../icons/SvgControlSelectAllIcon'
import SvgIconControlSelectPossible from '../../icons/SvgControlSelectPossibleIcon'
import SvgSearchIcon from '../../icons/SvgSearchIcon'

export interface IQlikSelectionMultiAppTooltipProps {
    fields?: QMultiAppField[]
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    toggle?: boolean
    softLock?: boolean
    width?: string
    height?: string
    onTooltipClose: () => void
    onSelectValuesCallback: (count: number) => void
}

const QlikSelectionMultiAppTooltip: FC<IQlikSelectionMultiAppTooltipProps> = React.memo(
    ({
        fields,
        width,
        height,
        color = 'secondary',
        toggle,
        softLock,
        onTooltipClose,
        onSelectValuesCallback
    }) => {
        const [isLoading, setIsLoading] = useState<boolean>(false)
        const [data, setData] = useState<any>([])
        const [values, setValues] = useState({ name: '' })
        const [charactersPerRow, setCharactersPerRow] = useState<number>(0)
        const [isSearching, setIsSearching] = useState(false)
        const [modalState, setModalState] = useState<boolean>(false)
        const [searchTerm, setSearchTerm] = useState<string>('')
        const debouncedSearchTerm = useDebounce(searchTerm, 300)
        const { selectedColor, contrastText } = useColorStyles(color)

        const {
            createSelectionField,
            flattenListObjectData,
            beginSelection,
            confirmSelection,
            cancelSelection,
            selectPossible,
            selectValues,
            selectAll,
            clearSelections,
            clearSearch,
            searchValue,
            acceptSearch,
            getListData
        } = useQlikSelectionField()

        const [isEntryView, toggleEntryView] = useToggle(true)

        const { t } = useI18n()

        const qModelMapRef = useRef<Map<string, any> | null>(new Map())
        const qDataMapRef = useRef<Map<string, any> | null>(new Map())
        const qSelectedValuesRef = useRef<Map<string, any> | null>(new Map())
        const boxRef = useRef<any>(null)

        const updateList = useCallback(async () => {
            let selectedCounter = 0
            const uniqueData: any[] = []
            try {
                setIsLoading(true)
                for (const [key, value] of qModelMapRef.current) {
                    if (!value) return
                    const qLayout = await (value as any).getLayout()
                    if (!qLayout) return
                    const qData = await getListData(
                        key,
                        '/qListObjectDef',
                        value,
                        qLayout.qListObject.qSize
                    )
                    if (qLayout) {
                        const data = flattenListObjectData(key, qData)
                        if (data && data.length > 0) {
                            const selectedValues = data?.filter((d: any) => d.qState === 'S')

                            selectedCounter = selectedCounter + (selectedValues?.length || 0)
                            qSelectedValuesRef.current.set(key, selectedValues)

                            const updatedData = data?.map(d => {
                                return { ...d, qAppId: key }
                            })

                            qDataMapRef.current.set(key, updatedData)
                            uniqueData.push(...updatedData)
                        }
                    }
                }

                const newData = Object.values(
                    uniqueData.reduce((acc, obj) => ({ ...acc, [obj.qText]: obj }), {})
                ) as any[]
                setData(newData)
                onSelectValuesCallback(selectedCounter)
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsLoading(false)
            }
        }, [flattenListObjectData, getListData, onSelectValuesCallback])

        const mountFields = useCallback(async () => {
            let model = null
            for (const field of fields) {
                model = await createSelectionField(field.qAppId, field.qFieldName, null)
                qModelMapRef.current.set(field.qAppId, model)
                model?.on('changed', updateList)
            }

            updateList()
        }, [createSelectionField, fields, updateList])

        const checkModalStateHelper = useCallback(async () => {
            for (const [, value] of qModelMapRef.current) {
                await beginSelection(value)
                setModalState(true)
            }
        }, [beginSelection])

        useMount(async () => {
            setIsLoading(true)
            await mountFields()
            setIsLoading(false)
        })

        useEffect(() => {
            const boxElement = boxRef.current
            if (!boxElement) return

            // Get the box width
            const boxWidth = boxElement.clientWidth

            // Assuming an average character width (you can adjust this based on your font)
            const averageCharWidth = 8

            // Calculate the number of characters that fit in a single row
            const charsInRow = Math.floor(boxWidth / averageCharWidth)

            // Set the state with the calculated value
            setCharactersPerRow(charsInRow)
        }, [])

        useEffect(() => {
            try {
                setIsLoading(true)
                setIsSearching(true)
                handleSearchChange(debouncedSearchTerm)
                setIsSearching(false)
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debouncedSearchTerm])

        useUnmount(() => {
            for (const [, value] of qModelMapRef.current) {
                if (value) {
                    value.removeAllListeners()
                    value.close()
                }
            }
        })

        const handleSelectValuesClick = useCallback(
            async (qText: string) => {
                try {
                    setIsLoading(true)
                    checkModalStateHelper()
                    const newValuesMap: Map<string, number[]> = new Map()

                    for (const [key, value] of qDataMapRef.current) {
                        const target = value.filter(v => v.qText === qText)
                        //PAM: We handle the toggle via JS due to a smoother UIX instead of waiting on the Qlik response via qState Property
                        if (target && target.length > 0) {
                            const qElemNumber = target[0].qElemNumber
                            let selectionArray = []
                            const values = qSelectedValuesRef.current.get(key) || []
                            const newValues = [...values]
                            const cleanValues =
                                newValues?.filter(item => item !== undefined && item !== null) || []
                            const qElemNumbers = cleanValues.map(v => v.qElemNumber)
                            if (qElemNumbers.includes(qElemNumber)) {
                                selectionArray = qElemNumbers.filter(v => v !== qElemNumber)
                            } else {
                                selectionArray = [...qElemNumbers, qElemNumber]
                            }
                            newValuesMap.set(key, selectionArray)
                            qSelectedValuesRef.current.set(key, selectionArray)
                            const qModel = qModelMapRef.current.get(key)
                            await selectValues(qModel, selectionArray, toggle, softLock)
                        }
                    }
                } catch (error) {
                    console.log('Qplus Error', error)
                } finally {
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000)
                }
            },
            [checkModalStateHelper, selectValues, softLock, toggle]
        )

        const handleCancelSelection = async () => {
            for (const [, value] of qModelMapRef.current) {
                await cancelSelection(value)
            }
            setModalState(false)
            setSearchTerm('')
        }

        const handleSelectAllClick = async () => {
            setIsLoading(true)
            checkModalStateHelper()
            for (const [, value] of qModelMapRef.current) {
                await selectAll(value)
            }
            toggleEntryView()
            setIsLoading(false)
        }

        const handleSelectPossibleClick = async () => {
            setIsLoading(true)
            checkModalStateHelper()
            for (const [, value] of qModelMapRef.current) {
                await selectPossible(value)
            }
            toggleEntryView()
            setIsLoading(false)
        }

        const handleClearClick = async () => {
            setIsLoading(true)
            checkModalStateHelper()
            for (const [key, value] of qModelMapRef.current) {
                await clearSelections(value)
            }
            qSelectedValuesRef.current.clear()
            setIsLoading(false)
        }

        const handleSearchChange = async (searchTerm: any) => {
            if (searchTerm?.length > 0) setIsSearching(true)

            if (searchTerm?.length === 0) setIsSearching(false)

            setValues({ ...values, [searchTerm]: searchTerm })

            for (const [, value] of qModelMapRef.current) {
                await searchValue(value, searchTerm)
            }
        }

        const handleOnKeyHit = async (e: any) => {
            if (e.key === 'Enter') {
                for (const [, value] of qModelMapRef.current) {
                    await beginSelection(value)
                    await acceptSearch(value)
                }
            }
        }

        const handleConfirmSelection = async () => {
            setModalState(false)
            for (const [, value] of qModelMapRef.current) {
                await confirmSelection(value)
            }
            onTooltipClose()
            //PAM: TODO Close the Tooltip Window after confirmation
        }

        const handleResetSearchClick = async () => {
            setValues({ ...values, name: '' })
            for (const [, value] of qModelMapRef.current) {
                await clearSearch(value)
            }
            setIsSearching(false)
        }

        const theme = useTheme()

        const selectionIcons = () => {
            return !modalState ? null : (
                <>
                    <IconTooltip title={t(translation.cancel)}>
                        <IconButton onClick={handleCancelSelection} size="small">
                            <ClearRoundedIcon fontSize="small" />
                        </IconButton>
                    </IconTooltip>
                    <IconTooltip title={t(translation.confirm)}>
                        <IconButton onClick={handleConfirmSelection} size="small">
                            <CheckRoundedIcon fontSize="small" />
                        </IconButton>
                    </IconTooltip>
                </>
            )
        }

        const controls = [
            {
                title:
                    t(translation.selectAll) === 'qplus-selectionbar-selectall'
                        ? 'Select All'
                        : t(translation.selectAll),
                onClick: handleSelectAllClick,
                icon: <SvgIconControlSelectAll color="#929292" />
            },
            {
                title:
                    t(translation.selectPossible) === 'qplus-selectionbar-selectpossible'
                        ? 'Select Possible'
                        : t(translation.selectPossible),
                onClick: handleSelectPossibleClick,
                icon: <SvgIconControlSelectPossible color="#929292" />
            }
        ]

        const Row = ({ index, style }: ListChildComponentProps) => {
            let isSelected = false
            for (const [key, value] of qSelectedValuesRef.current) {
                if (key === data[index].qAppId) {
                    for (const v of value) {
                        if (v?.qText === data[index].qText) {
                            isSelected = true
                            break
                        }
                    }
                }
                if (isSelected) break
            }

            const textStyle = () => {
                return 'none'
            }

            const textColor = () => {
                if (isSelected) return contrastText

                return theme.palette.text.primary
            }

            const backgroundStyle = () => {
                if (isSelected) return selectedColor

                return theme.palette.background.paper
            }
            return data[index].qText ? (
                <Box
                    display="flex"
                    height="24px"
                    key={data[index].qText}
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
                        style={{
                            backgroundColor: backgroundStyle(),
                            cursor: 'pointer',
                            border: '1px solid #EDEDED'
                        }}
                        onClick={() => {
                            handleSelectValuesClick(data[index].qText)
                        }}>
                        <Box flexGrow={1}>
                            {data[index]?.qText?.length > charactersPerRow ? (
                                <Typography
                                    sx={{
                                        fontSize: '0.775rem',
                                        textDecoration: textStyle(),
                                        color: textColor()
                                    }}>
                                    {`${data[index].qText.substring(0, charactersPerRow)}`}
                                    <IconTooltip title={data[index].qText}>
                                        <span>...</span>
                                    </IconTooltip>
                                </Typography>
                            ) : (
                                <Typography
                                    sx={{
                                        fontSize: '0.775rem',
                                        textDecoration: textStyle(),
                                        color: textColor()
                                    }}>
                                    {data[index]?.qText || ''}
                                </Typography>
                            )}
                        </Box>
                        {isSelected && <CheckIcon fontSize="small" style={{ fill: '#fff' }} />}
                    </Box>
                </Box>
            ) : null
        }

        const view = isEntryView ? (
            <>
                <Box display="flex" alignItems="center" flexGrow="1" marginBottom="6px">
                    <TextField
                        size="small"
                        fullWidth
                        name="name"
                        variant="outlined"
                        value={searchTerm}
                        label={
                            t(translation.search) === 'qplus-selectionbar-search'
                                ? 'Search'
                                : t(translation.search)
                        }
                        onKeyPress={handleOnKeyHit}
                        onChange={e => setSearchTerm(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {isSearching ? (
                                        <IconTooltip
                                            title={
                                                t(translation.searchCancel) ===
                                                'qplus-selectionbar-search-cancel'
                                                    ? 'Cancel'
                                                    : t(translation.searchCancel)
                                            }>
                                            <IconButton
                                                edge="end"
                                                size="small"
                                                onClick={handleResetSearchClick}>
                                                <CloseIcon />
                                            </IconButton>
                                        </IconTooltip>
                                    ) : (
                                        <IconTooltip
                                            title={
                                                t(translation.search) ===
                                                'qplus-selectionbar-search'
                                                    ? 'Search'
                                                    : t(translation.search)
                                            }>
                                            <IconButton edge="end" size="small">
                                                <SvgSearchIcon width="16px" height="16px" />
                                            </IconButton>
                                        </IconTooltip>
                                    )}
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
                <FixedSizeList height={300} width={'100%'} itemSize={24} itemCount={data.length}>
                    {Row}
                </FixedSizeList>
            </>
        ) : (
            controls.map((control, index) => (
                <>
                    <Box
                        display="flex"
                        alignItems="center"
                        padding="4px"
                        borderRadius="4px"
                        marginBottom="2px"
                        style={{ cursor: 'pointer' }}
                        onClick={control.onClick}>
                        {control.icon}
                        <p style={{ color: '#000', marginLeft: '10px' }}>{control.title}</p>
                    </Box>
                    {index !== controls.length - 1 && <Divider variant="fullWidth" />}
                </>
            ))
        )

        return (
            // @ts-ignore
            <Box
                ref={boxRef}
                display="flex"
                flexDirection="column"
                width={width || '260px'}
                height={height || '400px'}>
                <Box display="flex">
                    <Box display="flex" flexGrow="1" alignItems="center">
                        <IconTooltip title={t(translation.fieldClear)}>
                            <IconButton onClick={handleClearClick} size="large">
                                <SvgClearIcon width="22px" height="22px" />
                            </IconButton>
                        </IconTooltip>
                        <Typography color="textPrimary">
                            {t(translation.fieldClear) === 'qplus-selectionbar-clear-field-tooltip'
                                ? 'Clear Field'
                                : t(translation.fieldClear)}
                        </Typography>
                    </Box>
                    <Box>
                        <IconTooltip
                            title={
                                t(translation.advanced) === 'qplus-selectionbar-selection-advanced'
                                    ? 'Advanced'
                                    : t(translation.advanced)
                            }>
                            <IconButton onClick={toggleEntryView} size="large">
                                <MoreHorizIcon />
                            </IconButton>
                        </IconTooltip>
                        {selectionIcons()}
                    </Box>
                </Box>

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
)

export default memo(QlikSelectionMultiAppTooltip)
