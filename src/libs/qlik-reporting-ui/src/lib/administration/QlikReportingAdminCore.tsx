import React, { FC, useCallback, useEffect, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import {
    Box,
    CircularProgress,
    IconButton,
    InputBase,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Theme,
    Typography,
    useTheme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { Dataset } from '@libs/common-models'
import { useI18n } from '@libs/common-providers'
import {
    AlertType,
    ConfirmationDialog,
    IconTooltip,
    renderVizType,
    useAlertContext
} from '@libs/common-ui'
import { datasetService } from '@libs/core-services'
import { useQlikLoaderContext, useQlikMasterItemContext } from '@libs/qlik-providers'

import { useQlikReportingContext } from '../contexts/QlikReportingContext'
import QlikAdminAddButton from './components/button/QlikAdminAddButton'
import QlikAdminExportButton from './components/button/QlikAdminExportButton'
import QlikAdminDatasetDialog, {
    QlikDatasetProps
} from './components/dialog/QlikAdminDatasetDialog'
import QlikAdminReportsDialog from './components/dialog/QlikAdminReportsDialog'
import QlikDatasetDialogActions from './components/list/QlikDatasetDialogActionsList'
import translation from './constants/translations'

type TQlikReportingAdminClasses = {
    root: string
    tableContainer: string
    buttonSave: string
    buttonCancel: string
    buttonOpenReport: string
    tableReportHeader: string
    tableReportCell: string
}

export interface IQlikReportingAdminCoreProps {
    height?: number
    onDeleteCascade?: boolean
    isExportVisible?: boolean
    classNames?: Partial<TQlikReportingAdminClasses>
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    LoaderComponent?: JSX.Element
}

const QlikReportingAdminCore: FC<IQlikReportingAdminCoreProps> = ({
    height = 500,
    onDeleteCascade = true,
    color = 'secondary',
    isExportVisible = false,
    classNames,
    LoaderComponent
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [loadingId, setLoadingId] = useState<number>(0)
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [, setIsSearchActive] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>('')
    const [datasets, setDatasets] = useState<any>([])
    const [rows, setRows] = useState<any>([])
    const [open, setOpen] = useState<boolean>(false)
    const initReportDialogData = {
        show: false,
        datasetId: 0
    }
    const [reportDialogData, setReportDialogData] = useState<{ show: boolean; datasetId: number }>(
        initReportDialogData
    )
    const [editData, setEditData] = useState<any>(null)
    const [editDatasetId, setEditDatasetId] = useState<any>(null)
    const [op, setOp] = useState<string>('')
    const [activeDatasetId, setActiveDatasetId] = useState<number>(null)

    const { qMasterDimensionsMap, qMasterMeasuresMap } = useQlikMasterItemContext()
    const { isQlikMasterItemLoading } = useQlikLoaderContext()
    const { deleteDataset, getDatasetById } = useQlikReportingContext()
    const { showToast } = useAlertContext()

    const { t } = useI18n()
    const { classes } = useStyles()

    const columns = [
        {
            id: 'title',
            label: t(translation.datasetTableColumnTitle),
            minWidth: 50,
            maxWidth: 100,
            format: 'string',
            visible: true
        },
        {
            id: 'description',
            label: t(translation.datasetTableColumnDescription),
            minWidth: 50,
            maxWidth: 100,
            format: 'string',
            visible: true
        },
        {
            id: 'label',
            label: t(translation.datasetLabel),
            minWidth: 50,
            maxWidth: 100,
            format: 'string',
            visible: true
        },
        {
            id: 'dimensions',
            label: t(translation.datasetDimensions),
            minWidth: 50,
            maxWidth: 200,
            format: 'string',
            visible: true
        },
        {
            id: 'measures',
            label: t(translation.datasetMeasures),
            minWidth: 50,
            maxWidth: 200,
            format: 'string',
            visible: true
        },
        {
            id: 'filters',
            label: t(translation.datasetFilters),
            maxWidth: 200,
            minWidth: 100,
            format: 'string',
            visible: true
        },

        {
            id: 'tags',
            label: t(translation.datasetTags),
            minWidth: 50,
            maxWidth: 200,
            format: 'button',
            visible: true
        },
        {
            id: 'charts',
            label: 'Charts',
            maxWidth: 200,
            minWidth: 100,
            format: 'string',
            visible: true
        },
        {
            id: 'actions',
            label: '',
            minWidth: 50,
            format: 'string',
            visible: true
        }
    ]

    const mapLabels = useCallback((data: any, elements: any, isDim = true) => {
        let labels = ''
        elements.forEach(ele => {
            const item = data?.find(d => d.qLibraryId === ele.qId)
            if (item?.label)
                labels += `, ${
                    ele.label
                        ? t(ele.label)
                        : item?.label || (isDim ? item.fieldDef : item.title || 'N/A')
                }`
        })
        return labels.slice(2, labels.length)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getAndSetDatasetRows = useCallback(
        (datasets: Dataset[]) =>
            datasets.map(dataset => {
                const dims = qMasterDimensionsMap.get(dataset.qlikAppId)
                const ms = qMasterMeasuresMap.get(dataset.qlikAppId)
                const dimensionTitles = mapLabels(dims, dataset.dimensions)
                const measuresTitles = mapLabels(ms, dataset.measures, false)
                const filtersTitles = mapLabels(dims, dataset.filters)
                const charts = dataset.visualizations.map((v: { name: any }) => v.name)

                return {
                    id: dataset.id,
                    title: dataset.title,
                    description: dataset.description,
                    label: dataset.label,
                    dimensions: dimensionTitles,
                    measures: measuresTitles,
                    filters: filtersTitles,
                    charts: charts,
                    tags: dataset.tags
                }
            }),
        [mapLabels, qMasterDimensionsMap, qMasterMeasuresMap]
    )

    const filterData = useCallback(
        (value: string) => {
            setSearchText(value)
            const filteredList = getAndSetDatasetRows(datasets).filter(item =>
                item.title.toLowerCase().includes(value.toLowerCase())
            )
            setRows(filteredList)
        },
        [datasets, getAndSetDatasetRows, setSearchText, setRows]
    )

    const loadData = useCallback(async () => {
        try {
            if (!isQlikMasterItemLoading) {
                setIsLoading(true)
                const datasets = await datasetService.getAllDatasets()
                setDatasets(datasets)
                const rows = getAndSetDatasetRows(datasets)
                setRows(rows)
                if (searchText) filterData(searchText)
            }
        } catch (error) {
            console.log('Qplus Error', error)
        } finally {
            setIsLoading(false)
        }
    }, [getAndSetDatasetRows, filterData, isQlikMasterItemLoading, searchText])

    const mapMasterItems = useCallback(
        (items: any[], masterData: any[]) =>
            items
                .map(item => {
                    const dsData = masterData?.find(d => d.qLibraryId === item.qId)
                    if (dsData) {
                        dsData.label = item?.label
                            ? t(item.label)
                            : dsData?.title || dsData?.fieldName?.replace('=', '')
                        dsData.isEdited = true
                        return dsData
                    }
                    return null
                })
                .filter(Boolean),
        [t]
    )

    const loadDataset = useCallback(
        async (id: number) => {
            const ds = await getDatasetById(id)
            const editData: QlikDatasetProps = {
                qlikAppId: ds.qlikAppId,
                title: ds.title,
                description: ds.description ? ds.description : '',
                label: ds.label ? ds.label : '',
                tags: ds.tags,
                dimensions: [],
                measures: [],
                filters: [],
                visualizations: ds?.visualizations || []
            }
            const dimensions = qMasterDimensionsMap.get(ds.qlikAppId)
            const measures = qMasterMeasuresMap.get(ds.qlikAppId)
            editData.dimensions = mapMasterItems(ds.dimensions, dimensions)
            editData.measures = mapMasterItems(ds.measures, measures)
            editData.filters = mapMasterItems(ds.filters, dimensions)
            return editData
        },
        [qMasterDimensionsMap, qMasterMeasuresMap, getDatasetById, mapMasterItems]
    )

    useEffect(() => {
        const loadDataIfNeeded = async () => {
            if (isQlikMasterItemLoading) {
                setIsLoading(true)
            } else {
                await loadData()
            }
        }
        loadDataIfNeeded()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isQlikMasterItemLoading])

    useEffect(() => {
        const rows = getAndSetDatasetRows(datasets)
        setRows(rows)
    }, [datasets, getAndSetDatasetRows])

    const handleOpenSearchClick = () => {
        setSearchText('')
        setIsSearchActive(true)
    }

    const handleCloseSearchClick = () => {
        setSearchText('')
        setIsSearchActive(false)
        const rowsList = getAndSetDatasetRows(datasets)
        setRows(rowsList)
    }

    const handleEditDataset = async (id: number) => {
        try {
            setLoadingId(id)
            const mappedEditData = await loadDataset(id)
            setEditData(mappedEditData)
            setEditDatasetId(id)
            setOp('edit')
            setOpen(true)
        } catch (error) {
            console.log('Qplus Error', error)
        } finally {
            setLoadingId(0)
        }
    }

    const handleNewDataset = () => {
        setEditData(null)
        setEditDatasetId(0)
        setOp('new')
        setOpen(true)
    }

    const handleDeleteDataset = async (id: number) => {
        try {
            setIsLoading(true)
            await deleteDataset(id, onDeleteCascade)
            await loadData()
            showToast(`${t(translation.datasetDeleteSuccessMsg)}`, AlertType.SUCCESS)
        } catch (error) {
            showToast(`${error}`, AlertType.ERROR)
            console.log('Qplus Error', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleShowReportDialog = async (datasetId: number) => {
        setReportDialogData({ show: true, datasetId })
    }

    const handleSearchChange = e => {
        filterData(e.target.value)
    }

    const handleOnCloseConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false)
    }

    const handleOnOpenConfirmationDialog = (id: number) => {
        setActiveDatasetId(id)
        setIsConfirmationDialogOpen(true)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const isControlEnabled = !isLoading

    const theme = useTheme()

    return (
        <Box className={`${classes.root} ${classNames?.root}`}>
            <Box className={classes.container}>
                <Box className={classes.searchBox}>
                    <Box display="flex" className={classes.searchContainer}>
                        <IconTooltip title={t(translation.datasetSearch)}>
                            <IconButton
                                aria-label="search"
                                onClick={handleOpenSearchClick}
                                className={classes.iconButton}>
                                <SearchIcon className={classes.icon} />
                            </IconButton>
                        </IconTooltip>
                        <Box flexGrow={1}>
                            <InputBase
                                className={classes.input}
                                placeholder={t(translation.datasetSearchPlaceholder)}
                                inputProps={{ 'aria-label': 'search datasets' }}
                                onChange={e => handleSearchChange(e)}
                                value={searchText}
                            />
                        </Box>
                        {searchText ? (
                            <IconTooltip title="">
                                <IconButton
                                    aria-label="search"
                                    onClick={handleCloseSearchClick}
                                    className={classes.iconButton}>
                                    <CloseIcon className={classes.icon} />
                                </IconButton>
                            </IconTooltip>
                        ) : null}
                    </Box>
                    <Box display="flex" justifyContent="flex-end" alignItems="center">
                        {isExportVisible && (
                            <Box mr={1}>
                                <QlikAdminExportButton disabled={isLoading || rows?.length === 0} />
                            </Box>
                        )}
                        <Box>
                            <QlikAdminAddButton
                                handleOnClickCallback={handleNewDataset}
                                disabled={!isControlEnabled}
                            />
                        </Box>
                        {open && (
                            <QlikAdminDatasetDialog
                                classNames={{
                                    buttonCancel: classNames?.buttonCancel || '',
                                    buttonSave: classNames?.buttonSave || ''
                                }}
                                onCreateNewDataset={loadData}
                                open={open}
                                editData={editData}
                                editDatasetId={editDatasetId}
                                closeModal={() => setOpen(false)}
                                op={op}
                                color={color}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
            <TableContainer
                className={`${classes.tableContainer} ${classNames?.tableContainer || ''}`}
                style={{ height: height }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map(column =>
                                column.visible ? (
                                    <TableCell
                                        key={column.id}
                                        className={classes.tableCell}
                                        sx={{
                                            minWidth: column.minWidth,
                                            maxWidth: column.maxWidth
                                        }}
                                        align={'left'}>
                                        {column.label}
                                    </TableCell>
                                ) : null
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isControlEnabled ? (
                            rows && rows.length > 0 ? (
                                rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(dataset => {
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={dataset.id}>
                                                {columns.map(column => {
                                                    const value = dataset[column.id]
                                                    const id = dataset['id']

                                                    return column.visible ? (
                                                        <TableCell
                                                            className={classes.tableRowCell}
                                                            sx={{ maxWidth: column.maxWidth }}
                                                            key={column.id}
                                                            align={'left'}>
                                                            {column.id === 'tags' ? (
                                                                <Box className={classes.tagsRow}>
                                                                    {value.map((v, index) => (
                                                                        <Box
                                                                            key={v}
                                                                            className={
                                                                                classes.tagContainer
                                                                            }>
                                                                            <Typography
                                                                                className={
                                                                                    classes.tagsText
                                                                                }>
                                                                                {v}
                                                                            </Typography>
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            ) : column.id === 'actions' ? (
                                                                loadingId !== id ? (
                                                                    <QlikDatasetDialogActions
                                                                        id={id}
                                                                        onDatasetDeleteCallback={
                                                                            handleOnOpenConfirmationDialog
                                                                        }
                                                                        onDatasetEditCallback={
                                                                            handleEditDataset
                                                                        }
                                                                        onShowReportCallback={
                                                                            handleShowReportDialog
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <Box p={1}>
                                                                        <CircularProgress
                                                                            color={color}
                                                                            className={
                                                                                classes.progress
                                                                            }
                                                                            size={26}
                                                                        />
                                                                    </Box>
                                                                )
                                                            ) : column.id === 'charts' ? (
                                                                value?.map(v => (
                                                                    <span
                                                                        key={v}
                                                                        style={{
                                                                            paddingRight: '4px'
                                                                        }}>
                                                                        <IconTooltip title={v}>
                                                                            {renderVizType(
                                                                                v,
                                                                                theme.palette.text
                                                                                    .primary
                                                                            )}
                                                                        </IconTooltip>
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                value
                                                            )}
                                                        </TableCell>
                                                    ) : null
                                                })}
                                            </TableRow>
                                        )
                                    })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            textAlign="center"
                                            minHeight={`${height - 120}px`}
                                            width="100%">
                                            <Typography
                                                style={{ fontSize: '0.925rem', opacity: 0.6 }}>
                                                {t(translation.datasetEmptyTableMsg)}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8}>
                                    <Box
                                        className={classes.loadingContainer}
                                        minHeight={`${height - 120}px`}>
                                        {LoaderComponent || (
                                            <CircularProgress
                                                color={color}
                                                className={classes.progress}
                                                size={36}
                                            />
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={datasets.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {isConfirmationDialogOpen && (
                <ConfirmationDialog
                    primaryText={`${t(translation.datasetConfirmationDialogMsg1)}${
                        onDeleteCascade ? ` ${t(translation.datasetConfirmationDialogMsg2)}` : ''
                    }?`}
                    noText={t(translation.datasetConfirmationDialogNo)}
                    yesText={t(translation.datasetConfirmationDialogYes)}
                    dialogTitleText={t(translation.datasetConfirmationDialogTitle)}
                    onClose={handleOnCloseConfirmationDialog}
                    onNo={handleOnCloseConfirmationDialog}
                    onYes={() => {
                        handleDeleteDataset(activeDatasetId)
                        handleOnCloseConfirmationDialog()
                    }}
                    hideBackdrop={false}
                />
            )}
            {reportDialogData?.show && (
                <QlikAdminReportsDialog
                    dismissDialogCallback={() => setReportDialogData(initReportDialogData)}
                    datasetId={reportDialogData?.datasetId}
                />
            )}
        </Box>
    )
}

export default QlikReportingAdminCore

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: theme.palette.background.paper
    },
    container: {
        width: '100%',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper
    },
    tableContainer: {
        marginTop: '15px',
        minHeight: 300,
        backgroundColor: theme.palette.background.paper
    },
    loadingContainer: {
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.paper
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'left',
        marginBottom: '50px'
    },
    headerTitle: {
        fontWeight: 600,
        color: theme.palette.primary.main
    },
    searchBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    progress: {
        alignSelf: 'center'
    },
    tagsText: {
        color: theme.palette.secondary.contrastText,
        fontSize: '0.875rem'
    },
    searchContainer: {
        fontWeight: 600,
        textAlign: 'left',
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.background.default,
        height: '40px',
        width: '400px',
        padding: '8px',
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        '&:hover': {
            backgroundColor: theme.palette.background.default
        }
    },
    iconButton: {
        color: theme.palette.primary.main,
        width: '24px',
        height: '24px',
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.secondary.main
        }
    },
    icon: {
        width: '24px',
        height: '24px'
    },
    input: {
        color: theme.palette.primary.main,
        marginLeft: theme.spacing(1),
        flex: 1,
        height: '24px',
        fontSize: '14px'
    },
    tableCell: {
        fontWeight: 500,
        fontStyle: 'italic',
        color: theme.palette.text.primary,
        opacity: 0.5,
        backgroundColor: theme.palette.background.paper,
        borderBottomWidth: '3px',
        borderBottomColor: theme.palette.divider
    },
    tableRowCell: {
        padding: '5px',
        paddingLeft: '15px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '0.825rem',
        overflow: 'hidden',
        borderBottomWidth: '1px',
        borderBottomColor: theme.palette.divider
    },
    tagsRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
    tagContainer: {
        paddingLeft: '15px',
        paddingRight: '15px',
        borderRadius: '25px',
        marginRight: '5px',
        height: '25px',
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
        flexDirection: 'row',
        display: 'flex',
        marginTop: '2px',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))
