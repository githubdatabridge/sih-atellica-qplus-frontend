import React, { FC, useCallback, useMemo, useState } from 'react'

import { useLocation } from 'react-router-dom'
import { useMount } from 'react-use'

import {
    CheckCircle,
    CheckCircleOutlineOutlined,
    RadioButtonUncheckedOutlined,
    ExpandMore,
    ChevronRight,
    Share,
    SettingsSuggest,
    ManageAccounts
} from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemText,
    Typography,
    useTheme,
    Theme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useQuery } from '@libs/common-hooks'
import { Report } from '@libs/common-models'
import { useAuthContext, useI18n } from '@libs/common-providers'
import { BaseSwitch, IconTooltip, renderVizType, DraggableDialog } from '@libs/common-ui'
import { KEYS, storage } from '@libs/common-utils'
import { useParseFilters } from '@libs/core-hooks'
import { ReportFilters } from '@libs/core-models'
import { QlikVisualizationApiCore } from '@libs/qlik-base-ui'
import {
    QlikActionsProvider,
    useQlikApp,
    useQlikAppContext,
    useQlikMasterItemContext
} from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import { REPORTING_BASE_CHARTS } from '../../constants/constants'
import translation from '../../constants/translations'
import { useGridWallContext } from '../../contexts/grid-wall-context'
import { useQlikPinWallState } from '../../contexts/qlik-pin-wall-context'
import { setActivePinWall } from '../../contexts/store/pinWall.actions'
import { IDatasets, TQlikPinWallClasses } from '../../QlikPinWall'
import { checkIfHasWriteScopes } from '../../utils'
import dialogTranslations from './constants/translations'

type DatasetActive = {
    id: number
    toggle: boolean
}
interface Props {
    classNames?: Partial<TQlikPinWallClasses>
    datasets?: IDatasets[]
    qlikAppId?: string
    onClose: () => void
}

const QlikPinWallVisualizationPickerDialog: FC<Props> = ({
    classNames,
    datasets,
    onClose,
    qlikAppId
}) => {
    const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false)
    const [hasWritePermissions, setHasWritePermissions] = useState<boolean>(false)
    const [selectedReport, setSelectedReport] = React.useState<Report | null>(null)
    const [dsActiveToggle, setDsActiveToogle] = React.useState<DatasetActive>(null)
    const [columns, setColumns] = React.useState<any[]>([])
    const [selectedCollapse, setSelectedCollapse] = useState<number[]>([])
    const [searchText, setSearchText] = React.useState<string>('')
    const [isPersonalCheck, setIsPersonalCheck] = React.useState<boolean>(false)
    const [isTemplateCheck, setIsTemplateCheck] = React.useState<boolean>(false)
    const [isCollaborativeCheck, setIsCollaborativeCheck] = React.useState<boolean>(false)
    const [, setReportIsLoading] = React.useState<boolean>(false)
    const [pickedReports, setPickedReports] = useState<number[]>([])
    const [activeReportIds, setActiveReportIds] = useState<number[]>([])
    const [originalDatasets] = React.useState<IDatasets[]>(datasets || [])
    const [filteredDatasets] = React.useState<IDatasets[]>(JSON.parse(JSON.stringify(datasets)))

    const { appUser } = useAuthContext()
    const { activePinWall } = useQlikPinWallState()
    const { onAddReportCell } = useGridWallContext()
    const { setParseFilters } = useParseFilters()
    const { qAppId } = useQlikApp(qlikAppId)
    const { qAppMap } = useQlikAppContext()
    const { qSelectionMap } = useQlikSelectionContext()
    const { qMasterDimensionsMap, qMasterMeasuresMap } = useQlikMasterItemContext()
    const { t } = useI18n()
    const queryParams = useQuery()
    const location = useLocation()

    const pageId = location.pathname
    const searchParams = new URLSearchParams(window.location.search)

    const x = parseInt(queryParams.get('x')) || 0
    const y = parseInt(queryParams.get('y')) || 0

    const theme = useTheme<Theme>()

    // Helper function for personal conditions
    const checkPersonalConditionHelper = report => {
        const isAdminCondition =
            isUserAdmin && report.isSystem && report.appUserId === appUser?.appUserId
        if (isUserAdmin && hasWritePermissions) {
            return isAdminCondition && report.templateId > 0
        }
        if (isUserAdmin && !hasWritePermissions) {
            return isAdminCondition && !report.templateId
        }
        return !report.isSystem && report.appUserId === appUser?.appUserId
    }

    // Helper function for collaborative conditions
    const checkCollaborativeConditionHelper = report => {
        if (isUserAdmin) {
            return false
        }

        return !report.isSystem && report.appUserId !== appUser?.appUserId
    }

    // Helper function for template conditions
    const checkTemplateConditionHelper = report => {
        const isAdminCondition =
            isUserAdmin && report.isSystem && report.appUserId !== appUser?.appUserId
        if (isUserAdmin && hasWritePermissions) {
            return isAdminCondition && report.templateId > 0
        }
        if (isUserAdmin && !hasWritePermissions) {
            return isAdminCondition
        }
        return report.isSystem // Default template condition when not an admin or no write permissions
    }

    useMount(async () => {
        const isAdminOn = storage.load(KEYS.QPLUS_ROLE_IS_ADMIN)
        const hasWriteAccess = checkIfHasWriteScopes(appUser, isAdminOn)
        const reportIds: number[] = []
        if (activePinWall?.content?.cells) {
            for (const cell of activePinWall.content.cells) {
                if (cell?.reportId) reportIds.push(cell.reportId)
            }
        }
        setIsUserAdmin(isAdminOn)
        setHasWritePermissions(hasWriteAccess)
        setActiveReportIds(reportIds)
    })

    const handleCollapse = (index: number) => {
        const current = [...selectedCollapse]
        const fi: number = current.findIndex(s => s === index)
        if (fi !== -1) {
            current.splice(fi, 1)
        } else {
            current.push(index)
        }
        setSelectedCollapse(current)
    }

    const handleSearchChange = (
        value = '',
        isPersonal = false,
        isTemplate = false,
        isCollaborative = false
    ) => {
        const sCollapse = []
        originalDatasets.forEach((ds, datasetIndex) => {
            const filteredReports = ds.reports.filter(report => {
                const titleMatches = value
                    ? report.title.toLowerCase().includes(value.toLowerCase())
                    : true

                if (!titleMatches) {
                    return false
                }

                if (isPersonal) {
                    return checkPersonalConditionHelper(report)
                }

                if (isTemplate) {
                    return checkTemplateConditionHelper(report)
                }

                if (isCollaborative) {
                    return checkCollaborativeConditionHelper(report)
                }

                return true // Include the report if no specific flags are set and the title matches
            })

            filteredDatasets[datasetIndex].reports = filteredReports
            if (filteredReports.length) {
                sCollapse.push(datasetIndex)
            }
        })

        // Update state based on search results
        setIsPersonalCheck(isPersonal)
        setIsTemplateCheck(isTemplate)
        setIsCollaborativeCheck(isCollaborative)
        setSelectedCollapse(sCollapse)
        setSearchText(value)
    }

    const handleReportSelect = (report: Report) => {
        let current = [...pickedReports]
        const index = current.findIndex(r => r === report.id)
        if (index !== -1) {
            current.splice(index, 1)
        } else {
            current = []
            current.push(report.id)
        }
        setPickedReports(current)
    }

    const handleReportVisualization = useCallback(
        (report: Report) => {
            setReportIsLoading(true)
            const qApp = qAppMap.get(report?.dataset?.qlikAppId || qAppId)
            const masterDimensions = qMasterDimensionsMap.get(report?.dataset?.qlikAppId || qAppId)
            const masterMeasures = qMasterMeasuresMap.get(report?.dataset?.qlikAppId || qAppId)

            const qDimensions = qApp?.qMixinsApi._qPlusGetVizDimensions(
                report.content.dimensions,
                masterDimensions
            )
            const qMeasures = qApp?.qMixinsApi._qPlusGetVizMeasures(
                report.content.measures,
                masterMeasures
            )
            const columns = qApp?.qMixinsApi._qPlusGetVizColumns(qDimensions, qMeasures)
            setColumns(columns)
            setSelectedReport(report)
            setReportIsLoading(false)
        },
        [qAppId, qAppMap, qMasterDimensionsMap, qMasterMeasuresMap]
    )

    const onApply = () => {
        const allFilters: ReportFilters[] = []
        const datasetFilters: any[] = []

        // 1. Get picked reports
        pickedReports.forEach((pr, index) => {
            // 2. Check if datasets are loaded
            if (!datasets?.length) return

            // 3. Loop over datasets
            for (let i = 0; i < datasets.length; i++) {
                // 4. Get picked report out of mapped datasets structure
                const report = datasets[i].reports.find(r => r.id === pr)

                // 5. Get Qlik App Instance
                const qApp = qAppMap.get(report?.dataset?.qlikAppId || qAppId)

                // 6. Get Qlik Selection Instance
                const qSelection = qSelectionMap.get(report?.dataset?.qlikAppId || qAppId)

                // 7. Get Qlik Master Dimensions
                const masterDimensions = qMasterDimensionsMap.get(
                    report?.dataset?.qlikAppId || qAppId
                )

                // 8. Get Qlik Master Measures
                const masterMeasures = qMasterMeasuresMap.get(report?.dataset?.qlikAppId || qAppId)

                // 9. Check if report exists
                if (report) {
                    // 10. Get Qlik App Id out of report
                    const appId = report?.dataset?.qlikAppId || qAppId
                    // 11. Get Qlik Dimensions
                    const qDimensions = qApp.qMixinsApi._qPlusGetVizDimensions(
                        report.content.dimensions,
                        masterDimensions
                    )
                    // 12. Get Qlik Measures
                    const qMeasures = qApp.qMixinsApi._qPlusGetVizMeasures(
                        report.content.measures,
                        masterMeasures
                    )
                    // 13. Get Qlik Columns
                    const columns = qApp.qMixinsApi._qPlusGetVizColumns(qDimensions, qMeasures)

                    // 14. Check if report has filters
                    if (report?.dataset?.filters?.length > 0)
                        datasetFilters.push(...report.dataset.filters)

                    // 15. Get filters complex list
                    const lFilters = setParseFilters(
                        report.content.filters,
                        masterDimensions,
                        qSelection?.qDockedFields
                    )
                    // 16. Loop over filters
                    lFilters.forEach(qD => {
                        //17. Check if filter already exists
                        const exist = allFilters.find(
                            r => qD.qFieldName === r.qFieldName && qD.qAppId === r.qAppId
                        )
                        //18. If filter not exists add filter in all filters list
                        if (!exist) allFilters.push(qD)
                    })

                    onAddReportCell(
                        report.id,
                        report.visualizationType,
                        columns,
                        report.content?.options,
                        report.title,
                        report.description,
                        appId,
                        index,
                        x,
                        y
                    )
                }
            }
        })

        setActivePinWall(activePinWall)
        onClose()
    }

    const onCancel = () => {
        setPickedReports([])
        onClose()
    }

    const onCloseDialogClick = (isOpen: boolean) => {
        setPickedReports([])
        onClose()
    }

    const handleDsToggle = (id: number, toggle: boolean) => {
        setDsActiveToogle({
            id,
            toggle
        })
    }

    const renderIcon = (isTemplate = false, isShared = false, isSystem = false, color?: string) => {
        if (isShared) {
            return (
                <IconTooltip title={t(dialogTranslations.dialogTooltipCollaborativeReport)}>
                    <Share
                        style={{
                            color: color || 'black'
                        }}
                    />
                </IconTooltip>
            )
        }
        if (isTemplate) {
            return (
                <IconTooltip title={t(dialogTranslations.dialogTooltipTemplateReport)}>
                    <SettingsSuggest
                        style={{
                            color: color || 'black'
                        }}
                    />
                </IconTooltip>
            )
        }
        if (isSystem) {
            return (
                <IconTooltip title={t(dialogTranslations.dialogTooltipSystemReport)}>
                    <ManageAccounts
                        style={{
                            color: color || 'black'
                        }}
                    />
                </IconTooltip>
            )
        }
    }

    const renderReportViz = useMemo(() => {
        const visualizationType = !REPORTING_BASE_CHARTS.includes(selectedReport?.visualizationType)
            ? selectedReport?.content?.options?.qInfo?.qType
            : selectedReport?.visualizationType || 'table'
        const options = selectedReport?.content?.options || {}
        return (
            selectedReport && (
                <QlikActionsProvider>
                    <QlikVisualizationApiCore
                        qlikAppId={selectedReport?.dataset?.qlikAppId}
                        vizOptions={{
                            vizType: visualizationType,
                            columns: columns,
                            options: options || {}
                        }}
                        isToolbarOnPanel={false}
                        enableFullscreen={false}
                    />
                </QlikActionsProvider>
            )
        )
    }, [selectedReport, columns])

    if (!activePinWall) onClose()

    const { classes } = useStyles()

    return (
        <DraggableDialog
            pageId={pageId}
            searchParams={searchParams}
            dialogProps={{
                maxWidth: 'lg'
            }}
            dismissDialogCallback={onCloseDialogClick}
            closeTooltipText={t('qplus-dialog-close')}
            title={t(translation.pinwallAddVisualization)}
            hideBackdrop={false}
            cssPaper={{ height: '700px' }}>
            <Box className={classes.filterContainer}>
                <Box className={classes.baseSearchContainer}>
                    <Box sx={{ width: '95%' }}>
                        <InputBase
                            className={classes.input}
                            placeholder={t(dialogTranslations.dialogFilterSearch)}
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchText}
                            onChange={e =>
                                handleSearchChange(e.target.value, isPersonalCheck, isTemplateCheck)
                            }
                        />
                    </Box>
                    <Box>
                        {searchText ? (
                            <IconTooltip
                                title={t(dialogTranslations.dialogFilterCancelIconTooltip)}>
                                <IconButton
                                    aria-label="cancel"
                                    className={classes.searchIcon}
                                    onClick={() =>
                                        handleSearchChange(
                                            '',
                                            isPersonalCheck,
                                            isTemplateCheck,
                                            isCollaborativeCheck
                                        )
                                    }>
                                    <CloseIcon />
                                </IconButton>
                            </IconTooltip>
                        ) : (
                            <IconTooltip title={t(dialogTranslations.dialogFilterSearch)}>
                                <IconButton aria-label="search" className={classes.searchIcon}>
                                    <SearchIcon />
                                </IconButton>
                            </IconTooltip>
                        )}
                    </Box>
                </Box>
                <Box className={classes.checkboxContainer}>
                    <Checkbox
                        checked={isPersonalCheck}
                        color="secondary"
                        onChange={() =>
                            handleSearchChange(searchText, !isPersonalCheck, false, false)
                        }
                        disableRipple
                        size="medium"
                    />
                    <Typography className={classes.checkboxText}>
                        {t(dialogTranslations.dialogFilterPersonalReports)}
                    </Typography>
                </Box>
                <Box className={classes.checkboxContainer}>
                    <Checkbox
                        checked={isTemplateCheck}
                        color="secondary"
                        onChange={() =>
                            handleSearchChange(searchText, false, !isTemplateCheck, false)
                        }
                        disableRipple
                        size="medium"
                    />
                    <Typography className={classes.checkboxText}>
                        {t(dialogTranslations.dialogFilterTemplateReports)}
                    </Typography>
                </Box>
                {!isUserAdmin && (
                    <Box className={classes.checkboxContainer}>
                        <Checkbox
                            checked={isCollaborativeCheck}
                            color="secondary"
                            onChange={() =>
                                handleSearchChange(searchText, false, false, !isCollaborativeCheck)
                            }
                            disableRipple
                            size="medium"
                        />
                        <Typography className={classes.checkboxText}>
                            {t(dialogTranslations.dialogFilterCollaborativeReports)}
                        </Typography>
                    </Box>
                )}
            </Box>
            <Box className={classes.mainContainer}>
                <Box className={classes.leftContainer}>
                    <List className={classes.listContainer}>
                        {filteredDatasets.map((dataset, index) => (
                            <>
                                <ListItem className={classes.listItem} key={index}>
                                    {selectedCollapse.indexOf(index) !== -1 ? (
                                        <ExpandMore onClick={() => handleCollapse(index)} />
                                    ) : (
                                        <ChevronRight onClick={() => handleCollapse(index)} />
                                    )}
                                    <ListItemText
                                        className={classes.listItemTitle}
                                        style={{ paddingLeft: '10px' }}
                                        primaryTypographyProps={{
                                            fontSize: '0.925rem'
                                        }}>
                                        <Box display="flex" width="100%">
                                            <Box
                                                flexGrow={1}
                                                display="flex"
                                                alignItems="center"
                                                onClick={() => handleCollapse(index)}>
                                                {dataset.dsTitle}
                                            </Box>
                                            <Box>
                                                <IconTooltip
                                                    title={t(translation.pinwallHidePinnedReports)}>
                                                    <BaseSwitch
                                                        defaultChecked={false}
                                                        color="secondary"
                                                        checked={
                                                            dataset.dsId === dsActiveToggle?.id &&
                                                            dsActiveToggle?.toggle
                                                        }
                                                        onClick={() =>
                                                            handleDsToggle(
                                                                dataset.dsId,
                                                                !dsActiveToggle?.toggle
                                                            )
                                                        }
                                                    />
                                                </IconTooltip>
                                            </Box>
                                        </Box>
                                    </ListItemText>
                                </ListItem>
                                {selectedCollapse.indexOf(index) !== -1 ? (
                                    <Collapse in timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {dataset.reports
                                                .filter((report, i) =>
                                                    dataset.dsId === dsActiveToggle?.id &&
                                                    dsActiveToggle?.toggle
                                                        ? !activeReportIds.includes(report.id)
                                                        : true
                                                )
                                                .map((report, i) => (
                                                    <ListItem
                                                        className={classes.listItem}
                                                        style={{
                                                            paddingLeft: '40px',
                                                            color: activeReportIds?.includes(
                                                                report.id
                                                            )
                                                                ? theme.palette.text.disabled
                                                                : theme.palette.text.primary,
                                                            backgroundColor:
                                                                selectedReport?.id === report.id
                                                                    ? theme.palette.background
                                                                          .default
                                                                    : 'inherit',
                                                            textDecoration:
                                                                activeReportIds?.includes(report.id)
                                                                    ? 'line-through'
                                                                    : 'none'
                                                        }}
                                                        key={i}>
                                                        {activeReportIds?.includes(report.id) ? (
                                                            <Checkbox
                                                                edge="start"
                                                                color="secondary"
                                                                checked={
                                                                    activeReportIds.indexOf(
                                                                        report.id
                                                                    ) !== -1
                                                                }
                                                                sx={{
                                                                    '&.Mui-checked': {
                                                                        color: theme.palette.text
                                                                            .disabled
                                                                    }
                                                                }}
                                                                className={
                                                                    classes.listItemUnCheckbox
                                                                }
                                                                icon={
                                                                    <RadioButtonUncheckedOutlined />
                                                                }
                                                                checkedIcon={
                                                                    <CheckCircleOutlineOutlined />
                                                                }
                                                                onClick={() => null}
                                                            />
                                                        ) : (
                                                            <Checkbox
                                                                edge="start"
                                                                onClick={() => {
                                                                    handleReportSelect(report)
                                                                    handleReportVisualization(
                                                                        report
                                                                    )
                                                                }}
                                                                icon={
                                                                    <RadioButtonUncheckedOutlined />
                                                                }
                                                                checkedIcon={
                                                                    <CheckCircle color="secondary" />
                                                                }
                                                                checked={
                                                                    pickedReports.indexOf(
                                                                        report.id
                                                                    ) !== -1
                                                                }
                                                                className={classes.listItemCheckbox}
                                                            />
                                                        )}
                                                        <ListItemText
                                                            onClick={() => {
                                                                handleReportSelect(report)
                                                                handleReportVisualization(report)
                                                            }}
                                                            className={classes.listItemText}
                                                            primaryTypographyProps={{
                                                                fontSize: '0.875rem'
                                                            }}>
                                                            {report.title}
                                                        </ListItemText>
                                                        <Box
                                                            onClick={() => {
                                                                handleReportSelect(report)
                                                                handleReportVisualization(report)
                                                            }}
                                                            mr={2}>
                                                            {renderIcon(
                                                                report.isSystem &&
                                                                    !report.templateId,
                                                                !report.isSystem &&
                                                                    report.appUserId !==
                                                                        appUser.appUserId,
                                                                report.isSystem &&
                                                                    report.templateId > 0,
                                                                activeReportIds?.includes(report.id)
                                                                    ? theme.palette.text.disabled
                                                                    : report.isSystem &&
                                                                      !report.templateId
                                                                    ? theme.palette.info.main
                                                                    : report.isSystem &&
                                                                      report.templateId > 0
                                                                    ? theme.palette.secondary.main
                                                                    : theme.palette.common.black
                                                            )}
                                                        </Box>
                                                        <Box
                                                            onClick={() => {
                                                                handleReportSelect(report)
                                                                handleReportVisualization(report)
                                                            }}
                                                            mr={2}>
                                                            <IconTooltip
                                                                title={
                                                                    report?.visualizationType?.[0].toUpperCase() +
                                                                    report?.visualizationType?.slice(
                                                                        1
                                                                    )
                                                                }>
                                                                {renderVizType(
                                                                    report.visualizationType,
                                                                    activeReportIds?.includes(
                                                                        report.id
                                                                    )
                                                                        ? theme.palette.text
                                                                              .disabled
                                                                        : theme.palette.text.primary
                                                                )}
                                                            </IconTooltip>
                                                        </Box>
                                                    </ListItem>
                                                ))}
                                        </List>
                                    </Collapse>
                                ) : null}
                            </>
                        ))}
                    </List>
                </Box>
                {pickedReports.length > 0 ? (
                    <Box className={classes.rightContainer}>{renderReportViz}</Box>
                ) : (
                    <Box className={classes.rightContainer}>
                        <Typography sx={{ fontSize: '0.925rem', fontStyle: 'oblique' }}>
                            {t(translation.pinwallReportPreviewMsg)}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box className={classes.buttonContainer}>
                <Button
                    onClick={onCancel}
                    className={`${classes.buttonCancel} ${classNames?.buttonCancel || ''}`}>
                    {t(translation.pinwallButtonCancel)}
                </Button>
                <Button
                    onClick={onApply}
                    className={`${classes.buttonSave} ${classNames?.buttonSave || ''}`}>
                    {t(translation.pinwallButtonApply)}
                </Button>
            </Box>
        </DraggableDialog>
    )
}

export default QlikPinWallVisualizationPickerDialog

const useStyles = makeStyles()((theme: Theme) => ({
    badge: {
        transform: 'scale(.75) translate(50%, -50%)',
        fontSize: '1.3rem'
    },
    mainContainer: {
        width: '100%',
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'row',
        minHeight: '480px'
    },
    leftContainer: {
        width: '40%',
        borderRight: `1px solid ${theme.palette.divider}`,
        height: '480px'
    },
    rightContainer: {
        width: '60%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        maxHeight: '500px'
    },
    filterContainer: {
        padding: 10,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '16px',
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
        width: '40%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        '@media (max-width: 450px)': {
            width: '100%'
        }
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
        fontSize: '0.825rem',
        color: theme.palette.text.primary
    },
    searchIcon: {
        marginRight: 2,
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.text.secondary
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
        marginLeft: theme.spacing(1),
        flex: 1,
        height: '24px',
        fontSize: '14px'
    },
    listContainer: {
        maxHeight: '100%',
        width: '100%',
        overflow: 'auto',
        padding: 0
    },
    listItem: {
        fontWeight: 700,
        fontSize: '14px',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    listItemCheckbox: {
        width: '20px',
        height: '20px',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    listItemUnCheckbox: {
        width: '20px',
        height: '20px',
        color: theme.palette.text.disabled,
        cursor: 'default'
    },
    listItemTitle: {
        fontWeight: 500,
        fontSize: '16px',
        paddingLeft: '10px'
    },
    listItemText: {
        fontWeight: 500,
        fontSize: '0.9rem',
        paddingLeft: '10px'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: '30px 10px',
        height: '15%',
        margin: '0px'
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
        textTransform: 'none'
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
        '&:hover': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary
        },
        '&:focus': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary
        },
        textTransform: 'none'
    }
}))
