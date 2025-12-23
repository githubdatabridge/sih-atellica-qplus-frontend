import React, { FC, useEffect, useCallback } from 'react'

import { useMediaQuery } from 'react-responsive'

import CloseIcon from '@mui/icons-material/Close'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import SearchIcon from '@mui/icons-material/Search'
import { CircularProgress, InputBase, IconButton, useTheme, Box, Theme } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { useAuthContext } from '@libs/common-providers'
import { IconTooltip, AlertType, useAlertContext, renderVizType } from '@libs/common-ui'
import { storage, KEYS } from '@libs/common-utils'
import { useParseFilters } from '@libs/core-hooks'
import {
    ReportDataset,
    ReportMeasures,
    ReportDimensions,
    ReportVisualizations,
    ReportFilters
} from '@libs/core-models'
import { useQlikMasterItemContext, useQlikAppContext } from '@libs/qlik-providers'

import { ROLE_ADMIN } from '../../constants/constants'
import translation from '../../constants/translations'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { useParseDimensions, useParseMeasures } from '../../hooks'
import { checkIfReportIsReadOnly } from '../../utils'
import QlikReportingActionsListItem from '../list/QlikReportingActionsListItem'

interface IQlikReportingShareListDialogProps {
    qlikAppId: string
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    LoaderComponent?: JSX.Element
    onHandleRestoreCallback?: (
        vizType: string,
        dataset: ReportDataset,
        dimensions: ReportDimensions[],
        measures: ReportMeasures[],
        visualizations: ReportVisualizations[],
        options: any,
        filters?: ReportFilters[],
        isSystem?: boolean,
        qsBookmarkId?: string,
        reportId?: number,
        title?: string,
        description?: string,
        isPinwallable?: boolean
    ) => void
}

const QlikReportingShareListDialog: FC<IQlikReportingShareListDialogProps> = ({
    qlikAppId,
    color,
    LoaderComponent,
    onHandleRestoreCallback
}) => {
    const { classes } = useStyles()
    const { t } = useI18n()
    const theme = useTheme<Theme>()
    const { showToast } = useAlertContext()
    const [qlikCurrAppId, setQlikCurrAppId] = React.useState<string>(qlikAppId)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [rows, setRows] = React.useState<any[]>([])
    const [datasets, setDatasets] = React.useState<ReportDataset[]>([])
    const [text, setText] = React.useState<string>('')
    const [reports, setReports] = React.useState([])
    const isTablet = useMediaQuery({ query: '(max-width: 620px)' })
    const { qAppMap } = useQlikAppContext()
    const { appUser } = useAuthContext()
    const {
        reportId,
        reportSelectDatasets,
        reportDefaultFilters,
        clearReport,
        loadSharedReports,
        deleteReport,
        unShareReport
    } = useQlikReportingContext()
    const { qMasterDimensionsMap, qMasterMeasuresMap } = useQlikMasterItemContext()
    const { setParseDimensions } = useParseDimensions()
    const { setParseMeasures } = useParseMeasures()
    const { setParseFilters } = useParseFilters()

    const columns = [
        {
            id: 'visualizationType',
            label: '',
            minWidth: 70,
            format: 'icon',
            visible: true
        },
        {
            id: 'title',
            label: t(translation.reportingDialogTabListColumnTitle),
            minWidth: 150,
            format: 'string',
            visible: true
        },
        {
            id: 'description',
            label: t(translation.reportingDialogTabListColumnDescription),
            minWidth: 150,
            format: 'string',
            visible: true
        },
        {
            id: 'system',
            label: t(translation.reportingDialogTabListColumnIsSystem),
            minWidth: 50,
            format: 'icon',
            visible: false
        },
        {
            id: 'createdBy',
            label: t(translation.reportingDialogTabListColumnCreatedBy),
            minWidth: 120,
            format: 'string',
            visible: true
        },
        {
            id: 'updatedAt',
            label: t(translation.reportingDialogTabListColumnLastModified),
            minWidth: 120,
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

    const formatDateHelper = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // JavaScript months are 0-indexed
        const year = date.getFullYear()
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    }

    const loadData = useCallback(async () => {
        const rows = []
        const reports = await loadSharedReports()
        for (const report of reports) {
            rows.push({
                id: report.id,
                title: report.title,
                description: report.description,
                isPinwallable: report.isPinwallable,
                dataset: report.dataset.title,
                vizType: report.visualizationType,
                isSystem: report.isSystem,
                isShared: report.shared,
                updatedAt: formatDateHelper(report.updatedAt),
                createdBy: report.user.fullName
            })
        }
        setReports(reports)
        setRows(rows)
        setIsLoading(false)
    }, [])

    useEffect(() => {
        setQlikCurrAppId(qlikAppId)
    }, [qlikAppId])

    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (reportSelectDatasets) setDatasets(reportSelectDatasets)
    }, [reportSelectDatasets])

    const handleRestoreReport = (id: number) => {
        setIsLoading(true)
        const rows = reports.filter(r => r.id === id)

        if (rows.length > 0) {
            const report = rows[0] as any
            const filteredDataset = datasets?.find(d => d.id === report.datasetId)
            if (filteredDataset) {
                const dimensions = qMasterDimensionsMap.get(filteredDataset.qlikAppId)
                const measures = qMasterMeasuresMap.get(filteredDataset.qlikAppId)
                const lDimensions = setParseDimensions(report.content.dimensions, dimensions)
                const lMeasures = setParseMeasures(report.content.measures, measures)
                const lFilters = setParseFilters(
                    report.content.filters,
                    dimensions,
                    reportDefaultFilters
                )
                onHandleRestoreCallback(
                    report.visualizationType,
                    filteredDataset, // TO DO: datasetFlag should decide if this should be rDataset or filteredDataset[0],
                    lDimensions,
                    lMeasures,
                    filteredDataset.visualizations,
                    report.content.options,
                    lFilters,
                    report.isSystem,
                    report.qlikState?.qsBookmarkId ? report.qlikState.qsBookmarkId : null,
                    appUser.roles.includes(ROLE_ADMIN) || appUser.appUserId === report.appUserId
                        ? report.id
                        : 0,
                    report.title,
                    report.description,
                    report.isPinwallable
                )
            } else {
                showToast(t(translation.reportingRestoreDatasetError), AlertType.ERROR)
            }
        }
        setIsLoading(false)
    }

    const handleDeleteReport = async (id: number) => {
        setIsLoading(true)
        const report = reports?.find(r => r.id === id)
        if (report.isSystem && !appUser.roles.includes(ROLE_ADMIN)) {
            showToast(
                t(translation.reportingDialogTabListToastDeleteSystemReportFailed),
                AlertType.ERROR
            )
            setIsLoading(false)
            return
        }
        if (appUser.appUserId !== report.appUserId && !appUser.roles.includes(ROLE_ADMIN)) {
            showToast(t(translation.reportingDialogTabListToastDeleteReportFailed), AlertType.ERROR)
            setIsLoading(false)
            return
        }

        // remove bookmark if needed
        if (report?.qlikState?.qsBookmarkId) {
            const qApp = qAppMap.get(qlikCurrAppId)
            await qApp?.qApi?.$apiBookmark.remove(report.qlikState.qsBookmarkId)
        }

        await deleteReport(id)
        await loadData()
        showToast(t(translation.reportingDialogTabListToastDeleted), AlertType.SUCCESS)
    }

    const handleUnshareReport = async (id: number) => {
        try {
            setIsLoading(true)
            const unselectedUser: any = {
                appUserIds: [appUser.appUserId]
            }
            await unShareReport(id, unselectedUser)
            await loadData()
            if (reportId === id) {
                await clearReport()
            }
            showToast(
                t(translation.reportingDialogTabListToastUnshareReportSuccess),
                AlertType.SUCCESS
            )
        } catch (error) {
            showToast(
                t(translation.reportingDialogTabListToastUnshareReportFailed),
                AlertType.ERROR
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleFiltering = (text: string) => {
        const rowsList = []
        for (const report of reports) {
            rowsList.push({
                id: report.id,
                title: report.title,
                description: report.description,
                isPinwallable: report.isPinwallable,
                dataset: report.dataset.title,
                vizType: report.visualizationType,
                isSystem: report.isSystem,
                isShared: report.shared,
                updatedAt: formatDateHelper(report.updatedAt),
                createdBy: report.user.fullName
            })
        }
        let filteredList: any[] = []
        filteredList = rowsList.filter(item => {
            return item.title.toLowerCase().includes(text.toLowerCase())
        })

        setRows(filteredList)
    }

    const handleSearchChange = async e => {
        handleFiltering(e.target.value)
        setText(e.target.value)
    }

    const handleCancelSearch = () => {
        handleFiltering('')
        setText('')
        setPage(0)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    if (isLoading)
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ height: '573px' }}>
                {LoaderComponent || <CircularProgress size="4rem" color={color} />}
            </Box>
        )

    return (
        <Paper className={classes.root} elevation={0}>
            <Box className={classes.filterContainer}>
                <Box className={classes.baseSearchContainer}>
                    <Box sx={{ width: '95%' }}>
                        <InputBase
                            value={text}
                            className={classes.input}
                            placeholder={t(translation.reportingSearchPlaceholder)}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={e => handleSearchChange(e)}
                        />
                    </Box>
                    <Box>
                        {text ? (
                            <IconTooltip title={t(translation.reportingDialogCancelTooltip)}>
                                <IconButton
                                    aria-label="cancel"
                                    className={classes.listHeaderIcon}
                                    onClick={handleCancelSearch}>
                                    <CloseIcon />
                                </IconButton>
                            </IconTooltip>
                        ) : (
                            <IconTooltip title={t(translation.reportingDialogCloseTooltip)}>
                                <IconButton aria-label="search" className={classes.listHeaderIcon}>
                                    <SearchIcon />
                                </IconButton>
                            </IconTooltip>
                        )}
                    </Box>
                </Box>
            </Box>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    {!isTablet && (
                        <TableHead>
                            <TableRow>
                                {columns.map(column =>
                                    column.visible ? (
                                        <TableCell
                                            key={column.id}
                                            className={classes.tableCell}
                                            sx={{ minWidth: column.minWidth }}
                                            align={
                                                column.format === 'number'
                                                    ? 'right'
                                                    : column.format === 'boolean'
                                                    ? 'center'
                                                    : 'left'
                                            }>
                                            <Typography className={classes.tableCellHeaderText}>
                                                {column?.label}
                                            </Typography>
                                        </TableCell>
                                    ) : null
                                )}
                            </TableRow>
                        </TableHead>
                    )}
                    <TableBody>
                        {rows && rows.length > 0 ? (
                            rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(row => {
                                    const isAdminOn = storage.load(KEYS.QPLUS_ROLE_IS_ADMIN)

                                    const readOnly = checkIfReportIsReadOnly(
                                        row,
                                        appUser,
                                        isAdminOn
                                    )

                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map(column => {
                                                const value = row[column.id]
                                                const id = row['id']

                                                return column.visible ? (
                                                    <TableCell
                                                        key={column.id}
                                                        align={
                                                            typeof value === 'number'
                                                                ? 'right'
                                                                : typeof value === 'boolean' ||
                                                                  column.format === 'icon'
                                                                ? 'center'
                                                                : 'left'
                                                        }
                                                        className={classes.tableRowCell}>
                                                        {column.id === 'actions' ? (
                                                            <QlikReportingActionsListItem
                                                                id={id}
                                                                readOnly={readOnly}
                                                                isAdmin={appUser.roles.includes(
                                                                    ROLE_ADMIN
                                                                )}
                                                                sharedWithMe={true}
                                                                onReportRestoreCallback={
                                                                    handleRestoreReport
                                                                }
                                                                onReportDeleteCallback={
                                                                    handleDeleteReport
                                                                }
                                                                onReportUnshareCallback={
                                                                    handleUnshareReport
                                                                }
                                                            />
                                                        ) : column.id === 'visualizationType' ? (
                                                            <IconTooltip
                                                                title={
                                                                    row?.vizType?.[0].toUpperCase() +
                                                                    row?.vizType?.slice(1)
                                                                }>
                                                                {renderVizType(
                                                                    row.vizType,
                                                                    theme.palette.text.primary
                                                                )}
                                                            </IconTooltip>
                                                        ) : column.id === 'system' ? (
                                                            row.isSystem ? (
                                                                <DoneAllIcon
                                                                    className={classes.icon}
                                                                />
                                                            ) : null
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
                                <TableCell colSpan={5}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        textAlign="center"
                                        minHeight={`325px`}
                                        width="100%">
                                        <Typography
                                            style={{ fontSize: '0.925rem', fontStyle: 'oblique' }}>
                                            {t(translation.reportingDialogSharedListEmpty)}
                                        </Typography>
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
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default QlikReportingShareListDialog

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none'
    },
    filterContainer: {
        minHeight: '70px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '25px',
        '@media (max-width: 586px)': {
            paddingRight: '25px'
        }
    },
    baseSearchContainer: {
        border: '1px solid rgba(0, 0, 0, 0.2)',
        backgroundColor: theme.palette.background.default,
        borderRadius: '10px',
        height: '40px',
        width: '53%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        '@media (max-width: 586px)': {
            width: '100%'
        }
    },
    container: {
        minHeight: 450,
        maxHeight: 450
    },
    checkboxContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '10px',
        marginRight: '10px'
    },
    checkboxText: {
        fontSize: '14px',
        color: theme.palette.text.secondary
    },
    checkbox: {
        padding: 0,
        color: theme.palette.text.secondary,
        marginRight: '6px'
    },
    input: {
        marginLeft: theme.spacing(1),
        width: '100%',
        fontSize: '1rem'
    },
    listHeaderIcon: {
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.text.secondary
        }
    },
    tableCell: {
        fontWeight: 500,
        fontStyle: 'italic',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        borderBottomWidth: '3px',
        borderBottomColor: theme.palette.divider
    },
    tableCellHeaderText: {
        opacity: 0.5,
        fontSize: '0.825rem'
    },
    tableRowCell: {
        padding: '5px',
        paddingLeft: '15px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '13px',
        overflow: 'hidden',
        borderBottomWidth: '1px',
        borderBottomColor: theme.palette.divider,
        cursor: 'not-allowed'
    },
    icon: {
        color: theme.palette.text.secondary,
        marginRight: '35px'
    }
}))
