import React, { FC, useEffect } from 'react'

import { useLocation } from 'react-router-dom'
import { useCopyToClipboard } from 'react-use'

import { Button, Container, DialogActions, DialogContent, Input, Paper, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { AlertType, DraggableDialog, useAlertContext } from '@libs/common-ui'
import { useParseFilters } from '@libs/core-hooks'
import {
    ReportDataset,
    ReportDimensions,
    ReportExport,
    ReportFilters,
    ReportMeasures,
    ReportVisualizations
} from '@libs/core-models'
import { useQlikMasterItemContext } from '@libs/qlik-providers'

import translation from '../../constants/translations'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { useParseDimensions, useParseMeasures } from '../../hooks'
import QlikReportingImportExportIconButton, {
    TQlikReportingImportExportIconButton
} from '../iconButton/QlikReportingImportExportIconButton'

interface IQlikReportingImportExportDialogProps {
    classNames?: TQlikReportingImportExportIconButton
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    onHandleRestoreVisualizationCallback(
        vizType: string,
        dataset: ReportDataset,
        dimensions: ReportDimensions[],
        measures: ReportMeasures[],
        visualizations: ReportVisualizations[],
        options: any,
        filters?: ReportFilters[],
        qsBookmarkId?: string,
        reportId?: number,
        title?: string,
        description?: string,
        isSystem?: boolean,
        isPinwallable?: boolean,
        isImported?: boolean
    )
}

const QlikReportingImportExportDialog: FC<IQlikReportingImportExportDialogProps> = ({
    classNames,
    color,
    onHandleRestoreVisualizationCallback
}) => {
    const [open, setOpen] = React.useState<boolean>(false)
    const [type, setType] = React.useState<string>('')
    const [codeValue, setCodeValue] = React.useState<string>('')
    const [importExportInProgress, setImportExportInProgress] = React.useState<boolean>(false)
    const [datasets, setDatasets] = React.useState<ReportDataset[]>([])
    const {
        reportSelectDatasets,
        reportFilters,
        reportDataset,
        reportVizType,
        reportVizOptions,
        reportTitle,
        reportDescription,
        reportSelectedDimensions,
        reportSelectedMeasures,
        reportDefaultFilters,
        clearReport,
        exportReport,
        importReport
    } = useQlikReportingContext()
    const { qMasterDimensionsMap, qMasterMeasuresMap } = useQlikMasterItemContext()

    const { setParseDimensions } = useParseDimensions()
    const { setParseMeasures } = useParseMeasures()
    const { setParseFilters } = useParseFilters()
    const { showToast } = useAlertContext()
    const { classes } = useStyles()

    const [, copy] = useCopyToClipboard()

    const { t } = useI18n()

    const location = useLocation()
    const searchParams = new URLSearchParams(window.location.search)

    useEffect(() => {
        if (reportSelectDatasets) setDatasets(reportSelectDatasets)
    }, [reportSelectDatasets])

    const handleClose = () => {
        setCodeValue('')
        setOpen(false)
    }

    const handleOpen = async (type: string) => {
        setType(type)
        setOpen(true)
        if (type === 'export') {
            const report = {
                content: {
                    dimensions: reportSelectedDimensions?.map(dim => {
                        return dim.qLibraryId
                    }),
                    measures: reportSelectedMeasures?.map(measure => {
                        return measure.qLibraryId
                    }),
                    options: reportVizOptions,
                    filters: reportFilters.map(filter => {
                        return filter.qLibraryId
                    })
                },
                title: reportTitle,
                description: reportDescription,
                visualizationType: reportVizType,
                dataset: reportDataset
            } as ReportExport
            const encoded: string = await exportReport(report)
            setCodeValue(encoded)
        }
    }

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleImportExport()
        }
    }

    const onValueChange = (event: any) => {
        setCodeValue(event.target.value)
    }

    const handleImportExport = async () => {
        setImportExportInProgress(true)
        if (type === 'export') {
            copy(codeValue)
            showToast(
                t(translation.reportingImportExportModalToastSuccessMessage),
                AlertType.SUCCESS
            )
        }
        if (type === 'import') {
            try {
                // Clear report before import
                clearReport()

                // Apply import logic from encoded base 64 value
                const importedReport = await importReport(codeValue)
                const filteredDataset = datasets?.find(d => d.id === importedReport.dataset.id)
                if (filteredDataset) {
                    const dimensions = qMasterDimensionsMap.get(filteredDataset.qlikAppId)
                    const measures = qMasterMeasuresMap.get(filteredDataset.qlikAppId)

                    const dataset = importedReport.dataset
                    const lDimensions = setParseDimensions(
                        importedReport.content.dimensions,
                        dimensions
                    )
                    const lMeasures = setParseMeasures(importedReport.content.measures, measures)
                    const lFilters = setParseFilters(
                        importedReport.content.filters,
                        dimensions,
                        reportDefaultFilters
                    )
                    onHandleRestoreVisualizationCallback(
                        importedReport.visualizationType,
                        dataset,
                        lDimensions,
                        lMeasures,
                        filteredDataset.visualizations,
                        importedReport.content.options,
                        lFilters,
                        null,
                        0,
                        importedReport.title,
                        importedReport.description,
                        false,
                        false,
                        true
                    )
                } else {
                    showToast(t(translation.reportingRestoreDatasetError), AlertType.ERROR)
                }
            } catch (error) {
                console.log('Qplus Error', error)
            }
        }
        handleClose()
        setImportExportInProgress(false)
    }

    return (
        <>
            <QlikReportingImportExportIconButton
                classNames={classNames}
                color={color}
                openImportExportModal={(type: string) => handleOpen(type)}
            />

            {open && (
                <DraggableDialog
                    dialogProps={{ maxWidth: 'md' }}
                    closeTooltipText={t('qplus-dialog-close')}
                    hideBackdrop={false}
                    dismissDialogCallback={handleClose}
                    title={t(translation.reportingImportExportModalTitle)}
                    pageId={location.pathname}
                    searchParams={searchParams}>
                    <DialogContent style={{ padding: '0px', flex: '0.8 1' }}>
                        <Container style={{ padding: '0px' }}>
                            <Paper elevation={0} className={classes.root}>
                                <Input
                                    type="textarea"
                                    className={classes.codeTextarea}
                                    placeholder={'Paste your import code here'}
                                    onKeyPress={handleKeyPress}
                                    onChange={onValueChange}
                                    minRows={18}
                                    multiline={true}
                                    value={codeValue}
                                />
                            </Paper>
                        </Container>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={handleClose}
                            className={`${classes.buttonCancel} ${classNames?.buttonCancel}`}
                            disabled={importExportInProgress}>
                            {t(translation.reportingDialogSettingsBtnCancel)}
                        </Button>
                        <Button
                            onClick={handleImportExport}
                            className={`${classes.buttonSave} ${classNames?.buttonSave}`}
                            disabled={importExportInProgress}>
                            {t(
                                type === 'import'
                                    ? translation.reportingImportExportModalBtnImport
                                    : translation.reportingImportExportModalBtnExport
                            )}
                        </Button>
                    </DialogActions>
                </DraggableDialog>
            )}
        </>
    )
}

export default QlikReportingImportExportDialog

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        boxShadow: 'none'
    },
    paper: {
        width: '850px',
        height: '720px',
        minWidth: '850px',
        minHeight: '720px',
        padding: '0px'
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
        backgroundColor: theme.palette.background.paper,
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
        display: 'flex',
        justifyContent: 'center',
        minWidth: '96px',
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
    dialogTitle: {
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: '20px',
        letterSpacing: 0,
        top: '5px',
        color: theme.palette.text.primary
    },
    tabLabel: {
        fontWeight: 500
    },
    codeTextarea: {
        width: '94%',
        margin: '3%',
        paddingLeft: '5px',
        paddingRight: '5px',
        minHeight: '400px',
        alignItems: 'baseline',
        fontWeight: 400,
        background: theme.palette.background.default
    }
}))
