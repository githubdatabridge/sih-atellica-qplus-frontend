import React, { memo, FC, useState, useRef, useEffect, useCallback, useMemo } from 'react'

import { useMount, useUnmount, useToggle } from 'react-use'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

import CheckIcon from '@mui/icons-material/Check'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import CloseIcon from '@mui/icons-material/Close'
import LockIcon from '@mui/icons-material/Lock'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import {
    Box,
    TextField,
    InputAdornment,
    Typography,
    Divider,
    CircularProgress,
    lighten
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'

import { useColorStyles, useDebounce } from '@libs/common-hooks'
import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import {
    useQlikGetListObjectData,
    useQlikFlattenListData,
    useQlikCreateList,
    useQlikLayout
} from '@libs/qlik-capability-hooks'
import { useQlikApp } from '@libs/qlik-providers'

import translation from '../../constants/translation'
import { defList } from '../../definitions/defList'
import SvgClearIcon from '../../icons/SvgClearIcon'
import SvgIconControlSelectAll from '../../icons/SvgControlSelectAllIcon'
import SvgIconControlSelectAlternative from '../../icons/SvgControlSelectAlternativeIcon'
import SvgIconControlSelectExcluded from '../../icons/SvgControlSelectExcludedIcon'
import SvgIconControlSelectPossible from '../../icons/SvgControlSelectPossibleIcon'
import SvgSearchIcon from '../../icons/SvgSearchIcon'

export interface IQlikSelectionFieldTooltipProps {
    qlikAppId?: string
    width?: string
    height?: string
    fieldName: string
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    toggle?: boolean
    softLock?: boolean
    onTooltipClose: () => void
}

// Reference found => https://github.com/qlik-oss/catwalk/blob/master/src/components/filterbox.jsx
const QlikSelectionFieldTooltip: FC<IQlikSelectionFieldTooltipProps> = React.memo(
    ({
        qlikAppId,
        fieldName,
        width,
        height,
        color = 'secondary',
        toggle = false,
        softLock = false,
        onTooltipClose
    }) => {
        const [isLoading, setIsLoading] = useState(false)
        const [value, setValue] = useState<number[]>([])
        const [charactersPerRow, setCharactersPerRow] = useState<number>(0)
        const [data, setData] = useState<any>([])
        const [model, setModel] = useState<any>(null)
        const [modalState, setModalState] = useState<boolean>(false)
        const [isSearching, setIsSearching] = useState(false)
        const [searchTerm, setSearchTerm] = useState<string>('')
        const debouncedSearchTerm = useDebounce(searchTerm, 0)
        const { selectedColor, contrastText } = useColorStyles(color)

        const { qAppId } = useQlikApp(qlikAppId)
        const { setListObjectData } = useQlikGetListObjectData()
        const { setFlattenListData } = useQlikFlattenListData()
        const { setCreateList } = useQlikCreateList()
        const { setLayout } = useQlikLayout()

        const qModel = useRef<any>(null)
        const boxRef = useRef<any>(null)

        const theme = useTheme()
        const { t } = useI18n()

        const [isEntryView, toggleEntryView] = useToggle(true)
        const [values, setValues] = useState({ name: '' })

        const checkModalStateHelper = useCallback(async () => {
            if (!modalState) {
                await qModel.current.beginSelections(['/qListObjectDef'])
                setModalState(true)
            }
        }, [modalState])

        const updateList = async () => {
            try {
                setIsLoading(true)
                if (!qModel.current) return
                const qLayout = await (qModel.current as any).getLayout()
                if (!qLayout) return
                const qData = await setListObjectData(
                    '/qListObjectDef',
                    qModel.current,
                    qLayout.qListObject.qSize,
                    qAppId
                )

                const data = setFlattenListData(qData, qAppId)
                setValue(
                    data
                        ?.filter((d: any) => d.qState === 'S')
                        ?.map((e: { qElemNumber: any }) => e.qElemNumber)
                )

                setData(data)
                setModel(qModel.current)
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsLoading(false)
            }
        }

        useMount(async () => {
            setIsLoading(true)
            const qDefList = defList(fieldName)
            qModel.current = await setCreateList(qDefList, qAppId)
            await setLayout(qModel.current, updateList, true)
            await updateList()

            setIsLoading(false)
        })

        useUnmount(() => {
            const m = qModel.current || model
            if (m) {
                m.removeAllListeners()
                m.close()
            }
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
                setIsSearching(true)
                handleSearchChange(debouncedSearchTerm)
            } catch (error) {
                console.log('Qplus Error', error)
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debouncedSearchTerm])

        const handleSearchChange = async (searchTerm: any) => {
            if (qModel?.current) {
                if (searchTerm?.length === 0) setIsSearching(false)
                setValues({ ...values, name: searchTerm })
                qModel.current.searchListObjectFor('/qListObjectDef', searchTerm)
            }
        }

        const handleResetSearchClick = async () => {
            setValues({ ...values, name: '' })
            await qModel.current.searchListObjectFor('/qListObjectDef', '')
            setIsSearching(false)
        }

        const handleSelectValuesClick = useCallback(
            async (qElemNumber: number) => {
                try {
                    checkModalStateHelper()
                    // We handle the toggle via JS due to a smoother UIX instead of waiting on the Qlik response via qState Property
                    let selectionArray = []
                    if (value.includes(qElemNumber)) {
                        selectionArray = value.filter(v => v !== qElemNumber)
                    } else {
                        setValue(prev => {
                            prev.push(qElemNumber)
                            return prev
                        })
                        selectionArray = value
                    }

                    await qModel.current.selectListObjectValues(
                        '/qListObjectDef',
                        selectionArray,
                        toggle,
                        softLock
                    )
                } catch (error) {}
            },
            [checkModalStateHelper, softLock, toggle, value]
        )

        const handleSelectPossibleClick = async () => {
            checkModalStateHelper()
            qModel.current.selectListObjectPossible('/qListObjectDef')
            toggleEntryView()
        }

        const handleSelectExcludedClick = async () => {
            checkModalStateHelper()
            qModel.current.selectListObjectExcluded('/qListObjectDef')
            toggleEntryView()
        }

        const handleSelectAllClick = async () => {
            checkModalStateHelper()
            qModel.current.selectListObjectAll('/qListObjectDef')
            toggleEntryView()
        }

        const handleClearClick = async () => {
            checkModalStateHelper()
            qModel.current.clearSelections('/qListObjectDef')
        }

        const handleAlternativeClick = async () => {
            checkModalStateHelper()
            qModel.current.selectListObjectAlternative('/qListObjectDef')
            toggleEntryView()
        }

        const handleCancelSelection = async () => {
            setModalState(false)
            await qModel.current.endSelections(false)
        }

        const handleConfirmSelection = async () => {
            setModalState(false)
            await qModel.current.endSelections(true)
            onTooltipClose()
        }

        const handleOnKeyHit = (e: any) => {
            if (e.key === 'Enter') {
                checkModalStateHelper()
                qModel.current.acceptListObjectSearch('/qListObjectDef', true)
                setIsSearching(false)
            }
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
            },
            {
                title:
                    t(translation.selectExcluded) === 'qplus-selectionbar-selectexcluded'
                        ? 'Select Excluded'
                        : t(translation.selectExcluded),
                onClick: handleSelectExcludedClick,
                icon: <SvgIconControlSelectExcluded color="#929292" />
            },
            {
                title:
                    t(translation.selectAlternative) === 'qplus-selectionbar-selectalternative'
                        ? 'Select Alternative'
                        : t(translation.selectAlternative),
                onClick: handleAlternativeClick,
                icon: <SvgIconControlSelectAlternative color="#929292" />
            }
        ]

        const Row = ({ index, style }: ListChildComponentProps) => {
            const isSelected = data[index].qState === 'S'
            const isPossible = data[index].qState === 'P' || data[index].qState === 'O'
            const isLocked = data[index].qState === 'L'
            const isExcluded = data[index].qState === 'X'

            const textStyle = () => {
                return 'none'
            }

            const textColor = () => {
                if (isSelected) return contrastText
                if (isLocked) return contrastText
                if (isExcluded) return theme.palette.text.primary
                if (!isSelected && !isPossible) return lighten(theme.palette.text.primary, 0.1)

                return theme.palette.text.primary
            }

            const backgroundStyle = () => {
                if (isSelected) return selectedColor
                if (isLocked) return theme.palette.primary.dark
                if (isExcluded) return theme.palette.text.disabled
                if (!isSelected && !isPossible) return lighten(theme.palette.text.disabled, 0.1)

                return theme.palette.background.paper
            }

            return useMemo(
                () =>
                    data[index].qText ? (
                        <Box display="flex" key={data[index].qElemNumber} flexGrow="1">
                            <Box
                                display="flex"
                                alignItems="center"
                                flexGrow="1"
                                padding="4px"
                                borderRadius="4px"
                                marginBottom="2px"
                                style={style}
                                sx={{
                                    backgroundColor: backgroundStyle(),
                                    cursor: 'pointer',
                                    border: '1px solid #EDEDED'
                                }}
                                onClick={() => {
                                    handleSelectValuesClick(data[index].qElemNumber)
                                }}>
                                <Box flexGrow={1}>
                                    {data[index]?.qText?.length > charactersPerRow ? (
                                        <Typography
                                            sx={{
                                                fontSize: '0.775rem',
                                                color: textColor(),
                                                textDecoration: textStyle()
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
                                                color: textColor(),
                                                textDecoration: textStyle()
                                            }}>
                                            {data[index]?.qText || ''}
                                        </Typography>
                                    )}
                                </Box>
                                {isSelected && (
                                    <CheckIcon fontSize="small" style={{ fill: '#fff' }} />
                                )}
                                {isLocked && <LockIcon fontSize="small" style={{ fill: '#fff' }} />}
                            </Box>
                        </Box>
                    ) : null,
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [index, data]
            )

            // Add dependencies here as needed
        }

        const view = isEntryView ? (
            <Box>
                <Box display="flex" alignItems="center" flexGrow="1" marginBottom="6px">
                    <TextField
                        size="small"
                        fullWidth
                        name="name"
                        variant="outlined"
                        value={values.name}
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
            </Box>
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
                        <Box sx={{ color: theme.palette.text.primary, marginLeft: '10px' }}>
                            <Typography sx={{ fontSize: '0.775rem' }}> {control.title}</Typography>
                        </Box>
                    </Box>
                    {index !== controls.length - 1 && <Divider variant="fullWidth" />}
                </>
            ))
        )

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

export default memo(QlikSelectionFieldTooltip)
