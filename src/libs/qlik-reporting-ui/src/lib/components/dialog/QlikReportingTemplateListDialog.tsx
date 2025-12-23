import React, { FC, useCallback, useEffect, useState } from 'react'

import { useMediaQuery } from 'react-responsive'
import { useMount } from 'react-use'

import CloseIcon from '@mui/icons-material/Close'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import SearchIcon from '@mui/icons-material/Search'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'
import {
    Box,
    Checkbox,
    CircularProgress,
    IconButton,
    InputBase,
    Paper,
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

import { useAuthContext, useI18n } from '@libs/common-providers'
import {
    AlertType,
    BaseSwitch,
    IconTooltip,
    renderVizType,
    useAlertContext
} from '@libs/common-ui'
import { KEYS, storage } from '@libs/common-utils'
import { useParseFilters } from '@libs/core-hooks'
import {
    ReportDataset,
    ReportDimensions,
    ReportFilters,
    ReportMeasures,
    ReportVisualizations
} from '@libs/core-models'
import { useQlikAppContext, useQlikMasterItemContext } from '@libs/qlik-providers'

import { ROLE_ADMIN } from '../../constants/constants'
import translation from '../../constants/translations'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { useParseDimensions, useParseMeasures } from '../../hooks'
import { checkIfHasWriteScopes, checkIfReportIsReadOnly } from '../../utils'
import QlikReportingActionsListItem from '../list/QlikReportingActionsListItem'

interface IQlikReportingTemplateListDialogProps {
    qlikAppId: string
    views: string[]
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
        isPinwallable?: boolean,
        isImported?: boolean
    ) => void
}

const QlikReportingTemplateListDialog: FC<IQlikReportingTemplateListDialogProps> = ({
    qlikAppId,
    color,
    views,
    LoaderComponent,
    onHandleRestoreCallback
}) => {
    const { classes } = useStyles()
    const [qlikCurrAppId, setQlikCurrAppId] = useState<string>(qlikAppId)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false)
    const [hasAdminWriteScopes, setHasAdminWriteScopes] = useState<boolean>(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [rows, setRows] = useState<any[]>([])
    const [text, setText] = useState<string>('')
    const [isSystemChecked, setIsSystemChecked] = useState<boolean>(false)
    const [reports, setReports] = useState([])
    const { qAppMap } = useQlikAppContext()
    const { qMasterDimensionsMap, qMasterMeasuresMap } = useQlikMasterItemContext()
    const { appUser } = useAuthContext()
    const { reportDefaultFilters, loadTemplateReports, clearReport, deleteReport, patchReport } =
        useQlikReportingContext()

    const { setParseDimensions } = useParseDimensions()
    const { setParseMeasures } = useParseMeasures()
    const { setParseFilters } = useParseFilters()
    const { showToast } = useAlertContext()

    const { t } = useI18n()
    const theme = useTheme<Theme>()
    const isTablet = useMediaQuery({ query: '(max-width: 737px)' })

    const columns = [
        { id: 'id', label: 'Id', minWidth: 50, format: 'string', visible: false },
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
            minWidth: 100,
            format: 'string',
            visible: true
        },
        {
            id: 'description',
            label: t(translation.reportingDialogTabListColumnDescription),
            minWidth: 125,
            format: 'string',
            visible: true
        },

        {
            id: 'isSystem',
            label: t(translation.reportingDialogTabListColumnIsSystem),
            minWidth: 40,
            format: 'icon',
            visible: true
        },
        {
            id: 'pinwall',
            label: t(translation.reportingDialogTabListColumnIsPinWallable),
            minWidth: 50,
            format: 'toggle',
            visible: true
        },
        {
            id: 'createdBy',
            label: t(translation.reportingDialogTabListColumnCreatedBy),
            minWidth: 100,
            format: 'string',
            visible: true
        },
        {
            id: 'updatedAt',
            label: t(translation.reportingDialogTabListColumnLastModified),
            minWidth: 100,
            format: 'string',
            visible: true
        },
        {
            id: 'actions',
            label: '',
            minWidth: 40,
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

    useMount(async () => {
        const isAdminOn = storage.load(KEYS.QPLUS_ROLE_IS_ADMIN)
        await loadData(isAdminOn)
        setIsUserAdmin(isAdminOn)
    })

    const loadData = useCallback(
        async (isAdminOn = false) => {
            try {
                const hasWriteScopes = checkIfHasWriteScopes(appUser, isAdminOn)
                const reports = await loadTemplateReports(isAdminOn, hasWriteScopes)

                const rows = reports.map(report => ({
                    id: report.id,
                    title: report.title,
                    description: report.description,
                    isPinwallable: report.isPinwallable,
                    dataset: report.dataset.title,
                    vizType: report.visualizationType,
                    isSystem: report.isSystem,
                    templateId: report.templateId,
                    isShared: report.sharedWithOthers,
                    appUserId: report.appUserId,
                    updatedAt: formatDateHelper(report.updatedAt),
                    createdBy: report.user.fullName
                }))

                setHasAdminWriteScopes(hasWriteScopes)
                setReports(reports)
                setRows(rows)
                setIsLoading(false)
            } catch (error) {
                console.error('Error loading data:', error)
            }
        },
        [appUser, loadTemplateReports]
    )

    useEffect(() => {
        setQlikCurrAppId(qlikAppId)
    }, [qlikAppId])

    const handleFiltering = (text: string, isSystem = false) => {
        const rowsList = []
        for (const report of reports) {
            rowsList.push({
                id: report.id,
                templateId: report.templateId,
                title: report.title,
                description: report.description,
                isPinwallable: report.isPinwallable,
                dataset: report.dataset.title,
                vizType: report.visualizationType,
                isSystem: report.isSystem,
                isShared: report.sharedWithOthers,
                appUserId: report.appUserId,
                updatedAt: formatDateHelper(report.updatedAt),
                createdBy: report.user.fullName
            })
        }
        let filteredList: any[] = []
        filteredList = rowsList.filter(item => {
            return item.title.toLowerCase().includes(text.toLowerCase())
        })

        if (isSystem)
            filteredList = filteredList.filter(item => item.isSystem && item.templateId > 0)

        setRows(filteredList)
    }

    const handleIsSystemCheck = async (event: any) => {
        setIsLoading(true)
        setIsSystemChecked(event.target.checked)
        setPage(0)
        handleFiltering(text, event.target.checked)
        setIsLoading(false)
    }

    const handleSearchChange = async e => {
        handleFiltering(e.target.value, isSystemChecked)
        setText(e.target.value)
        setPage(0)
    }

    const handleCancelSearch = () => {
        handleFiltering('', isSystemChecked)
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

    // Define a function to handle the deletion of a report by its ID.
    const handleDeleteReport = async (id: number) => {
        // Start loading state.
        setIsLoading(true)

        // Check if the current user is an admin.
        const isAdminOn = storage.load(KEYS.QPLUS_ROLE_IS_ADMIN)

        // Find the report by its ID from the list of reports.
        const report = reports?.find(r => r.id === id)

        // Prevent deletion based on specific conditions:
        // 1. If report is a system report, it's a template, and the report user ID is not the appUser ID,
        // and the appUser does not have write scopes, then do not allow to delete.
        // 2. If report is a system report, it's not a template, and the report user is not the appUser,
        // then do not allow to delete.
        // 3. If report is not a system report and the report user ID is not appUser, then do not allow to delete.
        if (
            (report.isSystem &&
                report.templateId > 0 &&
                report.appUserId !== appUser.appUserId &&
                !checkIfHasWriteScopes(appUser, isAdminOn)) ||
            (report.isSystem && !report.templateId && report.appUserId !== appUser.appUserId) ||
            (!report.isSystem && report.appUserId !== appUser.appUserId)
        ) {
            showToast(
                t(translation.reportingDialogTabListToastDeleteSystemReportFailed), // This message might need to be adjusted for non-system reports.
                AlertType.ERROR
            )
            setIsLoading(false) // Stop loading state.
            return // Exit the function.
        }
        // If the report has a bookmark ID, remove the bookmark.
        if (report?.qlikState?.qsBookmarkId) {
            const qApp = qAppMap.get(qlikCurrAppId) // Get the current Qlik application.
            await qApp?.qApi?.$apiBookmark?.remove(report.qlikState.qsBookmarkId) // Remove the bookmark.
        }

        // Delete the report.
        await deleteReport(id)
        // Clear any report-related data.
        await clearReport()
        // Reload data, which could depend on the admin status.
        await loadData(isAdminOn)

        // Show a success toast message after successful deletion.
        showToast(t(translation.reportingDialogTabListToastDeleted), AlertType.SUCCESS)
    }

    const handleRestoreReport = (id: number) => {
        setIsLoading(true)
        const rows = reports.filter(r => r.id === id)

        if (rows.length > 0) {
            const report = rows[0]
            if (report) {
                const dimensions = qMasterDimensionsMap.get(report.dataset.qlikAppId)
                const measures = qMasterMeasuresMap.get(report.dataset.qlikAppId)
                const lDimensions = setParseDimensions(report.content.dimensions, dimensions)
                const lMeasures = setParseMeasures(report.content.measures, measures)
                const lFilters = setParseFilters(
                    report.content.filters,
                    dimensions,
                    reportDefaultFilters
                )

                onHandleRestoreCallback(
                    report.visualizationType,
                    report.dataset,
                    lDimensions,
                    lMeasures,
                    report.dataset.visualizations,
                    report.content.options,
                    lFilters,
                    report.isSystem,
                    report.qlikState?.qsBookmarkId ? report.qlikState.qsBookmarkId : null,
                    appUser.roles.includes(ROLE_ADMIN) || appUser.appUserId === report.appUserId
                        ? report.id
                        : 0,
                    report.title,
                    report.description,
                    report.isPinwallable,
                    false
                )
            } else {
                showToast(t(translation.reportingRestoreDatasetError), AlertType.ERROR)
            }
        }
        setIsLoading(false)
    }

    const toggleIsPinwallable = async (row: any) => {
        const currentRows = [...rows]
        const currentReports = [...reports]

        currentRows.forEach(r => {
            if (r.id === row.id) {
                r.isPinwallable = !r.isPinwallable
            }
        })
        setRows(currentRows)

        for (let i = 0; i < currentReports.length; i++) {
            if (currentReports[i].id === row.id) {
                currentReports[i].isPinwallable = !currentReports[i].isPinwallable
                const payload: any = {
                    content: currentReports[i].content,
                    title: currentReports[i].title,
                    description: currentReports[i].description,
                    dataset: {
                        qlikAppId: currentReports[i].dataset.qlikAppId,
                        title: currentReports[i].dataset.title,
                        type: currentReports[i].dataset.type,
                        tags: currentReports[i].dataset.tags,
                        color: currentReports[i].dataset.color
                    },
                    visualizationType: currentReports[i].visualizationType,
                    isPinwallable: currentReports[i].isPinwallable
                }
                if (currentReports[i].qlikState?.qlikBookmark?.id) {
                    payload.qlikState.qsBookmarkId = currentReports[i].qlikState.qlikBookmark.id
                }

                const togglePayload = {
                    isPinwallable: currentReports[i].isPinwallable
                }
                await patchReport(currentReports[i].id, togglePayload)
            }
        }
        setReports(currentReports)
    }

    if (isLoading)
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: '573px' }}>
                {LoaderComponent || <CircularProgress size="4rem" color={color} />}
            </Box>
        )

    return (
        <Paper className={classes.root} elevation={0}>
            <Box className={classes.filterContainer}>
                <Box className={classes.baseSearchContainer}>
                    <Box sx={{ width: '95%' }}>
                        <InputBase
                            className={classes.input}
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'search' }}
                            value={text}
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
                {(!isUserAdmin || (isUserAdmin && !hasAdminWriteScopes)) && (
                    <Box className={classes.checkboxContainer}>
                        <Checkbox
                            checked={isSystemChecked}
                            color="secondary"
                            onChange={handleIsSystemCheck}
                            disabled={isLoading}
                            disableRipple
                            size="medium"
                        />
                        <Typography className={classes.checkboxText}>
                            {t(translation.reportingDialogTabListFilterCheckboxIsSystem)}
                        </Typography>
                    </Box>
                )}
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
                                    const readOnly = checkIfReportIsReadOnly(
                                        row,
                                        appUser,
                                        isUserAdmin
                                    )
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map(column => {
                                                const value = row[column.id]
                                                const id = row['id']

                                                return column.visible ? (
                                                    <TableCell
                                                        className={classes.tableRowCell}
                                                        key={column.id}
                                                        align={
                                                            typeof value === 'number'
                                                                ? 'right'
                                                                : typeof value === 'boolean' ||
                                                                  column.format === 'icon'
                                                                ? 'center'
                                                                : 'left'
                                                        }>
                                                        {column.id === 'actions' ? (
                                                            <QlikReportingActionsListItem
                                                                id={id}
                                                                readOnly={readOnly}
                                                                onReportDeleteCallback={
                                                                    handleDeleteReport
                                                                }
                                                                onReportRestoreCallback={
                                                                    handleRestoreReport
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
                                                        ) : column.id === 'isSystem' ? (
                                                            row.isSystem && row.templateId > 0 ? (
                                                                <IconTooltip
                                                                    title={t(
                                                                        translation.dialogTooltipSystemReport
                                                                    )}>
                                                                    <ManageAccountsIcon
                                                                        className={classes.icon}
                                                                        sx={{
                                                                            color: theme.palette
                                                                                .secondary.main
                                                                        }}
                                                                    />
                                                                </IconTooltip>
                                                            ) : row.isSystem && !row.templateId ? (
                                                                <IconTooltip
                                                                    title={t(
                                                                        translation.dialogTooltipTemplateReport
                                                                    )}>
                                                                    <SettingsSuggestIcon
                                                                        className={classes.icon}
                                                                        sx={{
                                                                            color: theme.palette
                                                                                .info.main
                                                                        }}
                                                                    />
                                                                </IconTooltip>
                                                            ) : null
                                                        ) : column.id === 'pinwall' ? (
                                                            <Box>
                                                                <BaseSwitch
                                                                    checked={row.isPinwallable}
                                                                    onChange={() =>
                                                                        toggleIsPinwallable(row)
                                                                    }
                                                                    color="secondary"
                                                                    name="isPinwallable"
                                                                    inputProps={{
                                                                        'aria-label':
                                                                            'pinwallable checkbox'
                                                                    }}
                                                                    disabled={readOnly}
                                                                />
                                                            </Box>
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
                                <TableCell colSpan={7}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        textAlign="center"
                                        minHeight={`300px`}
                                        width="100%">
                                        <Typography
                                            style={{ fontSize: '0.925rem', fontStyle: 'oblique' }}>
                                            {t(translation.reportingDialogTemplateReportsEmpty)}
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

export default QlikReportingTemplateListDialog

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        width: '100%',
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
        '@media (max-width: 450px)': {
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingRight: '25px',
            marginTop: '15px',
            marginBottom: '10px'
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
        '@media (max-width: 450px)': {
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
        marginRight: '10px',
        '@media (max-width: 450px)': {
            marginLeft: '0px',
            marginTop: '5px'
        }
    },
    checkboxText: {
        fontSize: '14px',
        color: theme.palette.text.primary
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
        borderBottomColor: theme.palette.divider
    },
    icon: {
        marginRight: '35px',
        '@media (max-width: 491px)': {
            marginRight: '0px'
        }
    },
    cell: {
        padding: '5px',
        paddingLeft: '15px',
        '@media (max-width: 454px)': {
            paddingLeft: '5px'
        }
    }
}))
