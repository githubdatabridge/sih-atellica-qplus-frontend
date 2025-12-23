import React, { FC, useCallback, useEffect, useRef } from 'react'

import { useLocation } from 'react-router-dom'

import AddIcon from '@mui/icons-material/AddPhotoAlternate'
import TemplateIcon from '@mui/icons-material/Camera'
import ClearIcon from '@mui/icons-material/Clear'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CopyIcon from '@mui/icons-material/FileCopy'
import ListIcon from '@mui/icons-material/PlaylistAddCheck'
import RefreshIcon from '@mui/icons-material/Refresh'
import SaveIcon from '@mui/icons-material/Save'
import ShareIcon from '@mui/icons-material/Share'
import ViewListIcon from '@mui/icons-material/ViewList'
import {
    Container,
    IconButton,
    Paper,
    Box,
    Tabs,
    Tab,
    DialogContent,
    useTheme,
    Theme
} from '@mui/material'
import { darken } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import { QlikBaseSocialProvider } from '@libs/collaboration-providers'
import { useAuthContext, useI18n } from '@libs/common-providers'
import {
    IconTooltip,
    TabsPanel,
    ConfirmationDialog,
    DraggableDialog,
    AlertType,
    useAlertContext
} from '@libs/common-ui'
import { KEYS, storage } from '@libs/common-utils'
import {
    ReportDataset,
    ReportMeasures,
    ReportDimensions,
    ReportFilters,
    ReportVisualizations
} from '@libs/core-models'
import { QlikFilterDialog } from '@libs/qlik-base-ui'
import { useQlikLoaderContext } from '@libs/qlik-providers'

import {
    URL_QUERY_PARAM_VALUE_TYPE_REPORTS,
    URL_QUERY_PARAM_VALUE_CRUD_CANCEL
} from '../../constants/constants'
import translation from '../../constants/translations'
import translations from '../../constants/translations'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { useQlikReportingUiContext } from '../../contexts/QlikReportingUiContext'
import { useReplaceQueryParams } from '../../hooks'
import { TQlikReportingCoreClasses } from '../../QlikReportingCore'
import { checkIfHasWriteScopes } from '../../utils'
import QlikReportingCommentDialog from './QlikReportingCommentDialog'
import QlikReportingFormDialog from './QlikReportingFormDialog'
import QlikReportingImportExportDialog from './QlikReportingImportExportDialog'
import QlikReportingListDialog from './QlikReportingListDialog'
import QlikReportingShareFormDialog from './QlikReportingShareFormDialog'
import QlikReportingShareListDialog from './QlikReportingShareListDialog'
import QlikReportingTemplateListDialog from './QlikReportingTemplateListDialog'

export interface IQlikReportingDialogProps {
    qlikAppId?: string
    dimensions: ReportDimensions[]
    measures: ReportMeasures[]
    isOpen?: boolean
    views: string[]
    defaultAppFilters?: any[]
    isToolbarWithDivider?: boolean
    isFilterActive?: boolean
    showPinWallList?: boolean
    isNewReportActive?: boolean
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    classNames?: Partial<TQlikReportingCoreClasses>
    LoaderComponent?: JSX.Element
    onRefreshReportCallback: (reportId: number) => void
    onRestoreVisualizationCallback(
        vizType: string,
        dataset: ReportDataset,
        reportDimensions: ReportDimensions[],
        reportMeasures: ReportMeasures[],
        reportVisualizations: ReportVisualizations[],
        options: any,
        reportFilters?: ReportFilters[],
        qsBookmarkId?: string,
        reportIdentifier?: number,
        title?: string,
        description?: string,
        isSystem?: boolean,
        isPinwallable?: boolean,
        isImported?: boolean
    ): void
}

const a11yProps = (index: any) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
})

const QlikReportingDialog: FC<IQlikReportingDialogProps> = ({
    qlikAppId,
    dimensions,
    measures,
    classNames,
    defaultAppFilters,
    isNewReportActive = false,
    isFilterActive = false,
    isToolbarWithDivider = true,
    color = 'secondary',
    isOpen = false,
    showPinWallList = true,
    views,
    LoaderComponent,
    onRestoreVisualizationCallback,
    onRefreshReportCallback
}) => {
    const [qlikCurrAppId, setQlikCurrAppId] = React.useState<string>(qlikAppId)
    const [isUserAdmin, setIsUserAdmin] = React.useState<boolean>(false)
    const [value, setValue] = React.useState<any>(0)
    const [isLoading, setIsLoading] = React.useState(true)
    const [open, setOpen] = React.useState(false)
    const [isEditMode, setIsEditMode] = React.useState(false)
    const [activeModal, setActiveModal] = React.useState<number>(0)
    const [userReportCount, setUserReportCount] = React.useState<number>(0)
    const [templateReportCount, setTemplateReportCount] = React.useState<number>(0)
    const [sharedReportCount, setSharedReportCount] = React.useState<number>(0)
    const [isSystemReport, setIsSystemReport] = React.useState<boolean>(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [eraseDialogOpen, setEraseDialogOpen] = React.useState<boolean>(false)
    const [cloneDialogOpen, setCloneDialogOpen] = React.useState<boolean>(false)

    const { appUser } = useAuthContext()
    const { isQlikMasterItemLoading } = useQlikLoaderContext()
    const location = useLocation()
    const searchParams = new URLSearchParams(window.location.search)

    const {
        reportId,
        reportIsLoading,
        reportFilters,
        reportVizOptions,
        reportSelectedDimensions,
        reportSelectedMeasures,
        reportVizColumns,
        reportDataset,
        reportVizType,
        reportSharedCount,
        reportTemplateCount,
        reportUserCount,
        isReportPersonal,
        isReportEditable,
        isReportReadOnly,
        loadTemplateReports,
        loadSharedReports,
        setReportId,
        deleteReport,
        clearReport,
        cloneReport,
        eraseReport,
        setReportIsLoading,
        setIsReportEditable
    } = useQlikReportingContext()
    const { setReplaceQueryParams } = useReplaceQueryParams()
    const { showToast } = useAlertContext()
    const {
        reportingAddNode,
        reportingShareNode,
        reportingSaveNode,
        reportingRemoveNode,
        reportingListNode,
        reportingEraseNode,
        reportingEditNode,
        reportingCloneNode,
        reportingCancelNode,
        cssReportingControlButtonIcon
    } = useQlikReportingUiContext()

    const theme = useTheme<Theme>()
    const { classes } = useStyles()
    const { t } = useI18n()
    const refReportId = useRef<number>(0)

    const useTabStyles = makeStyles()((theme: Theme) => ({
        root: {
            minHeight: '0px'
        },
        indicator: {
            display: 'flex',
            flexDirection: 'row',
            bottom: '0px',
            height: 2,
            backgroundColor:
                color === 'secondary'
                    ? theme.palette.secondary.main
                    : color === 'primary'
                    ? theme.palette.primary.main
                    : theme.palette.info.main
        },
        scroller: {
            height: '0px'
        }
    }))

    const { classes: classesTab } = useTabStyles()

    const loadTotals = useCallback(
        async (isAdminOn = false) => {
            try {
                const hasWriteAccess = checkIfHasWriteScopes(appUser, isAdminOn)
                await loadTemplateReports(isAdminOn, hasWriteAccess, 1, false)
                await loadSharedReports(1, false)
            } catch (error) {
                console.error('Error loading data:', error)
            }
        },
        [appUser, loadSharedReports, loadTemplateReports]
    )

    useEffect(() => {
        setQlikCurrAppId(qlikAppId)
    }, [qlikAppId])

    useEffect(() => {
        const isAdminOn = Boolean(storage.load(KEYS.QPLUS_ROLE_IS_ADMIN))
        setIsUserAdmin(isAdminOn)
        if (open) {
            if (activeModal === 3) loadTotals(isAdminOn)
        }
    }, [activeModal, loadTotals, open])

    useEffect(() => {
        setIsLoading(reportIsLoading || isQlikMasterItemLoading)
    }, [reportIsLoading, isQlikMasterItemLoading])

    useEffect(() => {
        setUserReportCount(reportUserCount)
    }, [reportUserCount])

    useEffect(() => {
        setSharedReportCount(reportSharedCount)
    }, [reportSharedCount])

    useEffect(() => {
        setTemplateReportCount(reportTemplateCount)
    }, [reportTemplateCount])

    useEffect(() => {
        refReportId.current = reportId
    }, [reportId])

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

    useEffect(() => {
        setIsEditMode(isReportEditable)
    }, [isReportEditable])

    const handleCloneReport = async () => {
        try {
            setReportIsLoading(true)
            await cloneReport(refReportId.current, dimensions, measures)
            setCloneDialogOpen(false)
        } catch (error) {
            console.log('Qplus Error: ', error)
            showToast(t(translation.reportingToastCloneError), AlertType.ERROR)
        } finally {
            setReportIsLoading(false)
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleClickOpen = (tab: number) => {
        setValue(0)
        setActiveModal(tab)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleCancelOnClick = async () => {
        setReportId(refReportId.current)
        setReplaceQueryParams(
            refReportId.current,
            URL_QUERY_PARAM_VALUE_TYPE_REPORTS,
            URL_QUERY_PARAM_VALUE_CRUD_CANCEL
        )
    }

    const handleOnAddReport = () => {
        clearReport()
    }

    const renderTitle = () => {
        if (activeModal === 1) {
            return t(translation.reportingDialogShareReportsTitle)
        }
        if (activeModal === 2) {
            if (isReportPersonal && reportId) {
                return t(translation.reportingDialogUpdateTitle)
            } else {
                return t(translation.reportingDialogSaveTitle)
            }
        }
        if (activeModal === 3) {
            return t(translation.reportingDialogMyReportsTitle)
        }
    }

    const onCloseDeleteDialog = () => {
        setDeleteDialogOpen(false)
    }

    const onOpenCloneDialog = () => {
        setCloneDialogOpen(true)
    }

    const onCloseCloneDialog = () => {
        setCloneDialogOpen(false)
    }

    const handleOnRestore = (
        visualizationType: string,
        dataset: ReportDataset,
        reportDimensions: ReportDimensions[],
        reportMeasures: ReportMeasures[],
        reportVisualizations: ReportVisualizations[],
        options: any,
        reportFilters?: ReportFilters[],
        isSystem?: boolean,
        qsBookmarkId?: string,
        reportIdentifier?: number,
        title?: string,
        description?: string,
        isPinwallable?: boolean,
        isImported?: boolean
    ) => {
        onRestoreVisualizationCallback(
            visualizationType,
            dataset,
            reportDimensions,
            reportMeasures,
            reportVisualizations,
            options,
            reportFilters,
            qsBookmarkId,
            reportIdentifier,
            title,
            description,
            isSystem,
            isPinwallable,
            isImported
        )
        setOpen(false)
        refReportId.current = reportIdentifier
    }

    const handleSuccessfulReportCreate = (reportIdentifier: number, isSystem: boolean) => {
        setReportId(reportIdentifier)
        setIsSystemReport(isSystem)
        setOpen(false)
    }

    const handleSuccessfulReportUpdate = () => {
        setOpen(false)
        setIsReportEditable(false)
    }

    const handleReportDelete = async (rId: number) => {
        try {
            setIsLoading(true)
            await deleteReport(rId)
            showToast(t(translation.reportingToastDeleteSuccess), AlertType.SUCCESS)
            await clearReport()
            onCloseDeleteDialog()
        } catch {
            showToast(t(translation.reportingToastDeleteError), AlertType.ERROR)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefreshReport = async (rId: number) => {
        onRefreshReportCallback(rId)
    }

    const onCloseEraseDialog = () => {
        setEraseDialogOpen(false)
    }

    const renderShareTooltipText = () => {
        if (!isNewReportActive) {
            return t(translation.reportingDialogShareTooltipDisabledOne)
        } else if (refReportId.current === 0) {
            return t(translation.reportingDialogShareTooltipDisabledTwo)
        } else if (isSystemReport) {
            return t(translation.reportingDialogShareTooltipDisabledThree)
        } else {
            return t(translation.reportingDialogShareTooltip)
        }
    }

    const isReportingControlEnabled = refReportId.current > 0 && !isReportReadOnly
    const isReportingAddEnabled = refReportId.current > 0
    const isReportingCloneEnabled = refReportId.current > 0
    const isReportingRefreshEnabled = refReportId.current > 0
    const isReportingEraseEnabled = refReportId.current > 0 && !isReportReadOnly
    const isReportingFilterEnabled = isFilterActive || refReportId.current > 0
    const reportingFilters = reportDataset?.filters?.map(f => f.qId) || []

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: '100%',
                    justifyItems: 'center',
                    alignItems: 'center'
                }}
                className={classNames?.headerContainer || ''}>
                <Box display="flex" justifyContent="center" mr={2}>
                    <IconTooltip title={t(translation.reportingDialogIconRefresh)}>
                        <IconButton
                            edge="end"
                            color={color}
                            className={classNames?.refreshButton || ''}
                            onClick={() => handleRefreshReport(refReportId.current)}
                            disabled={!isReportingRefreshEnabled}>
                            <RefreshIcon fontSize="medium" />
                        </IconButton>
                    </IconTooltip>
                </Box>
                {views.includes('Filter') && (
                    <Box
                        className={classes.boxControl}
                        display="flex"
                        alignItems="center"
                        sx={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <QlikFilterDialog
                            title={t(translations.reportingDialogFilterTitleByDataset)}
                            color={color}
                            defaultFilters={defaultAppFilters}
                            qlikAppIds={[qlikCurrAppId]}
                            filterIds={reportingFilters}
                            isEmptyWithoutFiltering={true}
                            isDisabled={!isReportingFilterEnabled}
                            classNames={{
                                iconButton: `${classes.iconButton} ${classNames?.menuButton || ''}`
                            }}
                        />
                    </Box>
                )}
                {views.includes('Comments') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <QlikBaseSocialProvider
                            vizReportId={refReportId.current}
                            qlikAppId={qlikCurrAppId}>
                            <QlikReportingCommentDialog
                                classNames={{
                                    commentButton: classNames?.menuButton || ''
                                }}
                            />
                        </QlikBaseSocialProvider>
                    </Box>
                )}
                {views.includes('ImportExport') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <QlikReportingImportExportDialog
                            classNames={{
                                menuButton: `${classes.iconButton} ${classNames?.menuButton || ''}`,
                                buttonCancel: `${classNames?.buttonCancel || ''}`,
                                buttonSave: `${classNames?.buttonSave || ''}`
                            }}
                            color={color}
                            onHandleRestoreVisualizationCallback={onRestoreVisualizationCallback}
                        />
                    </Box>
                )}
                {views.includes('Share') && !isUserAdmin && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={renderShareTooltipText()}>
                            <IconButton
                                aria-label="favorite"
                                component="span"
                                onClick={() =>
                                    isReportingControlEnabled ? handleClickOpen(1) : null
                                }
                                className={`${classes.iconButton} ${classNames?.menuButton || ''}`}
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                disabled={!isReportingControlEnabled}
                                sx={{
                                    ...cssReportingControlButtonIcon
                                }}>
                                {reportingShareNode || <ShareIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}
                {views.includes('Clone') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.toolbarClone)}>
                            <IconButton
                                className={`${classes.iconButton} ${classNames?.menuButton || ''}`}
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                sx={{
                                    ...cssReportingControlButtonIcon
                                }}
                                disabled={!isReportingCloneEnabled}
                                onClick={() => onOpenCloneDialog()}>
                                {reportingCloneNode || <CopyIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>{' '}
                    </Box>
                )}

                {views.includes('Erase') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.toolbarErase)}>
                            <IconButton
                                className={`${classes.iconButton} ${classNames?.menuButton || ''}`}
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                sx={{
                                    ...cssReportingControlButtonIcon
                                }}
                                onClick={() => setEraseDialogOpen(true)}
                                disabled={!isReportingEraseEnabled || !isNewReportActive}>
                                {reportingEraseNode || <ClearIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>{' '}
                    </Box>
                )}
                {views.includes('Remove') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.reportingControlRemoveTooltip)}>
                            <IconButton
                                sx={{
                                    ...cssReportingControlButtonIcon
                                }}
                                disabled={!isReportingControlEnabled}
                                className={`${classes.iconButton} ${classNames?.menuButton || ''}`}
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                onClick={() => setDeleteDialogOpen(true)}>
                                {reportingRemoveNode || <DeleteIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}
                {views.includes('Edit') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.reportingToolbarEditTooltip)}>
                            <IconButton
                                sx={{ ...cssReportingControlButtonIcon }}
                                className={`${classes.iconButton} ${classNames?.menuButton || ''}`}
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                disabled={!isReportingControlEnabled || !isNewReportActive}
                                onClick={() => handleClickOpen(2)}>
                                {reportingEditNode || <EditIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}
                {views.includes('Add') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title="Add Report">
                            <IconButton
                                sx={{ ...cssReportingControlButtonIcon }}
                                className={`${classes.iconButton} ${classNames?.menuButton || ''}`}
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                onClick={() => handleOnAddReport()}
                                disabled={!isReportingAddEnabled}>
                                {reportingAddNode || <AddIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}
                {views.includes('Reports') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.reportingDialogMyReportsTooltip)}>
                            <IconButton
                                aria-label="favorite"
                                component="span"
                                onClick={() => handleClickOpen(3)}
                                className={`${classes.iconButton} ${classNames?.menuButton || ''}`}
                                disabled={isLoading}
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                sx={{
                                    ...cssReportingControlButtonIcon
                                }}>
                                {reportingListNode || <ListIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}
                {isEditMode
                    ? views.includes('Cancel') && (
                          <Box
                              className={classes.boxControl}
                              style={{
                                  borderLeft: !isToolbarWithDivider
                                      ? '0px !important'
                                      : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                              }}>
                              <IconTooltip title={t(translation.reportingDialogCancelTooltip)}>
                                  <IconButton
                                      aria-label="favorite"
                                      component="span"
                                      onClick={() => handleCancelOnClick()}
                                      className={
                                          !isEditMode
                                              ? `${classes.fixed} ${classNames?.actionButton || ''}`
                                              : `${classes.nonFixed} ${
                                                    classNames?.actionButtonActive || ''
                                                }`
                                      }
                                      classes={{
                                          root: classes.iconButtonRoot,
                                          disabled: classes.iconButtonDisabled
                                      }}
                                      sx={{
                                          ...cssReportingControlButtonIcon
                                      }}>
                                      {reportingCancelNode || (
                                          <CloseIcon className={classes.iconSize} />
                                      )}
                                  </IconButton>
                              </IconTooltip>
                          </Box>
                      )
                    : null}
                {views.includes('Save') && (
                    <Box
                        className={classes.boxControl}
                        ml={0.0025}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '1px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip
                            title={
                                isNewReportActive
                                    ? t(translation.reportingDialogSaveTooltip)
                                    : t(translation.reportingDialogSaveTooltipDisabled)
                            }>
                            <IconButton
                                aria-label="favorite"
                                component="span"
                                onClick={() => (isNewReportActive ? handleClickOpen(2) : null)}
                                disabled={!isEditMode}
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                className={
                                    !isEditMode
                                        ? `${classes.fixed} ${classNames?.actionButton || ''}`
                                        : `${classes.nonFixed} ${
                                              classNames?.actionButtonActive || ''
                                          }`
                                }
                                sx={{
                                    ...cssReportingControlButtonIcon
                                }}>
                                {reportingSaveNode || <SaveIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}
            </Box>
            {open && (
                <DraggableDialog
                    dialogProps={{ maxWidth: activeModal === 1 ? 'md' : 'lg' }}
                    dismissDialogCallback={handleClose}
                    hideBackdrop={false}
                    closeTooltipText={t('qplus-dialog-close')}
                    title={renderTitle()}
                    pageId={location.pathname}
                    searchParams={searchParams}>
                    <DialogContent style={{ padding: '0px', minHeight: '60vh' }}>
                        <Container style={{ padding: '0px', width: '100%' }}>
                            <Paper elevation={0} className={classes.root}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    variant="fullWidth"
                                    classes={{
                                        indicator: classesTab.indicator
                                    }}
                                    textColor="primary"
                                    aria-label="icon label tabs">
                                    {activeModal === 3 ? (
                                        <Tab
                                            label={
                                                <span
                                                    className={classes.tabLabel}
                                                    style={{
                                                        fontWeight: value === 0 ? 600 : 500
                                                    }}>
                                                    <ViewListIcon
                                                        sx={{
                                                            marginRight: '10px'
                                                        }}
                                                    />
                                                    {t(translation.reportingDialogTabList)} (
                                                    {userReportCount})
                                                </span>
                                            }
                                            {...a11yProps(0)}
                                            key={`${0}`}
                                        />
                                    ) : null}
                                    {activeModal === 3 ? (
                                        <Tab
                                            label={
                                                <span
                                                    className={classes.tabLabel}
                                                    style={{
                                                        fontWeight: value === 1 ? 600 : 500
                                                    }}>
                                                    <TemplateIcon
                                                        sx={{
                                                            marginRight: '10px'
                                                        }}
                                                    />
                                                    {t(
                                                        translation.reportingDialogListTemplateReports
                                                    )}{' '}
                                                    ({templateReportCount})
                                                </span>
                                            }
                                            {...a11yProps(1)}
                                            key={`${1}`}
                                        />
                                    ) : null}
                                    {activeModal === 3 &&
                                    views.includes('Share') &&
                                    !isUserAdmin ? (
                                        <Tab
                                            label={
                                                <span
                                                    className={classes.tabLabel}
                                                    style={{
                                                        fontWeight: value === 1 ? 600 : 500
                                                    }}>
                                                    <ShareIcon
                                                        sx={{
                                                            marginRight: '10px'
                                                        }}
                                                    />
                                                    {t(translation.reportingDialogSharedTitle)} (
                                                    {sharedReportCount})
                                                </span>
                                            }
                                            {...a11yProps(2)}
                                            key={`${2}`}
                                        />
                                    ) : null}
                                </Tabs>
                                <TabsPanel
                                    value={value}
                                    index={0}
                                    key={`tab-panel-${0}`}
                                    css={activeModal !== 2 ? { padding: '0px' } : null}>
                                    {activeModal === 3 ? (
                                        <QlikReportingListDialog
                                            qlikAppId={qlikCurrAppId}
                                            onHandleRestoreCallback={handleOnRestore}
                                            views={views}
                                            color={color}
                                            LoaderComponent={LoaderComponent}
                                        />
                                    ) : null}
                                    {activeModal === 2 ? (
                                        <QlikReportingFormDialog
                                            reportDataset={reportDataset}
                                            reportDimensions={reportSelectedDimensions}
                                            reportMeasures={reportSelectedMeasures}
                                            reportFilters={reportFilters}
                                            reportVizType={reportVizType}
                                            reportOptions={reportVizOptions}
                                            reportVizColumns={reportVizColumns}
                                            color={color}
                                            classNames={classNames}
                                            showPinWallList={showPinWallList}
                                            onSuccessfulCreateReport={handleSuccessfulReportCreate}
                                            onSuccessfulUpdateReport={handleSuccessfulReportUpdate}
                                        />
                                    ) : null}
                                    {activeModal === 1 ? (
                                        <QlikReportingShareFormDialog
                                            reportId={refReportId.current}
                                            color={color}
                                            classNames={classNames}
                                            onClose={() => {
                                                setOpen(false)
                                                setActiveModal(0)
                                            }}
                                        />
                                    ) : null}
                                </TabsPanel>

                                <TabsPanel
                                    value={value}
                                    index={1}
                                    key={`tab-panel-${1}`}
                                    css={{ padding: '0px' }}>
                                    <QlikReportingTemplateListDialog
                                        qlikAppId={qlikCurrAppId}
                                        onHandleRestoreCallback={handleOnRestore}
                                        views={views}
                                        color={color}
                                        LoaderComponent={LoaderComponent}
                                    />
                                </TabsPanel>

                                {views.includes('Share') && (
                                    <TabsPanel
                                        value={value}
                                        index={2}
                                        key={`tab-panel-${2}`}
                                        css={{ padding: '0px' }}>
                                        <QlikReportingShareListDialog
                                            qlikAppId={qlikCurrAppId}
                                            color={color}
                                            LoaderComponent={LoaderComponent}
                                            onHandleRestoreCallback={handleOnRestore}
                                        />
                                    </TabsPanel>
                                )}
                            </Paper>
                        </Container>
                    </DialogContent>
                </DraggableDialog>
            )}
            {deleteDialogOpen && (
                <ConfirmationDialog
                    primaryText={t(translation.reportingDialogConfirmationTitleDelete)}
                    hideBackdrop={false}
                    noText={t(translation.reportingDialogConfirmationNo)}
                    yesText={t(translation.reportingDialogConfirmationYes)}
                    dialogTitleText={t(translation.reportingDialogConfirmationTitle)}
                    onClose={onCloseDeleteDialog}
                    onNo={onCloseDeleteDialog}
                    onYes={() => handleReportDelete(refReportId.current)}
                />
            )}
            {eraseDialogOpen && (
                <ConfirmationDialog
                    primaryText={t(translation.dialogConfirmationTitleEraseReport)}
                    hideBackdrop={false}
                    noText={t(translation.confirmationNo)}
                    yesText={t(translation.confirmationYes)}
                    dialogTitleText={t(translation.confirmationTitle)}
                    onClose={onCloseEraseDialog}
                    onNo={onCloseEraseDialog}
                    onYes={() => {
                        onCloseEraseDialog()
                        eraseReport()
                    }}
                />
            )}
            {cloneDialogOpen && (
                <ConfirmationDialog
                    primaryText={t(translation.reportingDialogCopyMsg)}
                    hideBackdrop={false}
                    noText={t(translation.reportingDialogConfirmationNo)}
                    yesText={t(translation.reportingDialogConfirmationYes)}
                    dialogTitleText={t(translation.reportingDialogConfirmationTitle)}
                    onClose={onCloseCloneDialog}
                    onNo={onCloseCloneDialog}
                    onYes={() => handleCloneReport()}
                />
            )}
        </>
    )
}

export default QlikReportingDialog

const useStyles = makeStyles()(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        boxShadow: 'none'
    },
    rowLayout: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center' // To be vertically aligned
    },
    textField: {
        fontWeight: 500
    },

    box: {
        textAlign: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingTop: '30px'
    },
    tabLabel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fixed: {
        cursor: 'pointer',
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.dark
        }
    },
    nonFixed: {
        cursor: 'pointer',
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.dark
        }
    },
    iconSize: {
        width: '24px',
        height: '24px'
    },
    iconButtonRoot: {
        padding: 0,
        height: '100%',
        width: '100%',
        borderRadius: '0px !important'
    },
    iconButtonDisabled: {},
    iconButton: {
        color: theme.palette.primary.dark,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText
        },
        borderRadius: '0px !important'
    },
    iconButtonCancel: {
        cursor: 'pointer',
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.dark
        },
        borderRight: `1px solid ${theme.palette.secondary.contrastText}`
    },
    boxControl: {
        textAlign: 'center',
        height: '100%',
        width: '100%',
        minWidth: '55px'
    }
}))
