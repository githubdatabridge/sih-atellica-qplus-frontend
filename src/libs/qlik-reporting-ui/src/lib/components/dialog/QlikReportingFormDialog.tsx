import React, { FC, useEffect, useMemo, useRef, useState } from 'react'

import { useLocation } from 'react-router-dom'
import { useAsyncFn, useMount, useUnmount } from 'react-use'

import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    List,
    ListItem,
    TextField,
    Theme,
    Typography,
    useTheme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'
import { v4 as uuidv4 } from 'uuid'

import { useI18n } from '@libs/common-providers'
import { AlertDuration, AlertType, BaseSwitch, useAlertContext } from '@libs/common-ui'
import { KEYS, storage } from '@libs/common-utils'
import {
    PinWall,
    ReportDataset,
    ReportDimensions,
    ReportFilters,
    ReportMeasures,
    ReportPatchPayload
} from '@libs/core-models'
import { pinWallService, reportService } from '@libs/core-services'
import { QlikVisualizationApiCore } from '@libs/qlik-base-ui'
import { useQlikAppContext } from '@libs/qlik-providers'

import {
    REPORTING_BASE_CHARTS,
    URL_QUERY_PARAM_VALUE_CRUD_NEW,
    URL_QUERY_PARAM_VALUE_TYPE_REPORTS
} from '../../constants/constants'
import translation from '../../constants/translations'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { useReplaceQueryParams } from '../../hooks'
import { TQlikReportingCoreClasses } from '../../QlikReportingCore'

export interface IQlikReportingFormDialogProps {
    reportDataset?: ReportDataset
    reportDimensions?: ReportDimensions[]
    reportMeasures?: ReportMeasures[]
    reportFilters?: ReportFilters[]
    reportVizType?: string
    reportOptions?: any
    reportVizColumns?: any[]
    showPinWallList?: boolean
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    classNames?: Partial<TQlikReportingCoreClasses>
    onSuccessfulCreateReport?: (reportId: number, isSystem: boolean) => void
    onSuccessfulUpdateReport?: () => void
}

const QlikReportingFormDialog: FC<IQlikReportingFormDialogProps> = ({
    reportDataset,
    reportVizType,
    reportDimensions,
    reportMeasures,
    reportFilters,
    reportOptions,
    reportVizColumns,
    color = 'secondary',
    showPinWallList,
    classNames,
    onSuccessfulCreateReport,
    onSuccessfulUpdateReport
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {
        setReportTitle,
        setReportDescription,
        setIsReportPinwallable,
        setIsReportWithBookmark,
        createReport,
        reportId,
        reportTitle,
        reportDescription,
        isReportPersonal,
        isReportPinwallable,
        isReportWithBookmark
    } = useQlikReportingContext()
    const [title, setTitle] = useState<string>(reportTitle ? reportTitle : '')
    const [description, setDescription] = useState<string>(
        reportDescription ? reportDescription : ''
    )

    const [isPinwallable, setIsPinwallable] = useState<boolean>(isReportPinwallable)
    const [isWithBookmark, setIsWithBookmark] = useState<boolean>(isReportWithBookmark)
    const [visualizationElementId] = useState(uuidv4())
    const [pinwalls, setPinwalls] = useState<any>([])
    const [selectedPinWalls, setSelectedPinWalls] = useState<number[]>([])
    const { qAppMap } = useQlikAppContext()

    const { setReplaceQueryParams } = useReplaceQueryParams()
    const { showToast } = useAlertContext()
    const location = useLocation()

    const qViz = useRef<any>(null)
    const theme = useTheme<Theme>()
    const { classes } = useStyles()

    const { t } = useI18n()

    const useInputStyles = makeStyles()((theme: Theme) => ({
        inputRoot: {
            color: theme.palette.text.primary
        },
        underline: {
            color: '#e0e0e0',
            '&&&:before': {
                borderBottom: '1px solid #e0e0e0'
            },
            '&&:after': {
                border: `1px solid ${
                    color === 'secondary'
                        ? theme.palette.secondary.main
                        : color === 'primary'
                        ? theme.palette.primary.main
                        : theme.palette.info.main
                }`
            }
        },
        cssOutlinedInput: {
            '&$cssFocused $notchedOutline': {
                borderColor: `${
                    color === 'secondary'
                        ? theme.palette.secondary.main
                        : color === 'primary'
                        ? theme.palette.primary.main
                        : theme.palette.info.main
                } !important`
            }
        },
        cssFocused: {},
        notchedOutline: {
            borderWidth: '1px',
            borderColor: '#e0e0e0 !important'
        }
    }))

    useMount(async () => {
        const isAdminOn = storage.load(KEYS.QPLUS_ROLE_IS_ADMIN)
        if (reportDataset) {
            const qApp = qAppMap.get(reportDataset.qlikAppId)
            const vizNew = await qApp?.qApi?.$apiVisualization.create(
                reportVizType,
                reportVizColumns,
                reportOptions
            )
            if (vizNew) {
                qViz.current = vizNew.qVisualization
                await vizNew.show(visualizationElementId)
            }
            if (!isAdminOn) {
                const pinwalls = await pinWallService.getAllPinWalls()
                setPinwalls(pinwalls)
            }
        }
    })

    useUnmount(async () => {
        if (qViz.current) {
            await qViz.current.close()
        }
        onClear()
    })

    const handleTogglePinwall = (event: any) => {
        if (!event.target.checked) setSelectedPinWalls([])
        setIsReportPinwallable(event.target.checked)
        setIsPinwallable(event.target.checked)
    }

    const handleSelectPinwall = (id: number) => {
        const current = [...selectedPinWalls]
        const index = current.findIndex(r => r === id)
        if (index !== -1) {
            current.splice(index, 1)
        } else {
            current.push(id)
        }
        setSelectedPinWalls(current)
    }

    const [reportState, submitReport] = useAsyncFn(async () => {
        try {
            if (!title) return

            const qApp = qAppMap.get(reportDataset.qlikAppId)

            // create bookmark if include selections is ON
            const qlikBookmarkId = isWithBookmark
                ? await qApp?.qApi?.$apiBookmark.create(title, description)
                : null

            // create report
            const payload: any = {
                content: {
                    dimensions: reportDimensions.map(d => d.qLibraryId),
                    measures: reportMeasures.map(m => m.qLibraryId),
                    options: reportOptions,
                    filters:
                        reportFilters?.map(f => {
                            if (f?.qLibraryId) {
                                return f.qLibraryId
                            }
                            if (f?.qFieldName) {
                                return f.qFieldName
                            }
                        }) || []
                },
                title,
                datasetId: reportDataset.id,
                visualizationType: reportVizType,
                pageId: location.pathname,
                isPinwallable: isPinwallable
            }

            if (qlikBookmarkId) {
                payload.qlikState = {
                    qsBookmarkId: qlikBookmarkId
                }
            }
            if (description) payload.description = description
            const newReport = await createReport(payload)
            setReplaceQueryParams(
                newReport.id,
                URL_QUERY_PARAM_VALUE_TYPE_REPORTS,
                URL_QUERY_PARAM_VALUE_CRUD_NEW
            )
            if (!!newReport && !!selectedPinWalls.length) {
                for (let i = 0; i < selectedPinWalls.length; i++) {
                    const pw: PinWall = pinwalls?.find(p => p.id === selectedPinWalls[i])
                    if (pw) {
                        const cIndex = pw.content?.cells?.findIndex(
                            c => c.visualizationId && c.visualizationId.includes('empty')
                        )
                        if (cIndex && cIndex !== -1) {
                            delete pw?.content?.cells[cIndex]?.visualizationId
                            pw.content.cells[cIndex].reportId = newReport.id
                        } else {
                            pw.content.cells = [
                                {
                                    reportId: newReport.id,
                                    height: 1,
                                    width: 1,
                                    x: 0,
                                    y: 0
                                }
                            ]
                        }
                        const payload: any = {
                            title: pw.title,
                            content: pw.content
                        }
                        if (pw.description) payload.description = pw.description
                        await pinWallService.updatePinWall(pw.id, payload)
                    }
                }
            }

            showToast(t(translation.reportingDialogFormToastSuccessMessage), AlertType.SUCCESS)
            setIsReportPinwallable(newReport.isPinwallable)
            setIsReportWithBookmark(newReport.qlikState?.qsBookmarkId ? true : false)
            setReportTitle(newReport.title)
            setReportDescription(newReport.description)
            if (onSuccessfulCreateReport) onSuccessfulCreateReport(newReport.id, newReport.isSystem)
        } catch (error) {
            console.log('Qplus Error', error)
            showToast(
                t(translation.reportingCreateErrorMsg),
                AlertType.ERROR,
                AlertDuration.VERY_LONG
            )
        }
    }, [
        title,
        description,
        isPinwallable,
        isWithBookmark,
        selectedPinWalls,
        reportFilters,
        location?.pathname
    ])

    const clearError = !title

    const onClear = () => {
        setTitle('')
        setDescription('')
        setIsPinwallable(false)
        setIsWithBookmark(false)
    }

    const updateReport = async () => {
        try {
            setIsLoading(true)
            if (!title) return

            const qApp = qAppMap.get(reportDataset.qlikAppId)
            const qlikBookmarkId = isWithBookmark
                ? await qApp?.qApi?.$apiBookmark.create(title, description)
                : null

            const payload: ReportPatchPayload = {
                content: {
                    dimensions: reportDimensions.map(d => d.qLibraryId),
                    measures: reportMeasures.map(m => m.qLibraryId),
                    options: reportOptions,
                    filters:
                        reportFilters?.map(f => {
                            if (f?.qLibraryId) {
                                return f.qLibraryId
                            }
                            if (f?.qFieldName) {
                                return f.qFieldName
                            }
                        }) || []
                },
                title,
                datasetId: +reportDataset.id,
                visualizationType: reportVizType,
                isPinwallable: isPinwallable
            }

            if (qlikBookmarkId) {
                payload.qlikState = {
                    qsBookmarkId: qlikBookmarkId
                }
            }
            if (description) payload.description = description
            const newReport = await reportService.patchReport(reportId, payload)

            if (!!newReport && !!selectedPinWalls.length) {
                for (let i = 0; i < selectedPinWalls.length; i++) {
                    const pw: PinWall = pinwalls?.find(p => p.id === selectedPinWalls[i])
                    if (pw) {
                        const cIndex = pw.content?.cells?.findIndex(
                            c => c.visualizationId && c.visualizationId.includes('empty')
                        )
                        if (cIndex && cIndex !== -1) {
                            delete pw?.content?.cells[cIndex]?.visualizationId
                            pw.content.cells[cIndex].reportId = newReport.id
                        } else {
                            pw.content.cells = [
                                {
                                    reportId: newReport.id,
                                    height: 1,
                                    width: 1,
                                    x: 0,
                                    y: 0
                                }
                            ]
                        }
                        const payload: any = {
                            title: pw.title,
                            content: pw.content
                        }
                        if (pw.description) payload.description = pw.description
                        await pinWallService.updatePinWall(pw.id, payload)
                    }
                }
            }

            showToast(
                t(translation.reportingDialogFormUpdateToastSuccessMessage),
                AlertType.SUCCESS
            )
            setIsReportPinwallable(newReport.isPinwallable)
            setIsReportWithBookmark(!!newReport?.qlikState?.qsBookmarkId)
            setReportTitle(newReport.title)
            setReportDescription(newReport.description)
            if (onSuccessfulUpdateReport) onSuccessfulUpdateReport()
        } catch (error) {
            console.log('Qplus Error', error)
            showToast(
                t(translation.reportingUpdateErrorMsg),
                AlertType.ERROR,
                AlertDuration.VERY_LONG
            )
        } finally {
            setIsLoading(false)
        }
    }

    const renderReportViz = useMemo(() => {
        if (reportVizType) {
            return (
                <QlikVisualizationApiCore
                    qlikAppId={reportDataset.qlikAppId}
                    vizOptions={{
                        vizType: !REPORTING_BASE_CHARTS.includes(reportVizType)
                            ? reportOptions?.qInfo?.qType
                            : reportVizType,
                        columns: reportVizColumns,
                        options: reportOptions
                    }}
                />
            )
        }
    }, [reportDataset?.qlikAppId, reportOptions, reportVizType, reportVizColumns])

    const { classes: classesInput } = useInputStyles()

    return (
        <>
            <Box className={classes.root}>
                <Box className={classes.container}>
                    <Box mb={2}>
                        <TextField
                            value={title}
                            label={
                                <Typography
                                    align="left"
                                    color="primary"
                                    className={classes.textField}>
                                    {t(translation.reportingDialogFormTitle)}
                                </Typography>
                            }
                            color="primary"
                            className={classes.titleContainer}
                            InputProps={{
                                classes: {
                                    root: classesInput.inputRoot,
                                    underline: classesInput.underline,
                                    input: classes.inputText
                                }
                            }}
                            onChange={e => {
                                setTitle(e.target.value)
                            }}
                        />
                    </Box>
                    <Box>
                        <FormControlLabel
                            control={
                                <BaseSwitch
                                    checked={isPinwallable}
                                    onChange={handleTogglePinwall}
                                    name="setIsPinwallable"
                                    sx={{ color: theme.palette.info.main }}
                                    color={'secondary'}
                                    defaultChecked
                                />
                            }
                            label={
                                <Typography
                                    align="left"
                                    color="primary"
                                    className={classes.textField}>
                                    {t(translation.reportingDialogFormMakeItPinnable)}
                                </Typography>
                            }
                        />
                    </Box>
                    {isPinwallable && showPinWallList && pinwalls.length > 0 ? (
                        <List className={classes.listContainer}>
                            {pinwalls.map(pw => (
                                <ListItem className={classes.listItem}>
                                    <Checkbox
                                        edge="start"
                                        color="secondary"
                                        onClick={() => handleSelectPinwall(pw.id)}
                                        className={classes.listItemCheckbox}
                                    />
                                    <Typography className={classes.listItemText}>
                                        {pw.title}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    ) : null}
                </Box>
                <Box className={classes.reportVizContainer}>{renderReportViz}</Box>
            </Box>
            <Box className={classes.descriptionHeader}>
                <Typography align="left" color="primary" className={classes.textField}>
                    {t(translation.reportingDialogFormDescription)}
                </Typography>
            </Box>
            <TextField
                fullWidth
                value={description}
                variant="outlined"
                onChange={e => {
                    setDescription(e.target.value)
                }}
                multiline
                rows={4}
                InputProps={{
                    classes: {
                        root: classesInput.cssOutlinedInput,
                        focused: classesInput.cssFocused,
                        notchedOutline: classesInput.notchedOutline,
                        input: classes.inputText
                    }
                }}></TextField>
            <Box mb={2} mt={5} display="flex" justifyContent="flex-end">
                <Button
                    onClick={onClear}
                    disabled={clearError}
                    className={`${classes.buttonCancel} ${classNames?.buttonCancel || ''}`}>
                    {t(translation.reportingDialogFormBtnCancel)}
                </Button>
                <Button
                    onClick={isReportPersonal && reportId ? updateReport : submitReport}
                    className={
                        clearError || reportState.loading || isLoading
                            ? classes.buttonDisabled
                            : `${classes.buttonSave} ${classNames?.buttonSave || ''}`
                    }
                    disabled={clearError}>
                    {reportState.loading || isLoading ? (
                        <CircularProgress color={color} size={20} />
                    ) : isReportPersonal && reportId ? (
                        t(translation.reportingDialogFormBtnUpdate)
                    ) : (
                        t(translation.reportingDialogFormBtnSave)
                    )}
                </Button>
            </Box>
        </>
    )
}

export default QlikReportingFormDialog

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        display: 'flex',
        maxHeight: '325px'
    },
    container: {
        minWidth: '400px'
    },
    titleContainer: {
        width: '400px'
    },
    textField: {
        fontWeight: 500,
        fontSize: '0.875rem',
        color: theme.palette.text.primary
    },
    textFieldReadonly: {
        fontWeight: 500,
        fontSize: '0.875rem',
        color: theme.palette.text.disabled
    },
    box: {
        textAlign: 'center',
        borderBottom: '1px solid #ebebeb',
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingTop: '30px'
    },
    buttonCancel: {
        marginRight: '20px',
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
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
        }
    },
    buttonDisabled: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px solid ${theme.palette.text.disabled}`,
        color: theme.palette.text.disabled,
        textTransform: 'none'
    },
    iconButton: {
        cursor: 'pointer'
    },
    inputRoot: {
        color: theme.palette.primary.dark
    },
    underline: {
        color: '#e0e0e0',
        '&&&:before': {
            borderBottom: '1px solid #e0e0e0'
        },
        '&&:after': {
            border: `1px solid ${theme.palette.info.main}`
        }
    },
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: `${theme.palette.info.main} !important`
        }
    },
    cssFocused: {},
    notchedOutline: {
        borderWidth: '1px',
        borderColor: '#e0e0e0 !important'
    },
    inputText: {
        color: theme.palette.text.primary,
        fontSize: '0.875rem'
    },
    listContainer: {
        height: '195px',
        marginTop: '16px',
        marginBottom: '16px',
        width: '100%',
        overflow: 'auto',
        padding: 0,
        border: `1px solid ${theme.palette.divider}`
    },
    listItem: {
        paddingTop: '4px',
        paddingBottom: '2px',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    listItemCheckbox: {
        width: '16px',
        height: '16px'
    },
    listItemText: {
        paddingLeft: '10px',
        fontSize: '0.8rem',
        opacity: 0.85
    },
    infoIcon: {
        width: '24px',
        height: '24px',
        marginBottom: '3px'
    },
    reportVizContainer: {
        flexGrow: 1,
        minHeight: '325px',
        paddingLeft: '16px',
        paddingRight: '16px'
    },
    descriptionHeader: {
        marginBottom: '8px',
        marginTop: '8px'
    }
}))
