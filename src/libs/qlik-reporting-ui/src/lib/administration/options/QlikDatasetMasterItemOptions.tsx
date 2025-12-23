import React, { FC } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import FlareIcon from '@mui/icons-material/Flare'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import SearchIcon from '@mui/icons-material/Search'
import {
    Box,
    Button,
    Typography,
    IconButton,
    InputBase,
    List,
    ListItem,
    useTheme,
    Theme,
    ListItemText,
    Backdrop,
    darken
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip, BaseSwitch } from '@libs/common-ui'

import { QlikReportFilterSelectTagsAutocomplete } from '../../components/autocomplete'
import translation from '../constants/translations'

interface IQlikDatasetOptionsProps {
    data: any
    type: string
    setDimensionsCallback?(value: any[]): void
    setMeasuresCallback?(value: any[]): void
    setFiltersCallback?(value: any[]): void
    newDatasetDimensions?: any[]
    newDatasetMeasures?: any[]
    newDatasetFilters?: any[]
}

const QlikDatasetMasterItemOptions: FC<IQlikDatasetOptionsProps> = ({
    data,
    type,
    setDimensionsCallback,
    setMeasuresCallback,
    setFiltersCallback,
    newDatasetDimensions,
    newDatasetMeasures,
    newDatasetFilters
}) => {
    const theme = useTheme<Theme>()
    const { classes } = useStyles()
    const { t } = useI18n()

    const sortHelper = (data: any) => {
        data.sort(function (a, b) {
            if (a.title < b.title) {
                return -1
            }
            if (a.title > b.title) {
                return 1
            }
            return 0
        })
        return data
    }

    const getAndSetTags = () => {
        const tags = []
        const sTags = []
        for (const item of sortedData) {
            for (const tag of item.tags) {
                tags.push(tag)
            }
        }
        const uniqueTags = [...new Set(tags)]
        for (const tag of uniqueTags) {
            sTags.push({
                id: tag,
                name: tag
            })
        }
        return sTags
    }

    const getAndSetSelected = () => {
        switch (type) {
            case 'Dimensions':
                return sortHelper(newDatasetDimensions)
            case 'Measures':
                return sortHelper(newDatasetMeasures)
            case 'Filters':
                return sortHelper(newDatasetFilters)
            default:
                break
        }
    }

    const getAndSetAvailable = (data: any) => {
        switch (type) {
            case 'Dimensions':
                return filterAvailable(newDatasetDimensions, data)
            case 'Measures':
                return filterAvailable(newDatasetMeasures, data)
            case 'Filters':
                return filterAvailable(newDatasetFilters, data)
            default:
                break
        }
    }

    const filterAvailable = (selectedData: any, data: any) => {
        const filtered = data.filter(
            item => !selectedData?.find(sd => sd.qLibraryId === item.qLibraryId)
        )
        const newFiltered = filtered?.map(item => {
            return { ...item, isSelected: false }
        })
        return sortHelper(newFiltered)
    }

    const sortedData = getAndSetAvailable(data)
    const uniqTags = getAndSetTags()

    const sortedSelected = getAndSetSelected()

    const [tags, setTags] = React.useState<any>(uniqTags)
    const [propsData, setPropsData] = React.useState<any>(sortedData)
    const [availableData, setAvailableData] = React.useState<any>(propsData)
    const [selectedData, setSelectedData] = React.useState<any>(sortedSelected)
    const [propsSelectedData, setPropsSelectedData] = React.useState<any>(sortedSelected)
    const [pickedData, setPickedData] = React.useState<any>([])
    const [selectedList, setSelectedList] = React.useState<number>(0) // handles from what list is picked data... 1- available data / 2- selected data
    const [availableDataSearchText, setAvailableDataSearchText] = React.useState<string>('')
    const [selectedDataSearchText, setSelectedDataSearchText] = React.useState<string>('')

    const [useTechnicalFieldName, setUseTechnicalFieldName] = React.useState<boolean>(false)
    const [visible, setEditVisible] = React.useState<boolean>(false)
    const [editItem, setEditItem] = React.useState<any>(null)
    const [newLabel, setNewLabel] = React.useState<string>('')

    const handlePickedData = (pickedItems, fromList, toList, selectedList: number) => {
        fromList.forEach(element => (element.isSelected = false))
        toList.forEach(element => (element.isSelected = false))

        let newFromList = [...fromList]
        let newToList = [...toList]
        for (let i = 0; i < pickedItems.length; i++) {
            newToList.push(pickedItems[i])
            const filtered = newFromList.filter(x => x.qLibraryId !== pickedItems[i].qLibraryId)
            newFromList = [...filtered]
        }

        newToList = sortHelper(newToList)
        newFromList = sortHelper(newFromList)
        setAvailableData(selectedList === 1 ? newFromList : newToList)
        setSelectedData(selectedList === 1 ? newToList : newFromList)
        setPropsSelectedData(selectedList === 1 ? newToList : newFromList)
        setPickedData([])
        setSelectedList(0)
        handleNewDatasetCallback(type, selectedList === 1 ? newToList : newFromList)
    }

    const handleResetSelectedData = () => {
        selectedData.forEach(element => (element.isSelected = false))
        availableData.forEach(element => (element.isSelected = false))
        setAvailableData(propsData)
        setSelectedData([])
        setPickedData([])
        setSelectedList(0)
        handleNewDatasetCallback(type, [])
    }

    const handleOnClick = (action: string) => {
        switch (action) {
            case 'add':
                handlePickedData(pickedData, availableData, selectedData, selectedList)
                break
            case 'remove':
                handlePickedData(pickedData, selectedData, availableData, selectedList)
                break
            case 'reset':
                handleResetSelectedData()
                break
            default:
                break
        }
    }

    const handleNewDatasetCallback = (type: string, value: any[]) => {
        switch (type) {
            case 'Dimensions':
                setDimensionsCallback(value)
                break
            case 'Measures':
                setMeasuresCallback(value)
                break
            case 'Filters':
                setFiltersCallback(value)
                break
            default:
                break
        }
    }

    const handleOpenSearchClick = (columnNumber: number) => {
        columnNumber === 1 ? setAvailableDataSearchText('') : setSelectedDataSearchText('')
    }

    const handleCloseSearchClick = (columnNumber: number) => {
        if (columnNumber === 1) {
            setAvailableDataSearchText('')
            const allData = [...propsData, ...availableData]
            const aData = [...new Set(allData)].filter(
                d => !propsSelectedData?.find(p => p.qLibraryId === d.qLibraryId)
            )
            setAvailableData(aData)
        } else {
            setSelectedDataSearchText('')
        }
    }

    const handleSearchChange = (e: any, columnNumber: number) => {
        let currentList = []
        let newList = []

        const allData = [...propsData, ...availableData]
        if (e.target.value === '') {
            const aData = [...new Set(allData)].filter(
                d => !propsSelectedData?.find(p => p.qLibraryId === d.qLibraryId)
            )
            newList = columnNumber === 1 ? aData : [...propsSelectedData]
        } else {
            const aData = [...new Set(allData)].filter(
                d => !propsSelectedData?.find(p => p.qLibraryId === d.qLibraryId)
            )
            currentList = columnNumber === 1 ? aData : [...propsSelectedData]
            newList = currentList.filter(item => {
                return useTechnicalFieldName
                    ? item?.title?.toLowerCase().includes(e.target.value.toLowerCase())
                    : item?.label?.toLowerCase().includes(e.target.value.toLowerCase())
            })
        }

        columnNumber === 1 ? setAvailableData(newList) : setSelectedData(newList)
        columnNumber === 1
            ? setAvailableDataSearchText(e.target.value)
            : setSelectedDataSearchText(e.target.value)
    }

    const onHandleSelectTagCallback = (tags = [], columnNumber: number) => {
        // Determine the data set to work with based on columnNumber
        const masterItems: any[] =
            columnNumber === 1 ? [...new Set(availableData)] : [...new Set(propsSelectedData)]

        // Filter items by matching tags
        const filteredByTags = masterItems.filter(item =>
            item.tags.some(itemTag => tags.includes(itemTag))
        )

        // Combine all data sets
        const allData = [...new Set([...propsData, ...availableData])]

        let newList = []

        // If we have any items matching the tags
        if (filteredByTags.length > 0) {
            newList = masterItems.filter(item =>
                filteredByTags.some(filteredItem => filteredItem.qLibraryId === item.qLibraryId)
            )
        } else if (tags.length === 0) {
            // If no tags are selected, filter all data to exclude already selected items
            newList = allData.filter(
                item =>
                    !propsSelectedData.some(
                        selectedItem => selectedItem.qLibraryId === item.qLibraryId
                    )
            )
        } else {
            // If no items match and tags are provided, return an empty list
            newList = []
        }

        // Update the appropriate state based on columnNumber
        if (columnNumber === 1) {
            setAvailableData(newList)
        } else {
            setSelectedData(newList)
        }
    }

    const handlePickedItem = (item, sList: number) => {
        handleSelectionBackground(item, sList)
        const newPickedItems = sList === selectedList ? [...pickedData] : []
        const index = newPickedItems.findIndex(i => i.qLibraryId === item.qLibraryId)
        index !== -1 ? newPickedItems.splice(index, 1) : newPickedItems.push(item)
        setPickedData(newPickedItems)
        if (sList !== selectedList) {
            setSelectedList(sList)
        }
        if (!newPickedItems.length) {
            setSelectedList(0)
        }
    }

    const handleSelectionBackground = (item, sList: number) => {
        if (sList === 1) {
            availableData.forEach(element => {
                if (element.qLibraryId === item.qLibraryId) {
                    element.isSelected = !element.isSelected
                }
            })
            selectedData.forEach(element => (element.isSelected = false))
        }
        if (sList === 2) {
            selectedData.forEach(element => {
                if (element.qLibraryId === item.qLibraryId) {
                    element.isSelected = !element.isSelected
                }
            })
            availableData.forEach(element => (element.isSelected = false))
        }
        setSelectedData(selectedData)
        setAvailableData(availableData)
    }

    const handleEditSettings = item => {
        setEditVisible(true)
        setEditItem(item)
        setNewLabel(item.label)
    }

    const saveEditData = () => {
        selectedData.forEach(element => {
            if (element.qLibraryId === editItem.qLibraryId) {
                element.label = newLabel
                element.isEdited = true
            }
        })
        setSelectedList(selectedData)
        setEditVisible(false)
    }

    const renderSearch = (columnNumber: number) => {
        return (
            <Box className={classes.searchContainer}>
                <IconTooltip title={t(translation.datasetSearchTooltip)}>
                    <IconButton
                        aria-label="search"
                        onClick={() => handleOpenSearchClick(columnNumber)}
                        className={classes.iconButton}>
                        <SearchIcon className={classes.icon} />
                    </IconButton>
                </IconTooltip>
                <Box flexGrow={1}>
                    <InputBase
                        className={classes.input}
                        placeholder={t(translation.datasetSearchPlaceholder)}
                        inputProps={{ 'aria-label': 'search dimensions' }}
                        onChange={e => handleSearchChange(e, columnNumber)}
                        value={
                            columnNumber === 1 ? availableDataSearchText : selectedDataSearchText
                        }
                    />
                </Box>
                {(columnNumber === 1 ? availableDataSearchText : selectedDataSearchText) ? (
                    <IconTooltip title="">
                        <IconButton
                            aria-label="search"
                            onClick={() => handleCloseSearchClick(columnNumber)}
                            className={classes.iconButton}>
                            <CloseIcon className={classes.icon} />
                        </IconButton>
                    </IconTooltip>
                ) : null}
            </Box>
        )
    }

    return (
        <>
            <Box className={classes.root}>
                {/* left container */}
                <Box className={classes.container}>
                    <Box className={classes.title}>
                        <Typography className={classes.primaryText}>
                            {t(translation.datasetFieldsAvailableLabel)} {type}
                        </Typography>
                        <Typography className={classes.secondaryTextSeparator}>{' - '}</Typography>
                        <Typography className={classes.secondaryText}>
                            {`${t(translation.datasetFieldsShowingLabel)} ${
                                availableData?.length ? availableData.length : '0'
                            }`}
                        </Typography>
                    </Box>
                    <Box className={classes.searchContainerWrapper}>{renderSearch(1)}</Box>
                    <Box width="100%">
                        <QlikReportFilterSelectTagsAutocomplete
                            onHandleSelectTagCallback={tags => onHandleSelectTagCallback(tags, 1)}
                            tags={tags}
                        />
                    </Box>
                    <Box className={classes.listContainer}>
                        <List>
                            {availableData.map((item, index) => {
                                return (
                                    <ListItem
                                        key={index}
                                        className={classes.listItem}
                                        style={{
                                            backgroundColor: item.isSelected
                                                ? theme.palette.secondary.main
                                                : null
                                        }}
                                        onClick={() => handlePickedItem(item, 1)}>
                                        <ListItemText>
                                            <Typography
                                                className={classes.listItemText}
                                                sx={{
                                                    color: item.isSelected
                                                        ? theme.palette.secondary.contrastText
                                                        : theme.palette.text.primary
                                                }}>
                                                {(!useTechnicalFieldName
                                                    ? item?.label
                                                    : item?.title) ||
                                                    t(translation.datasetDialogNotAvailable)}
                                            </Typography>
                                        </ListItemText>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>
                </Box>
                <Box className={classes.middleContainer}>
                    <Box mt={2} mb={3}>
                        <IconTooltip title={t(translation.datasetDialogSwitcherTooltip)}>
                            <BaseSwitch
                                defaultChecked={false}
                                color="secondary"
                                checked={useTechnicalFieldName}
                                onClick={() => {
                                    setUseTechnicalFieldName(!useTechnicalFieldName)
                                }}
                            />
                        </IconTooltip>
                    </Box>
                    <IconTooltip title={t(translation.datasetButtonRightArrowTooltip)}>
                        <Button
                            className={classes.arrowContainer}
                            disabled={selectedList !== 1}
                            onClick={() => handleOnClick('add')}>
                            <KeyboardArrowRightIcon className={classes.icon} />
                        </Button>
                    </IconTooltip>
                    <IconTooltip title={t(translation.datasetButtonLeftArrowTooltip)}>
                        <Button
                            className={classes.arrowContainer}
                            disabled={selectedList !== 2}
                            onClick={() => handleOnClick('remove')}>
                            <KeyboardArrowLeftIcon className={classes.icon} />
                        </Button>
                    </IconTooltip>
                    <IconTooltip title={t(translation.datasetButtonReturnArrowTooltip)}>
                        <Button
                            className={classes.arrowContainer}
                            disabled={!selectedData?.length}
                            onClick={() => handleOnClick('reset')}>
                            <KeyboardReturnIcon className={classes.icon} />
                        </Button>
                    </IconTooltip>
                </Box>
                {/* righ container */}
                <Box className={classes.container}>
                    <Box className={classes.title}>
                        <Typography className={classes.primaryText}>
                            {t(translation.datasetSelectedFields)} {type}
                        </Typography>
                        <Typography className={classes.secondaryTextSeparator}>{' - '}</Typography>
                        <Typography className={classes.secondaryText}>
                            {`${t(translation.datasetFieldsShowingLabel)} ${
                                selectedData?.length ? selectedData.length : '0'
                            }`}
                        </Typography>
                    </Box>
                    <Box className={classes.searchContainerWrapper}>{renderSearch(2)}</Box>
                    <Box width="100%">
                        <QlikReportFilterSelectTagsAutocomplete
                            onHandleSelectTagCallback={tags => onHandleSelectTagCallback(tags, 2)}
                            tags={tags}
                        />
                    </Box>
                    <Box className={classes.listContainer}>
                        <List>
                            {selectedData.map((item, index) => {
                                return (
                                    <Box className={classes.selectedDataWrapper}>
                                        <ListItem
                                            key={index}
                                            className={classes.listItem}
                                            sx={{
                                                backgroundColor: item.isSelected
                                                    ? theme.palette.secondary.main
                                                    : null
                                            }}
                                            onClick={() => handlePickedItem(item, 2)}>
                                            <ListItemText>
                                                <Typography
                                                    className={classes.listItemText}
                                                    sx={{
                                                        color: item.isSelected
                                                            ? theme.palette.secondary.contrastText
                                                            : theme.palette.text.primary
                                                    }}>
                                                    {(!useTechnicalFieldName
                                                        ? item?.label
                                                        : item?.title) ||
                                                        t(translation.datasetDialogNotAvailable)}
                                                </Typography>
                                            </ListItemText>

                                            <IconTooltip title={t(translation.datasetMetaTooltip)}>
                                                <IconButton
                                                    aria-label="search"
                                                    onClick={() => handleEditSettings(item)}
                                                    style={{
                                                        color: item.isSelected
                                                            ? theme.palette.secondary.contrastText
                                                            : theme.palette.text.primary
                                                    }}>
                                                    <FlareIcon className={classes.flareIcon} />
                                                </IconButton>
                                            </IconTooltip>
                                        </ListItem>
                                    </Box>
                                )
                            })}
                        </List>
                    </Box>
                </Box>
            </Box>
            {visible ? (
                <Backdrop sx={{ zIndex: theme => theme.zIndex.drawer + 1 }} open={visible}>
                    <Box className={classes.customSettingContainer}>
                        <Box className={classes.customSettingsHeader}>
                            <Typography className={classes.titleContainer}>
                                {t(translation.datasetMetalabel)} - {editItem.title}
                            </Typography>
                        </Box>
                        <Box display="flex" className={classes.newLabelContainer}>
                            <Typography className={classes.newLabelTitle}>
                                {t(translation.datasetLabel)}
                            </Typography>
                            <Box flexGrow={1}>
                                <InputBase
                                    className={classes.input}
                                    placeholder={t(translation.datsetMetaInputLabel)}
                                    inputProps={{ 'aria-label': 'search dimensions' }}
                                    onChange={e => setNewLabel(e.target.value)}
                                    value={newLabel}
                                />
                            </Box>
                        </Box>
                        <Box className={classes.buttonContainer}>
                            <Button
                                onClick={() => setEditVisible(false)}
                                className={classes.buttonCancel}>
                                {t(translation.datasetBtnCancel)}
                            </Button>
                            <Button onClick={() => saveEditData()} className={classes.buttonSave}>
                                {t(translation.datasetBtnSave)}
                            </Button>
                        </Box>
                    </Box>
                </Backdrop>
            ) : null}
        </>
    )
}

export default QlikDatasetMasterItemOptions

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        display: 'flex',
        marginTop: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingLeft: '20px',
        paddingRight: '20px',
        height: '380px'
    },
    container: {
        display: 'flex',
        flex: 0.45,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxHeight: '-webkit-fill-available'
    },
    title: {
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '15px'
    },
    primaryText: {
        color: theme.palette.text.primary,
        fontWeight: 600,
        fontSize: '14px'
    },
    secondaryText: {
        color: theme.palette.text.secondary,
        fontWeight: 600,
        fontSize: '0.875rem'
    },
    secondaryTextSeparator: {
        color: theme.palette.divider,
        fontWeight: 600,
        fontSize: '0.875rem',
        paddingLeft: '5px',
        paddingRight: '5px'
    },
    middleContainer: {
        display: 'flex',
        flex: 0.1,
        marginLeft: '10px',
        marginRight: '10px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    arrowContainer: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px 15px',
        margin: '10px 0px',
        border: `1px solid ${theme.palette.divider}`
    },
    icon: {
        width: '24px',
        height: '24px'
    },
    searchContainerWrapper: {
        marginBottom: '15px',
        width: '-webkit-fill-available'
    },
    searchContainer: {
        display: 'flex',
        fontWeight: 600,
        textAlign: 'left',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
        height: '40px',
        padding: '8px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:hover': {
            backgroundColor: theme.palette.background.default
        }
    },
    iconButton: {
        color: theme.palette.text.primary,
        width: '24px',
        height: '24px',
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.text.secondary
        }
    },
    input: {
        color: theme.palette.text.primary,
        width: '-webkit-fill-available',
        marginLeft: theme.spacing(1),
        flex: 1,
        height: '24px',
        fontSize: '14px'
    },
    listContainer: {
        marginTop: '15px',
        minHeight: '225px',
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        overflowY: 'scroll',
        backgroundColor: darken(theme.palette.background.default, 0.025)
    },
    listItem: {
        height: '32px',
        padding: '8px',
        fontSize: '0.875rem',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    flareIcon: {
        width: '16px',
        height: '16px'
    },
    customSettingContainer: {
        position: 'absolute',
        width: '325px',
        height: '160px',
        top: '140px',
        right: '45px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: darken(theme.palette.background.paper, 0),
        zIndex: 1
    },
    titleContainer: {
        color: theme.palette.text.primary,
        fontWeight: 600,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    newLabelContainer: {
        marginLeft: '8px',
        marginRight: '8px',
        fontWeight: 600,
        textAlign: 'left',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
        height: '40px',
        padding: '8px',
        paddingTop: '10px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:hover': {
            backgroundColor: theme.palette.background.default
        }
    },
    buttonSave: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            boxShadow: 'none'
        },
        '&:disabled': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.disabled,
            boxShadow: 'none'
        }
    },
    buttonCancel: {
        marginRight: '20px',
        paddingLeft: '25px',
        paddingRight: '25px',
        minWidth: '96px',
        height: '36px',
        borderRadius: '25px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: `${theme.palette.background.default} !important`,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: `${theme.palette.background.default} !important`,
            boxShadow: 'none'
        }
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: '8px',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: '20px'
    },
    selectedDataWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listItemText: {
        fontSize: '0.825rem'
    },
    newLabelTitle: {
        position: 'absolute',
        fontSize: '10px',
        top: '56px',
        left: '12px'
    },
    customSettingsHeader: {
        padding: '8px',
        marginBottom: '15px',
        borderBottom: `1px solid ${theme.palette.divider}`
    }
}))
